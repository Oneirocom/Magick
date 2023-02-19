import React from "react";
import ReactDOM from "react-dom";
import ReactMenu from "./Menu";
import Menu from "../menu";
import { injectItem } from "../utils";

export default class extends Menu {
  constructor(editor, props) {
    super();
    this.props = props;
    this.items = [];
    this.position = [0, 0];
    this.visible = false;
    this.el = document.createElement("div");
    editor.view.container.appendChild(this.el);

    this.render();
  }

  addItem(title, onClick, path = []) {
    injectItem(this.items, title, onClick, path);
    this.render();
  }

  show(x, y, args) {
    this.position = [x, y];
    this.args = args;
    this.visible = true;
    this.render();
  }

  hide() {
    this.visible = false;
    this.render();
  }

  render() {
    ReactDOM.render(
      <ReactMenu
        {...this.props}
        args={this.args}
        items={this.items}
        position={this.position}
        visible={this.visible}
        onClose={() => this.hide()}
      />,
      this.el
    );
  }
}

export { Menu };
