// detect Mac OSX
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

export class Restrictor {
  constructor(editor, scaleExtent, translateExtent, zoomLerpFactor = 0.25) {
    this.editor = editor
    this.scaleExtent = scaleExtent
    this.zoomLerpFactor = zoomLerpFactor
    this.translateExtent = translateExtent
    this.lastZoom = 2.0
    if (scaleExtent) editor.on('zoom', this.restrictZoom.bind(this))
    if (translateExtent)
      editor.on('translate', this.restrictTranslate.bind(this))
  }
  lastZoom = null
  restrictZoom(data) {
    const se =
      typeof this.scaleExtent === 'boolean'
        ? { min: 0.1, max: 1 }
        : this.scaleExtent

    if (isMac) {
      if (this.lastZoom < se.min) this.lastZoom = se.min
      else if (this.lastZoom > se.max) this.lastZoom = se.max

      // lerp from lastZoom to zoom, weighted 1/3 toward zoom
      const avgZoom =
        data.zoom * this.zoomLerpFactor +
        this.lastZoom * (1 - this.zoomLerpFactor)

      this.lastZoom = avgZoom
      data.zoom = avgZoom
    }

    if (data.zoom < se.min) data.zoom = se.min
    else if (data.zoom > se.max) data.zoom = se.max
  }

  restrictTranslate(data) {
    const te =
      typeof this.translateExtent === 'boolean'
        ? { width: 5000, height: 4000 }
        : this.translateExtent
    const { container } = this.editor.view
    const k = data.transform.k
    const [kw, kh] = [te.width * k, te.height * k]
    const cx = container.clientWidth / 2
    const cy = container.clientHeight / 2

    data.x -= cx
    data.y -= cy

    if (data.x > kw) data.x = kw
    else if (data.x < -kw) data.x = -kw

    if (data.y > kh) data.y = kh
    else if (data.y < -kh) data.y = -kh

    data.x += cx
    data.y += cy
  }
}
