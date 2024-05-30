import defaultJson from './data/defaultLayout.json'
import fullScreen from './data/fullScreenLayout.json'
import promptEngineering from './data/promptEngineeringLayout.json'
import troubleShooting from './data/troubleshootingLayout.json'

export type WorkspaceKeys = {
  default: string
  fullScreen: string
  promptEngineering: string
  troubleShooting: string
}

// Workspace map for initializing tabs with layout data
export const workspaceMap = {
  default: defaultJson,
  fullScreen,
  promptEngineering,
  troubleShooting,
}

export const getWorkspaceLayout = (
  layoutKey: keyof WorkspaceKeys | undefined
) => {
  return layoutKey ? workspaceMap[layoutKey] : workspaceMap.default
}
