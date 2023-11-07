// DOCUMENTED
import { MagickComponent } from '../engine'
import { pluginManager } from '../plugin'
import { ArrayToJSON } from './array/ArrayToJSON'
import { JSONToArray } from './array/JSONToArray'
import { ArrayVariable } from './array/ArrayVariable'
import { GetValueFromArray } from './array/GetValueFromArray'
import { JoinListComponent } from './array/JoinList'
import { RemapArray } from './array/RemapArray'
import { ExtractFromArray } from './array/ExtractFromArray'
import { BooleanVariable } from './boolean/BooleanVariable'
import { IsVariableTrue } from './boolean/IsVariableTrue'
import { LogicalOperator } from './boolean/LogicalOperator'
import { Javascript } from './code/Javascript'
import { Python } from './code/Python'
import { DocumentToContent } from './document/DocumentToContent'
import { GetDocuments } from './document/GetDocuments'
import { StoreDocument } from './document/StoreDocument'
import { CosineSimilarity } from './embedding/CosineSimilarity'
import { CreateTextEmbedding } from './embedding/CreateTextEmbedding'
import { FindTextEmbedding } from './embedding/FindTextEmbedding'
import { EventDelete } from './events/EventDelete'
import { EventDestructureComponent } from './events/EventDestructure'
import { EventRecall } from './events/EventRecall'
import { EventRestructureComponent } from './events/EventRestructure'
import { EventStore } from './events/EventStore'
import { EventsToConversation } from './events/EventsToConversation'
import { JupyterNotebook } from './io/JupyterNotebook'
import { TextToSpeech } from './audio/TextToSpeech'
import { BooleanGate } from './flow/BooleanGate'
import { ExclusiveGate } from './flow/ExclusiveGate'
import { IsNullOrUndefined } from './flow/IsNullOrUndefined'
import { OrGate } from './flow/OrGate'
import { RandomGate } from './flow/RandomGate'
import { SwitchGate } from './flow/SwitchGate'
import { WaitForAll } from './flow/WaitForAll'
import { InputComponent } from './io/Input'
import { Output } from './io/Output'
import { Request } from './io/Request'
import { Respond } from './io/Respond'
import { Skill } from './io/Skill'
import { SpellComponent } from './io/Spell'
import { SpellByName } from './io/SpellByName'
import { RunSpell } from './magick/runSpell'
import { IsANumber } from './number/IsANumber'
import { Equal } from './number/Equal'
import { GreaterThan } from './number/GreaterThan'
import { GreaterThanOrEqual } from './number/GreaterThanOrEqual'
import { InRange } from './number/InRange'
import { LessThan } from './number/LessThan'
import { LessThanOrEqual } from './number/LessThanOrEqual'
import { Multiply } from './number/Multiply'
import { Divide } from './number/Divide'
import { Add } from './number/Add'
import { Subtract } from './number/Subtract'
import { NumberVariable } from './number/NumberVariable'
import { ComposeObject } from './object/ComposeObject'
import { GetValuesFromObject } from './object/GetValuesFromObject'
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
import { CurrentTime } from './utility/CurrentTime'
import { Echo } from './utility/Echo'
import { ErrorNode } from './utility/Error'
import { Log } from './utility/Log'
import { ExtractRelationship } from './embedding/ExtractRelationship'
import { Select } from './database/Select'
import { Insert } from './database/Insert'
import { Update } from './database/Update'
import { Upsert } from './database/Upsert'
import { Delete } from './database/Delete'
import { SplitBySentence } from './text/SplitBySentence'
import { Trim } from './text/Trim'
import { GetLength } from './text/GetLength'
import { UUIDGenerator } from './text/GenerateUUID'
import { TypeChat } from './text/TypeChat'
import { CommandParser } from './flow/CommandParser'
import { SocketOutput } from './io/SocketOutput'
import { SocketInput } from './io/SocketInput'

