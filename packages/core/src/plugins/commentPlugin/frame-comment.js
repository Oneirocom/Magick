import Comment from './comment';
import { containsRect } from './utils';

export default class FrameComment extends Comment {
    constructor(text, editor) {
        super(text, editor);
        
        this.width = 0;
        this.height = 0;
        this.links = [];
        this.el.className = 'frame-comment';
    }

    linkedNodesView() {
        return this.links
            .map(id => this.editor.nodes.find(n => n.id === id))
            .map(node => this.editor.view.nodes.get(node));
    }

    onStart() {
        super.onStart();
        this.linkedNodesView().map(nodeView => nodeView.onStart())
    }

    onTranslate(dx, dy) {
        super.onTranslate(dx, dy);
        this.linkedNodesView().map(nodeView => nodeView.onDrag(dx, dy))
    }

    isContains(node) {
        const commRect = this.el.getBoundingClientRect();
        const view = this.editor.view.nodes.get(node);
    
        return containsRect(commRect, view.el.getBoundingClientRect());
    }

    update() {
        super.update();

        this.el.style.width = this.width+'px';
        this.el.style.height = this.height+'px';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: 'frame',
            width: this.width,
            height: this.height
        }
    }
}