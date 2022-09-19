import FrameComment from './frame-comment';
import InlineComment from './inline-comment';

export default class CommentManager {
    constructor(editor) {
        this.editor = editor;
        this.comments = [];

        editor.on('zoomed', () => {
            this.comments.map(c => c.blur.call(c));
        });
    }

    addInlineComment(text, [ x, y ], links = []) {
        let comment = new InlineComment(text, this.editor);

        comment.k = () => this.editor.view.area.transform.k;
        comment.x = x;
        comment.y = y;
        comment.linkTo(links);

        this.addComment(comment);
    }

    addFrameComment(text, [ x, y ], links = [], width = 0, height = 0) {
        let comment = new FrameComment(text, this.editor);

        comment.x = x;
        comment.y = y;
        comment.width = width;
        comment.height = height;
        comment.linkTo(links);
        
        this.addComment(comment);
    }

    addComment(comment) {
        comment.update();
        this.comments.push(comment);

        this.editor.view.area.appendChild(comment.el);
        this.editor.trigger('commentcreated', comment);
    }

    deleteComment(comment) {
        this.editor.view.area.removeChild(comment.el);
        this.comments.splice(this.comments.indexOf(comment), 1);
        comment.destroy();

        this.editor.trigger('commentremoved', comment);
    }

    deleteFocusedComment() {
        const focused = this.comments.find(c => c.focused());
        
        if (focused)
            this.deleteComment(focused)
    }

    deleteComments() {
        [...this.comments].map(c => this.deleteComment(c));
    }

    toJSON() {
        return this.comments.map(c => c.toJSON())
    }

    fromJSON(list) {
        this.deleteComments();
        list.map(item => {
            if (item.type === 'frame') {
                this.addFrameComment(item.text, item.position, item.links, item.width, item.height)
            } else {
                this.addInlineComment(item.text, item.position, item.links);
            }
        });
    }

    destroy() {
        this.comments.forEach(comment => comment.destroy());
    }
}