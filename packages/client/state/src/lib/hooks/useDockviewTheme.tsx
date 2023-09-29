import { useDispatch, useSelector } from 'react-redux'
import { RootState, setDockviewTheme } from 'client/state'

export const useDockviewTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.globalConfig.dockviewTheme);

  const setTheme = (theme: string) => {
    dispatch(setDockviewTheme(theme));
  }

  return { theme, setTheme };
}