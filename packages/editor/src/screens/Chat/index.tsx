import { useEffect, useRef, useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { Navbar } from "./components/Mobile/Navbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatBody, Conversation, KeyValuePair, Message, OpenAIModel, OpenAIModelID, OpenAIModels } from "../../types";
import { cleanConversationHistory, cleanSelectedConversation } from "../../utils/app/clean";
import { DEFAULT_SYSTEM_PROMPT } from "../../utils/app/const";
import { saveConversation, saveConversations, updateConversation } from "../../utils/app/conversation";
import { exportConversations, importConversations } from "../../utils/app/data";
import { ArrowBack, ArrowForward } from '@mui/icons-material/'
import styles from './chat.module.css';
import { Spell } from '@magickml/engine'

import {
    useDeleteSpellMutation,
    useGetSpellsQuery,
    useNewSpellMutation,
} from '../../state/api/spells'
import { useConfig } from '../../contexts/ConfigProvider'
import EventHandler from './components/EventHandler'
import { usePubSub } from '../../contexts/PubSubProvider'

export default function Home() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>();
    const [loading, setLoading] = useState<boolean>(false);
    const [spells, setSpells] = useState<Spell[]>([]);
    const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);
    const [messageError, setMessageError] = useState<boolean>(false);
    const [modelError, setModelError] = useState<boolean>(false);
    const stopConversationRef = useRef<boolean>(false);
    const pubSub = usePubSub()

    const config = useConfig()
    const { data: spellsData } = useGetSpellsQuery({
        projectId: config.projectId,
    })

    useEffect(() => {
        if (spellsData) {
            setSpells(spellsData.data)
        }
    }, [spellsData])



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

            const chatBody: ChatBody = {
                model: updatedConversation.model,
                messages: updatedConversation.messages,
                // FIXME: We don't manage the api keys here
                key: 'apiKey',
                prompt: updatedConversation.prompt
            };

            const controller = new AbortController();
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: controller.signal,
                body: JSON.stringify(chatBody)
            });

            if (!response.ok) {
                setLoading(false);
                setMessageIsStreaming(false);
                setMessageError(true);
                return;
            }

            const data = response.body;

            if (!data) {
                setLoading(false);
                setMessageIsStreaming(false);
                setMessageError(true);

                return;
            }

            if (updatedConversation.messages.length === 1) {
                const { content } = message;
                const customName = content.length > 30 ? content.substring(0, 30) + "..." : content;

                updatedConversation = {
                    ...updatedConversation,
                    name: customName
                };
            }

            setLoading(false);

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let isFirst = true;
            let text = "";

            while (!done) {
                if (stopConversationRef.current === true) {
                    controller.abort();
                    done = true;
                    break;
                }
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);

                text += chunkValue;

                if (isFirst) {
                    isFirst = false;
                    const updatedMessages: Message[] = [...updatedConversation.messages, { role: "assistant", content: chunkValue }];

                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages
                    };

                    setSelectedConversation(updatedConversation);
                } else {
                    const updatedMessages: Message[] = updatedConversation.messages.map((message, index) => {
                        if (index === updatedConversation.messages.length - 1) {
                            return {
                                ...message,
                                content: text
                            };
                        }

                        return message;
                    });

                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages
                    };

                    setSelectedConversation(updatedConversation);
                }
            }

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
            messages: [],
            prompt: DEFAULT_SYSTEM_PROMPT
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
                prompt: DEFAULT_SYSTEM_PROMPT
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
            spell: null,
            prompt: DEFAULT_SYSTEM_PROMPT
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
                spell: null,
                prompt: DEFAULT_SYSTEM_PROMPT
            });
        }
    }, []);

    return (
        <section>
            {/* <EventHandler pubSub={pubSub} /> */}
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

                        <Chat
                            conversation={selectedConversation}
                            messageIsStreaming={messageIsStreaming}
                            spells={spells}
                            modelError={modelError}
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
