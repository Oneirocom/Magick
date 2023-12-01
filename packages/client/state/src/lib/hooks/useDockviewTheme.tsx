import { useDispatch, useSelector } from 'react-redux'
import { RootState, setDockviewTheme } from 'client/state'
import { DOCKVIEW_THEME } from 'shared/config';

export const useDockviewTheme = () => {
  const dispatch = useDispatch();
  const theme = DOCKVIEW_THEME

  const setTheme = (theme: string) => {
    dispatch(setDockviewTheme(theme));
  }

  return { theme, setTheme };
}