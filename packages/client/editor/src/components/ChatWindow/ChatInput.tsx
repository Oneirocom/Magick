import { Button, Input } from '@magickml/client-ui'
import { useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
/**
 * Input component - Receives and sends playtest input.
 */
export const ChatInput = props => {
  const ref = useRef(null)
  // const ref = useRef(null) as React.MutableRefObject<HTMLInputElement>

  const [playtestCache, setPlaytestCache] = useState<string[]>([])

  // Trigger 'onSend' when 'return' key is pressed on the input.
  useHotkeys(
    'enter',
    () => {
      if (ref.current !== document.activeElement) return
      onSend()
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref]
  )

  // Use up and down arrows to move through history and set valye of input.
  useHotkeys(
    'up',
    () => {
      if (ref.current !== document.activeElement) return
      if (playtestCache.length === 0) return
      const last = playtestCache[playtestCache.length - 1]

      // handle case where user is moving up more than one
      if (ref.current.value !== '') {
        const index = playtestCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the playtestCache, add it to the playtestCache
          setPlaytestCache([...playtestCache, ref.current.value])
        } else if (index === 0) {
          // if the current value is the first item in the playtestCache, do nothing
          return
        } else {
          // if the current value is in the playtestCache, move up one
          ref.current.value = playtestCache[index - 1]
          props.onChange({ target: { value: playtestCache[index - 1] } })
          return
        }
      }

      ref.current.value = last
      props.onChange({ target: { value: last } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, playtestCache]
  )

  // handle down arrow moving through list
  useHotkeys(
    'down',
    () => {
      if (ref.current !== document.activeElement) return
      if (playtestCache.length === 0) return

      // handle case where user is moving down more than one
      if (ref.current.value !== '') {
        const index = playtestCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the playtestCache, add it to the playtestCache
          setPlaytestCache([...playtestCache, ref.current.value])
        } else if (index === playtestCache.length - 1) {
          // handle user moving down back into an empty input
          ref.current.value = ''
          // if the current value is the last item in the playtestCache, do nothing
          return
        } else {
          // if the current value is in the playtestCache, move down one
          ref.current.value = playtestCache[index + 1]
          props.onChange({ target: { value: playtestCache[index + 1] } })
          return
        }
      }

      ref.current.value = ''
      props.onChange({ target: { value: '' } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, playtestCache]
  )

  // function to call onSend  after storing user input in playtestCache
  const onSend = () => {
    const newHistory = [...playtestCache, ref.current.value]
    setPlaytestCache(newHistory as [])
    props.onSend()
  }

  return (
    <div className="flex items-center space-x-2 justify-center bg-[var(--foreground-color)] w-100">
      <Input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Type chat input here"
      />
      <div className="w-100 m-auto">
        <Button className="" variant="basic" onClick={onSend}>
          Send
        </Button>
      </div>
    </div>
  )
}
