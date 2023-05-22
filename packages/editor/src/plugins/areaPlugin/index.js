import './style.css'
import { Background } from './background'
import { Restrictor } from './restrictor'
import { SnapGrid } from './snap'
import { zoomAt } from './zoom-at'

function install(editor, params) {
  const background = params.background || false
  const snap = params.snap || false
  const scaleExtent = params.scaleExtent || false
  const translateExtent = params.translateExtent || false
  const tab = params.tab

  if (background) {
    this._background = new Background(editor, background, tab)
  }

  if (scaleExtent || translateExtent) {
    this._restrictor = new Restrictor(editor, scaleExtent, translateExtent)
  }
  if (snap) {
    this._snap = new SnapGrid(editor, snap)
    this._snap.subscribeToToggleSnap()
  }
}

const plugin = {
  name: 'Area Plugin',
  install,
  zoomAt,
}

export default plugin
