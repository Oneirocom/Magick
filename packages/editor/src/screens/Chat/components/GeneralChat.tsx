import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from "react";

import { SpellInterface } from '@magickml/core';
import { ArrowBack, ArrowForward } from '@mui/icons-material/';
import { Conversation, KeyValuePair, Message } from "../../../types";
import { cleanConversationHistory, cleanSelectedConversation } from "../../../utils/app/clean";
import { saveConversation, saveConversations, updateConversation } from "../../../utils/app/conversation";
import { exportConversations, importConversations } from "../../../utils/app/data";
import { SingleChat } from "./Chat/SingleChat";
import { Navbar } from "./Mobile/Navbar";
import { Sidebar } from "./Sidebar/Sidebar";
import styles from './chat.module.css';

import { useConfig, usePubSub } from '@magickml/client-core';
import { useFeathers } from '../../../../../core/client/src/providers/FeathersProvider';
import {
  useGetSpellsQuery
} from '../../../state/api/spells';
import EventHandler from './EventHandler';

export default function GeneralChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [spells, setSpells] = useState<SpellInterface[]>([]);
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [chatError, setChatError] = useState<boolean>(false);
  const [chatwindowGraph, setChatwindowGraph] = useState(null)
  const stopConversationRef = useRef<boolean>(false);
  const pubSub = usePubSub()
  const { publish, subscribe, events } = pubSub;

  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()
  const { data: spellsData } = useGetSpellsQuery({
    projectId: config.projectId,
  })

  useEffect(() => {
    if (spellsData) {
      setSpells(spellsData.data)
    }
  }, [spellsData])

  useEffect(() => {
    if (selectedConversation === null) return

    // FIXME: Spell in conversation should only be a string with the spell Id and then we fetch the data from store. 
    // Currently it's saved as the whole spell object in the conversation
    // get selected spell
    const graph = selectedConversation?.spell && selectedConversation?.spell?.graph;

    if (!spells || spells.length === 0 || !graph)
      return

    setChatwindowGraph(graph)
  }, [spells, selectedConversation])

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  const { $PLAYTEST_PRINT, $RUN_SPELL } = events

  const printToConsole = useCallback(
    (_, _text) => {
      const text = (`Agent: ` + _text).split('\n')
      console.log("🚀 ~ file: GeneralChat.tsx:74 ~ GeneralChat ~ text:", text)
      // const newConversations = [...conversations, ...text]
      // setConversations(newConversations as [])
    },
    [conversations]
  )

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(`${selectedConversation?.spell?.id}`), printToConsole)

    // return a clean up function
    return unsubscribe as () => void
  }, [subscribe, printToConsole, $PLAYTEST_PRINT, selectedConversation?.spell?.id])


  const runSpell = async (event, data) => {
    // run the spell in the spell runner service
    client.service('spell-runner').create(data)
  }

  const handleSend = async (message: Message, isResend: boolean) => {
    if (selectedConversation) {
      let updatedConversation: Conversation;

      if (isResend) {
        const updatedMessages = [...selectedConversation.messages];
        updatedMessages.pop();

        updatedConversation = {
          ...selectedConversation,
          messages: [...updatedMessages, message]
        };
      } else {
        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message]
        };
      }

      setSelectedConversation(updatedConversation);
      setLoading(true);
      setMessageIsStreaming(true);
      setMessageError(false);

      // FIXME: What is the purpose of this in playtest?
      // let toSend = message;

      // FIXME: Should we use this data or some other like .chatwindowData????
      // const json2 = localState?.chatwindowData;

      console.log("🚀 ~ file: index.tsx:137 ~ handleSend ~ updatedConversation?.messages:", updatedConversation)
      if (!updatedConversation?.messages?.length || !updatedConversation.spell) {
        enqueueSnackbar('No data provided', {
          variant: 'error',
        })
        return
      }

      const toSend = {
        content: message?.content ?? "",
        sender: 'user',
        observer: 'assistant',
        agentId: 'preview',
        client: 'chatwindow', // 'playtest', ???
        type: 'chatwindow',
        channel: 'previewChannel',
        projectId: config.projectId,
        channelType: 'previewChannelType', // 'playtest', ???
        rawData: JSON.stringify(message),
        entities: ['user', 'assistant'],
      }

      const options = Object.values(chatwindowGraph?.nodes)
        .filter((node: any) => {
          const data = node.data;
          return data?.isInput;
        })
        .map((node: any) => ({
          value: node.data.name ?? node.name,
          label: node.data.name ?? node.name,
        }))

      const chatwindowNode = options[0];

      if (!chatwindowNode?.value) {
        enqueueSnackbar('No input node found for this input type', {
          variant: 'error',
        })
        return
      }

      const data = {
        spellName: selectedConversation.spell.name.split('--')[0],
        id: selectedConversation?.spell?.id,
        projectId: config.projectId,
        inputs: {
          [chatwindowNode?.value as string]: toSend,
        },
        // retrun an array of all nodes where node.data.isPublic is true
        // todo we should move functions like this into a single spell helper
        publicVariables: JSON.stringify(
          Object.values(chatwindowGraph?.nodes || {}).filter(
            (node: { data }) => node?.data?.isPublic
          )
        ),
        secrets: JSON.parse(localStorage.getItem('secrets') || '{}'),
      }

      runSpell(events?.$RUN_SPELL(selectedConversation?.spell?.id), data)

      setLoading(false);

      saveConversation(updatedConversation);

      const updatedConversations: Conversation[] = conversations.map((conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }

        return conversation;
      });

      if (updatedConversations.length === 0) {
        updatedConversations.push(updatedConversation);
      }

      setConversations(updatedConversations);

      saveConversations(updatedConversations);

      setMessageIsStreaming(false);
    }
  };

  const handleExportConversations = () => {
    exportConversations();
  };

  const handleImportConversations = (conversations: Conversation[]) => {
    importConversations(conversations);
    setConversations(conversations);
    setSelectedConversation(conversations[conversations.length - 1]);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: `Conversation ${lastConversation ? lastConversation.id + 1 : 1}`,
      spell: null,
      messages: []
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(updatedConversations[updatedConversations.length - 1]);
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        spell: conversation?.spell ?? null,
      });
      localStorage.removeItem("selectedConversation");
    }
  };

  const handleUpdateConversation = (conversation: Conversation, data: KeyValuePair) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value
    };

    const { single, all } = updateConversation(updatedConversation, conversations);

    setSelectedConversation(single);
    setConversations(all);
  };

  const handleClearConversations = () => {
    setConversations([]);
    localStorage.removeItem("conversationHistory");

    setSelectedConversation({
      id: 1,
      name: "New conversation",
      messages: [],
      spell: null
    });
    localStorage.removeItem("selectedConversation");
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const conversationHistory = localStorage.getItem("conversationHistory");
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] = JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(parsedConversationHistory);
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem("selectedConversation");
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation = JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(parsedSelectedConversation);
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        spell: null
      });
    }
  }, []);

  return (
    <section>
      {selectedConversation?.spell && <EventHandler pubSub={pubSub} conversation={selectedConversation} />}
      {selectedConversation && (
        <main className={styles.mainContainer}>
          <div className={styles.navbarContainer}>
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <article className={styles.mainArticle}>
            {showSidebar ? (
              <>
                <Sidebar
                  loading={messageIsStreaming}
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onNewConversation={handleNewConversation}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onToggleSidebar={() => setShowSidebar(!showSidebar)}
                  onUpdateConversation={handleUpdateConversation}
                  onClearConversations={handleClearConversations}
                  onExportConversations={handleExportConversations}
                  onImportConversations={handleImportConversations}
                />

                <ArrowBack
                  className={styles.arrowBack}
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              </>
            ) : (
              <ArrowForward
                className={styles.arrowForward}
                onClick={() => setShowSidebar(!showSidebar)}
              />
            )}

            <SingleChat
              conversation={selectedConversation}
              messageIsStreaming={messageIsStreaming}
              spells={spells}
              chatError={chatError}
              messageError={messageError}
              loading={loading}
              onSend={handleSend}
              onUpdateConversation={handleUpdateConversation}
              stopConversationRef={stopConversationRef}
            />
          </article>
        </main>
      )}
    </section>
  );
}