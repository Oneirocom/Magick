import { UserSpellManager } from '../types'

const configureManager = () => {
  // we need to fix this typing here to extend from express application instead (or feathers application?)
  return (app: { userSpellManagers?: UserSpellManager }) => {
    app.userSpellManagers = new Map()
  }
}

export default configureManager
