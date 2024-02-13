import { GridviewReact, IDockviewPanelProps, Orientation } from 'dockview'
import WorkspaceProvider from '../../../contexts/WorkspaceProvider'
import { Tab, useDockviewTheme } from 'client/state'
import { usePubSub } from '@magickml/providers'
import { composerLayoutComponents } from './ComposerLayoutComponents'

const ComposerContainer = (
  props: IDockviewPanelProps<{
    tab: Tab
    theme: string
    spellId: string
    spellName: string
  }>
) => {
  const { theme } = useDockviewTheme()
  const pubSub = usePubSub()

  const onReady = event => {
    event.api.addPanel({
      id: 'WindowBar',
      component: 'WindowBar',
      maximumHeight: 30,
      minimumHeight: 30,
      params: { ...props.params },
    })

    event.api.addPanel({
      id: 'Composer',
      component: 'Composer',
      params: {
        title: 'Composer',
        ...props.params,
      },
      position: { referencePanel: 'WindowBar', direction: 'below' },
    })
  }

  return (
    <WorkspaceProvider
      tab={props.params.tab}
      pubSub={pubSub}
      spellId={props.params.spellId}
    >
      <GridviewReact
        components={composerLayoutComponents}
        disableAutoResizing={false}
        proportionalLayout={false}
        orientation={Orientation.VERTICAL}
        hideBorders={true}
        onReady={onReady}
        // className={``} // Tailwind classes for full height
        className={`
        global-layout
        ${theme}
        h-screen
        `} // Tailwind classes for full height
      />
    </WorkspaceProvider>
  )
}

export default ComposerContainer