export const components: Record<string, () => MagickComponent<unknown>> = {
  booleanGate: () => new BooleanGate(),
  randomGate: () => new RandomGate(),
  cast: () => new Cast(),
  createEmbedding: () => new CreateTextEmbedding(),
  extractRelationship: () => new ExtractRelationship(),
  inRange: () => new InRange(),
  javascript: () => new Javascript(),
  python: () => new Python(),
  GetValuesFromObject: () => new GetValuesFromObject(),
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
  documenttocontent: () => new DocumentToContent(),
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
  extractFromArray: () => new ExtractFromArray(),
  moduleComponent: () => new SpellComponent(),
  output: () => new Output(),
  switchGate: () => new SwitchGate(),
  waitForAll: () => new WaitForAll(),
  exclusiveGate: () => new ExclusiveGate(),
  merge: () => new Merge(),
  orGate: () => new OrGate(),
  log: () => new Log(),
  currentTime: () => new CurrentTime(),
  promptTemplate: () => new TextTemplate(),
  parseJSON: () => new ParseJSON(),
  objectToJSON: () => new ObjectToJSON(),
  arrayToJSON: () => new ArrayToJSON(),
  getDocuments: () => new GetDocuments(),
  storeDocument: () => new StoreDocument(),
  getValueFromArray: () => new GetValueFromArray(),
  cosineSimilarity: () => new CosineSimilarity(),
  textToSpeech: () => new TextToSpeech(),
  skill: () => new Skill(),
  runSpell: () => new RunSpell(),
  error: () => new ErrorNode(),
  respond: () => new Respond(),
  spellByName: () => new SpellByName(),
  equal: () => new Equal(),
  greaterThan: () => new GreaterThan(),
  greaterThanOrEqual: () => new GreaterThanOrEqual(),
  lessThan: () => new LessThan(),
  lessThanOrEqual: () => new LessThanOrEqual(),
  select: () => new Select(),
  insert: () => new Insert(),
  update: () => new Update(),
  upsert: () => new Upsert(),
  delete: () => new Delete(),
  splitBySentence: () => new SplitBySentence(),
  trim: () => new Trim(),
  getLength: () => new GetLength(),
  isANumber: () => new IsANumber(),
  multiply: () => new Multiply(),
  divide: () => new Divide(),
  add: () => new Add(),
  subtract: () => new Subtract(),
  jsonToArray: () => new JSONToArray(),
  generateUUID: () => new UUIDGenerator(),
  typeChat: () => new TypeChat(),
  commandParser: () => new CommandParser(),
  socketOutput: () => new SocketOutput(),
  socketInput: () => new SocketInput(),
}

/**
 * Compare two MagickComponents based on their display name or name.
 * @param a - MagickComponent to compare.
 * @param b - MagickComponent to compare.
 * @returns -1 if a comes before b, 1 if a comes after b, 0 if they are equal.
 */
function compare(
  a: MagickComponent<unknown>,
  b: MagickComponent<unknown>
): number {
  if ((a.displayName || a.name) < (b.displayName || b.name)) {
    return -1
  }
  if ((a.displayName || a.name) > (b.displayName || b.name)) {
    return 1
  }
  return 0
}

/**
 * Returns a sorted array of MagickComponents including in-built and plugin components.
 * @returns An array of sorted MagickComponents.
 */
export const getNodes = (): MagickComponent<unknown>[] => {
  try {
    const pluginNodes = pluginManager.getNodes()
    const allComponents = { ...components, ...pluginNodes }
    const sortedComponentKeys = Object.keys(allComponents).sort()
    const sortedComponents: Record<string, () => MagickComponent<unknown>> = {}

    for (const key of sortedComponentKeys) {
      sortedComponents[key] = allComponents[key]
    }
    return Object.values(sortedComponents)
      .map(component => component())
      .sort(compare)
  } catch (e) {
    console.error(e)
    return []
  }
}
