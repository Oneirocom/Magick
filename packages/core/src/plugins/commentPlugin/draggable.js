import { listenWindow } from './utils';

export default class Draggable {

    constructor(el, onStart = () => {}, onTranslate = () => {}, onDrag = () => {}) {
        this.mouseStart = null;

        this.el = el;
        this.onStart = onStart;
        this.onTranslate = onTranslate;
        this.onDrag = onDrag;

        this.destroy = this.initEvents(el);
    }

    initEvents(el) {
        el.addEventListener('pointerdown', this.down.bind(this));
        
        const destroyMove = listenWindow('pointermove', this.move.bind(this))
        const destroyUp = listenWindow('pointerup', this.up.bind(this));

        return () => {
            destroyMove();
            destroyUp();
        }
    }

    getCoords(e) {
        const props = e.touches ? e.touches[0] : e;

        return [props.pageX, props.pageY];
    }

    down(e) {
        e.stopPropagation();

        if (e.which === 1) {
            this.mouseStart = this.getCoords(e);
            this.onStart();
        }
    }

    move(e) {
        if (!this.mouseStart) return;
        e.preventDefault();
        e.stopPropagation();

        let [x, y] = this.getCoords(e);
        let delta = [x - this.mouseStart[0], y - this.mouseStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.onTranslate(delta[0] / zoom, delta[1] / zoom);
    }

    up() {
        if (this.mouseStart) {
            this.onDrag();
        }

        this.mouseStart = null;
    }

    // mutable method
    destroy() { }
}
