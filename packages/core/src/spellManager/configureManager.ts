const configureManager = () => {
  // we need to fix this typing here to extend from express application instead (or feathers application?)
  return (app: any) => {
    app.userSpellManagers = new Map()
  }
}

export default configureManager
