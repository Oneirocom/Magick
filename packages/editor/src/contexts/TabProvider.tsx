import { createContext, useContext, useState } from "react"
import {
  DockviewReact, DockviewReadyEvent, IDockviewPanelProps,
} from 'dockview';

type DockviewTheme = 'dockview-theme-abyss'

type DocviewContext = {
  theme: DockviewTheme,
  setTheme: (theme: DockviewTheme) => void
}

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useLayout = () => useContext(Context)

export const TabLayout = ({ children }) => {
  const { theme, setTheme } = useLayout()


  const onReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: 'panel_1',
      component: 'default',
    });

    event.api.addPanel({
      id: 'panel_2',
      component: 'default',
    });

    event.api.addPanel({
      id: 'panel_3',
      component: 'default',
    });
  };

  return (<DockviewReact
    onReady={onReady}
    className={theme}
    components={components}
  />)
}

const components = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          padding: '20px',
          background: 'var(--dv-group-view-background-color)',
        }}
      >
        {props.params.title}
      </div>
    );
  }
};

export const TabProvider = ({ children }) => {
  const [theme, setTheme] = useState<DockviewTheme>('dockview-theme-abyss')

  const publicInterface = {
    theme,
    setTheme
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}