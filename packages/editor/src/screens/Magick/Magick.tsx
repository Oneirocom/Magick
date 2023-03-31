// DOCUMENTED 
import { LoadingScreen, TabLayout } from '@magickml/client-core';
import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TabBar from '../../components/TabBar/TabBar';
import { usePubSub } from '../../contexts/PubSubProvider';
import { RootState } from '../../state/store';
import {
  activeTabSelector,
  closeTab,
  openTab,
  selectAllTabs,
} from '../../state/tabs';
import Workspaces from '../../components/Workspaces';

/**
 * Magick component
 * @param empty flag to control whether the workspaces should be rendered or not
 * @returns JSX.Element
 */
const Magick = ({ empty = false }): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs));
  const activeTab = useSelector(activeTabSelector);
  const pubSub = usePubSub();
  const { URI } = useParams();
  const { events, publish, subscribe } = pubSub;

  // Subscribe to open tab events
  useEffect(() => {
    return subscribe(events.OPEN_TAB, (_event, tabData) => {
      dispatch(openTab(tabData));
    }) as () => void;
  }, [subscribe, events.OPEN_TAB, dispatch]);

  // Handle tabs and navigation
  useEffect(() => {
    // If there are still tabs, grab one at random to open to for now.
    // We should do better at this.  Probably with some kind of tab ordering.
    // Could fit in well with drag and drop for tabs
    if (tabs.length > 0 && !activeTab) {
      navigate(`/magick/${tabs[Math.floor(Math.random() * tabs.length)].URI}`);
    }

    if (tabs.length === 0 && !activeTab && !URI) navigate('/home');
  }, [tabs, activeTab, URI, navigate]);

  // Handle URI changes
  useEffect(() => {
    if (!URI) return;
    // Return if navigating to the spell that is already active
    if (activeTab && activeTab.URI === URI) return;
    // Close spell tab if it exists
    const spellNameTab = tabs.filter(tab => tab.URI === URI);
    const isSpellNameTabPresent = spellNameTab.length;
    if (isSpellNameTabPresent) dispatch(closeTab(spellNameTab[0].id));
    dispatch(
      openTab({
        name: URI,
        openNew: false,
        type: 'spell',
      }),
    );
  }, [URI, activeTab, tabs, dispatch]);

  // Set up hotkeys
  useHotkeys(
    'Control+z',
    () => {
      if (!pubSub || !activeTab) return;

      publish(events.$UNDO(activeTab.id));
    },
    [pubSub, activeTab],
  );

  useHotkeys(
    'Control+Shift+z',
    () => {
      if (!pubSub || !activeTab) return;
      publish(events.$REDO(activeTab.id));
    },
    [pubSub, activeTab],
  );

  useHotkeys(
    'Control+Delete',
    () => {
      if (!pubSub || !activeTab) return;
      publish(events.$DELETE(activeTab.id));
    },
    [pubSub, activeTab],
  );

  useHotkeys(
    'Control+c',
    () => {
      if (!pubSub || !activeTab) return;
      publish(events.$MULTI_SELECT_COPY(activeTab.id));
    },
    [pubSub, activeTab],
  );

  useHotkeys(
    'Control+v',
    () => {
      if (!pubSub || !activeTab) return;
      publish(events.$MULTI_SELECT_PASTE(activeTab.id));
    },
    [pubSub, activeTab],
  );

  // Render loading screen if there's no active tab
  if (!activeTab) return <LoadingScreen />;

  return (
    <>
      <TabBar tabs={tabs} activeTab={activeTab} />
      <TabLayout>
        {!empty && (
          <Workspaces tabs={tabs} pubSub={pubSub} activeTab={activeTab} />
        )}
      </TabLayout>
    </>
  );
};

Magick.whyDidYouRender = true;

export default Magick;