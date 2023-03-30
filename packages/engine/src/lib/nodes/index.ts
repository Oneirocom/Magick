import { MagickComponent } from '../engine'
import { pluginManager } from '../plugin'
import { ArrayToJSON } from './array/ArrayToJSON'
import { ArrayVariable } from './array/ArrayVariable'
import { GetValueFromArray } from './array/GetValueFromArray'
import { JoinListComponent } from './array/JoinList'
import { RemapArray } from './array/RemapArray'
import { BooleanVariable } from './boolean/BooleanVariable'
import { IsVariableTrue } from './boolean/IsVariableTrue'
import { LogicalOperator } from './boolean/LogicalOperator'
import { Javascript } from './code/Javascript'
import { Python } from './code/Python'
import { GetDocuments } from './document/GetDocuments'
import { StoreDocument } from './document/StoreDocument'
import { CosineSimilarity } from './embedding/CosineSimilarity'
import { CreateTextEmbedding } from './embedding/CreateTextEmbedding'
import { FindTextEmbedding } from './embedding/FindTextEmbedding'
import { EventDelete } from './events/EventDelete'
import { EventDestructureComponent } from './events/EventDestructure'
import { EventRecall } from './events/EventRecall'
import { EventRestructureComponent } from './events/EventRestructure'
import { EventsToConversation } from './events/EventsToConversation'
import { EventStore } from './events/EventStore'
import { BooleanGate } from './flow/BooleanGate'
import { ExclusiveGate } from './flow/Exclusive Gate'
import { IsNullOrUndefined } from './flow/IsNullOrUndefined'
import { OrGate } from './flow/OrGate'
import { RandomGate } from './flow/RandomGate'
import { SwitchGate } from './flow/SwitchGate'
import { WaitForAll } from './flow/WaitForAll'
import { InputComponent } from './io/Input'
import { JupyterNotebook } from './io/JupyterNotebook'
import { Output } from './io/Output'
import { Request } from './io/Request'
import { SpellComponent } from './io/Spell'
import { TriggerOut } from './io/TriggerOut'
import { InRange } from './number/InRange'
import { NumberVariable } from './number/NumberVariable'
import { ComposeObject } from './object/ComposeObject'
import { ParseJSON } from './object/JSONToObject'
import { Merge } from './object/MergeObjects'
import { ObjectToJSON } from './object/ObjectToJSON'
import { CombineText } from './text/CombineText'
import { ComplexStringMatcher } from './text/ComplexStringMatcher'
import { EvaluateText } from './text/EvaluateText'
import { GenerateText } from './text/GenerateText'
import { ProfanityFilter } from './text/ProfanityFilter'
import { ReplaceText } from './text/ReplaceText'
import { StringVariable } from './text/StringVariable'
import { TextTemplate } from './text/TextTemplate'
import { TextVariable } from './text/TextVariable'
import { Cast } from './utility/Cast'
import { Destructure } from './utility/Destructure'
import { Echo } from './utility/Echo'
import { Log } from './utility/Log'


export const components = {
  booleanGate: () => new BooleanGate(),
  randomGate: () => new RandomGate(),
  cast: () => new Cast(),
  createEmbedding: () => new CreateTextEmbedding(),
  inRange: () => new InRange(),
  javascript: () => new Javascript(),
  python: () => new Python(),
  destructure: () => new Destructure(),
  complexStringMatcher: () => new ComplexStringMatcher(),
  echo: () => new Echo(),
  getCachedEmbedding: () => new FindTextEmbedding(),
  replaceText: () => new ReplaceText(),
  textCompletion: () => new GenerateText(),
  eventdelete: () => new EventDelete(),
  isNullOrUndefined: () => new IsNullOrUndefined(),
  isVariableTrue: () => new IsVariableTrue(),
  request: () => new Request(),
  jupyterNotebook: () => new JupyterNotebook(),
  stringEvaluator: () => new EvaluateText(),
  combineText: () => new CombineText(),
  textVariable: () => new TextVariable(),
  stringVariable: () => new StringVariable(),
  profanityFilter: () => new ProfanityFilter(),
  numberVariable: () => new NumberVariable(),
  booleanVariable: () => new BooleanVariable(),
  arrayVariable: () => new ArrayVariable(),
  logicalOperator: () => new LogicalOperator(),
  inputComponent: () => new InputComponent(),
  eventDestructure: () => new EventDestructureComponent(),
  eventRestructure: () => new EventRestructureComponent(),
  eventRecall: () => new EventRecall(),
  eventStore: () => new EventStore(),
  eventsToConversation: () => new EventsToConversation(),
  composeObject: () => new ComposeObject(),
  joinListComponent: () => new JoinListComponent(),
  remapArray: () => new RemapArray(),
  moduleComponent: () => new SpellComponent(),
  output: () => new Output(),
  switchGate: () => new SwitchGate(),
  triggerOut: () => new TriggerOut(),
  waitForAll: () => new WaitForAll(),
  exclusiveGate: () => new ExclusiveGate(),
  merge: () => new Merge(),
  orGate: () => new OrGate(),
  log: () => new Log(),
  promptTemplate: () => new TextTemplate(),
  parseJSON: () => new ParseJSON(),
  objectToJSON: () => new ObjectToJSON(),
  arrayToJSON: () => new ArrayToJSON(),
  getDocuments: () => new GetDocuments(),
  storeDocument: () => new StoreDocument(),
  getValueFromArray: () => new GetValueFromArray(),
  cosineSimilarity: () => new CosineSimilarity(),
}

function compare(a: MagickComponent<unknown>, b: MagickComponent<unknown>) {
  if ((a.displayName || a.name) < (b.displayName || b.name)) {
    return -1
  }
  if ((a.displayName || a.name) > (b.displayName || b.name)) {
    return 1
  }
  return 0
}

export const getNodes = () => {
  const pluginNodes = pluginManager.getNodes()
  const allComponents = { ...components, ...pluginNodes }
  const sortedComponents = Object.keys(allComponents)
    .sort()
    .reduce((acc, key) => {
      acc[key] = allComponents[key]
      return acc
    }, {} as Record<string, ()=>MagickComponent<unknown>>)
  return Object.values(sortedComponents)
    .map(component => component())
    .sort(compare)
}
