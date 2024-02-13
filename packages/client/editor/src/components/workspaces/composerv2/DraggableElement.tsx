import { usePubSub } from '@magickml/providers'

export const DraggableElement = props => {
  const { tab } = props.params
  const { publish, events } = usePubSub()
  const windows = {
    Console: () => publish(events.$CREATE_CONSOLE(tab.id)),
    TextEditor: () => publish(events.$CREATE_TEXT_EDITOR(tab.id)),
    Variables: () => publish(events.$CREATE_INSPECTOR(tab.id)),
    Test: () => publish(events.$CREATE_PLAYTEST(tab.id)),
  }

  const handleClick = () => windows[props.window]()

  return (
    <p
      tabIndex={-1}
      onDragStart={event => {
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData('text/plain', 'nothing')
          event.dataTransfer.setData('component', props.window)
          event.dataTransfer.setData('title', props.title)
        }
      }}
      onClick={handleClick}
      draggable={true}
      className="p-2 text-white transition-all cursor-pointer hover:bg-gray-600"
    >
      {props.window}
    </p>
  )
}
