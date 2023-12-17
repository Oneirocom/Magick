import {
  FlowNode,
  IGraph,
  ILogger,
  NodeDescription,
  Socket,
} from '@magickml/behave-graph'

export class LogObject extends FlowNode {
  public static Description = (logger: ILogger) =>
    new NodeDescription(
      'debug/log/object',
      'Action',
      'Log',
      (description, graph, configuration, id) =>
        new LogObject(description, graph, configuration, id, logger)
    )

  constructor(
    description: NodeDescription,
    graph: IGraph,
    configuration: Record<string, any>,
    id: string,
    private readonly logger: ILogger
  ) {
    super(
      description,
      graph,
      [
        new Socket('flow', 'flow'),
        new Socket('string', 'text'),
        new Socket('string', 'severity', 'info'),
        new Socket('object', 'payload'),
      ],
      [new Socket('flow', 'flow')],
      configuration,
      id
    )
  }

  override triggered(fiber: any) {
    const text = this.readInput<string>('text')
    const payload = this.readInput<any>('payload')

    const message = `${text} ${JSON.stringify(payload)}`

    switch (this.readInput<string>('severity')) {
      case 'verbose':
        this.logger.log('verbose', message)
        break
      case 'info':
        this.logger.log('info', message)
        break
      case 'warning':
        this.logger.log('warning', message)
        break
      case 'error':
        this.logger.log('error', message)
        break
    }

    fiber.commit(this, 'flow')
  }
}
