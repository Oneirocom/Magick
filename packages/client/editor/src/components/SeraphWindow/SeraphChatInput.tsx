// @ts-nocheck
import { Input } from '@magickml/client-ui'
import { Send } from '@magickml/icons'
import { useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
/**
 * Input component - Receives and sends playtest input.
 */
export const SeraphChatInput = props => {
  const ref = useRef<any>(null)
  // const ref = useRef(null) as React.MutableRefObject<HTMLInputElement>

  const [seraphCache, setSeraphCache] = useState<string[]>([])

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
      if (!ref.current) return
      if (ref.current !== document.activeElement) return
      if (seraphCache.length === 0) return
      const last = seraphCache[seraphCache.length - 1]

      // handle case where user is moving up more than one
      if (ref.current.value !== '') {
        const index = seraphCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the seraphCache, add it to the seraphCache
          setSeraphCache([...seraphCache, ref.current.value])
        } else if (index === 0) {
          // if the current value is the first item in the seraphCache, do nothing
          return
        } else {
          // if the current value is in the seraphCache, move up one
          ref.current.value = seraphCache[index - 1]
          props.onChange({ target: { value: seraphCache[index - 1] } })
          return
        }
      }

      ref.current.value = last
      props.onChange({ target: { value: last } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, seraphCache]
  )

  // handle down arrow moving through list
  useHotkeys(
    'down',
    () => {
      if (ref.current !== document.activeElement) return
      if (seraphCache.length === 0) return

      // handle case where user is moving down more than one
      if (ref.current.value !== '') {
        const index = seraphCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the seraphCache, add it to the seraphCache
          setSeraphCache([...seraphCache, ref.current.value])
        } else if (index === seraphCache.length - 1) {
          // handle user moving down back into an empty input
          ref.current.value = ''
          // if the current value is the last item in the seraphCache, do nothing
          return
        } else {
          // if the current value is in the seraphCache, move down one
          ref.current.value = seraphCache[index + 1]
          props.onChange({ target: { value: seraphCache[index + 1] } })
          return
        }
      }

      ref.current.value = ''
      props.onChange({ target: { value: '' } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, seraphCache]
  )

  const onSend = () => {
    if (ref.current?.value) {
      const newHistory = [...seraphCache, ref.current.value]
      setSeraphCache(newHistory)
      props.onSend(ref.current.value)
      ref.current.value = '' // Clear the input after sending
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center w-full px-2 py-1.5">
        <Input
          ref={ref}
          type="text"
          value={props.value}
          onChange={props.onChange}
          placeholder="Ask Seraph..."
          className="flex-grow rounded-md w-full border-1.5 border-[--ds-neutral] focus:border-[--ds-neutral] shadow-0 focus-visible:ring-0"
        />
      </div>
      <div className="absolute bottom-3.5 right-6">
        <button className="" onClick={onSend} aria-label="Send message">
          <Send width="26pt" height="16pt" fill="#373d44" />
        </button>
      </div>
    </div>
  )
}
