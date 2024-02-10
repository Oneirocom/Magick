import { useDispatch } from 'react-redux'
import { setDockviewTheme } from 'client/state'
import { DOCKVIEW_THEME } from 'clientConfig'

export const useDockviewTheme = () => {
  const dispatch = useDispatch()
  const theme = DOCKVIEW_THEME

  const setTheme = (theme: string) => {
    dispatch(setDockviewTheme(theme))
  }

  return { theme, setTheme }
}
