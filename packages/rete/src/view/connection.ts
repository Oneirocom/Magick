import { Connection } from '../connection';
import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { NodeView } from './node';

export class ConnectionView extends Emitter<EventsTypes> {

    connection: Connection;
    inputNode: NodeView;
    outputNode: NodeView;
    el: HTMLElement;

    constructor(connection: Connection, inputNode: NodeView, outputNode: NodeView, emitter: Emitter<EventsTypes>) {
        super(emitter);
        this.connection = connection;
        this.inputNode = inputNode;
        this.outputNode = outputNode;

        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.zIndex = '-1';

        this.trigger('renderconnection', {
            el: this.el,
            connection: this.connection,
            points: this.getPoints()
        });
    }

    getPoints() {
        const { input, output } = this.connection

        if (this.inputNode.hasSocket(input) && this.outputNode.hasSocket(output)) {
            const [x1, y1] = this.outputNode.getSocketPosition(output);
            const [x2, y2] = this.inputNode.getSocketPosition(input);

            return [x1, y1, x2, y2];
        }

        return [0, 0, 0, 0]
    }

    update() {
        this.trigger('updateconnection', {
            el: this.el,
            connection: this.connection,
            points: this.getPoints()
        });
    }
}
