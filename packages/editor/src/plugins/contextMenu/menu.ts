export default class Menu {
    constructor(editor, props) {
        if (this.constructor === Menu) {
            throw new TypeError('Abstract class "Menu" cannot be instantiated directly'); 
        }
    }

    addItem(title, onClick, path) { }

    show(x, y) { }

    hide() { }
}