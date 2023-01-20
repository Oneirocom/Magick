import { MagickComponent } from '../../core/types'
import { EventStoreWeaviate } from './events/EventStoreWeaviate'
import { GetWikipediaSummary } from './apis/GetWikipediaSummary'
import { QueryGoogle } from './apis/QueryGoogle'
import { WeaviateWikipedia } from './apis/WeaviateWikipedia'
import { CheckBalanceForERC20 } from './ethereum/CheckBalanceForERC20'
import { CheckEthBalance } from './ethereum/CheckEthBalance'
import { CheckForRecentTransactionsFromWallet } from './ethereum/CheckForRecentTransactionsFromWallet'
import { GetRecentTransactions } from './ethereum/GetRecentTransactions'
import { EventDestructureComponent } from './events/EventDestructure'
import { EventRecall } from './events/EventRecall'
import { EventRecallWeaviate } from './events/EventRecallWeaviate'
import { EventRestructureComponent } from './events/EventRestructure'
import { EventStore } from './events/EventStore'
import { InputComponent } from './io/Input'
import { JupyterNotebook } from './io/JupyterNotebook'
import { Output } from './io/Output'
import { Request } from './io/Request'
import { SpellComponent } from './io/Spell'
import { TriggerIn } from './io/TriggerIn'
import { TriggerOut } from './io/TriggerOut'
import { BooleanGate } from './logic/BooleanGate'
import { Code } from './logic/Code'
import { ExclusiveGate } from './logic/Exclusive Gate'
import { ForEach } from './logic/ForEach'
import { IsNullOrUndefined } from './logic/IsNullOrUndefined'
import { IsQuery } from './logic/IsQuery'
import { IsVariableTrue } from './logic/IsVariableTrue'
import { LogicalOperator } from './logic/LogicalOperator'
import { OrGate } from './logic/OrGate'
import { Python } from './logic/Python'
import { RandomGate } from './logic/RandomGate'
import { SwitchGate } from './logic/SwitchGate'
import { WaitForAll } from './logic/WaitForAll'
import { WhileLoop } from './logic/WhileLoop'
import { Classifier } from './ml/Classifier'
import { Generator } from './ml/Generator'
import { ImageGeneration } from './ml/ImageGeneration'
import { SentenceMatcher } from './ml/SentenceMatcher'
import { TextCompletion } from './ml/TextCompletion'
import { TextToSpeech } from './ml/TextToSpeech'
import { DocumentDelete } from './search/DocumentDelete'
import { DocumentEdit } from './search/DocumentEdit'
import { DocumentGet } from './search/DocumentGet'
import { DocumentSet } from './search/DocumentSet'
import { DocumentSetMass } from './search/DocumentSetMass'
import { DocumentStoreGet } from './search/DocumentStoreGet'
import { RSSGet } from './search/RSSGet'
import { Search } from './search/Search'
import { ComplexStringMatcher } from './strings/ComplexStringMatcher'
import { JoinListComponent } from './strings/JoinList'
import { ProfanityFilter } from './strings/ProfanityFilter'
import { RandomStringFromList } from './strings/RandomStringFromList'
import { StringAdder } from './strings/StringAdder'
import { StringCombiner } from './strings/StringCombiner'
import { StringEvaluator } from './strings/StringEvaluator'
import { StringProcessor } from './strings/StringProcessor'
import { StringReplacer } from './strings/StringReplacer'
import { Alert } from './utility/AlertMessage'
import { Cast } from './utility/Cast'
import { Destructure } from './utility/Destructure'
import { Echo } from './utility/Echo'
import { InputsToJSON } from './utility/InputsToJSON'
import { InRange } from './utility/InRange'
import { Log } from './utility/Log'
import { Merge } from './utility/Merge'
import { ArrayVariable } from './variable/ArrayVariable'
import { BooleanVariable } from './variable/BooleanVariable'
import { FewshotVariable } from './variable/FewshotVariable'
import { NumberVariable } from './variable/NumberVariable'
import { StringVariable } from './variable/StringVariable'

// NOTE: PLEASE KEEP THESE IN ALPHABETICAL ORDER
// todo some kind of custom build parser perhaps to take car of keeping these in alphabetical order

export const components = {
  alert: () => new Alert(),
  booleanGate: () => new BooleanGate(),
  randomGate: () => new RandomGate(),
  cast: () => new Cast(),
  inRange: () => new InRange(),
  code: () => new Code(),
  python: () => new Python(),
  sentenceMatcher: () => new SentenceMatcher(),
  destructure: () => new Destructure(),
  complexStringMatcher: () => new ComplexStringMatcher(),
  echo: () => new Echo(),
  stringReplacer: () => new StringReplacer(),
  textToSpeech: () => new TextToSpeech(),
  textCompletion: () => new TextCompletion(),
  Classifier: () => new Classifier(),
  isNullOrUndefined: () => new IsNullOrUndefined(),
  isQuery: () => new IsQuery(),
  isVariableTrue: () => new IsVariableTrue(),
  conversationStore: () => new EventStore(),
  conversationStore1: () => new EventStoreWeaviate(),
  conversationRecall: () => new EventRecall(),
  conversationRecall1: () => new EventRecallWeaviate(),
  request: () => new Request(),
  jupyterNotebook: () => new JupyterNotebook(),
  search: () => new Search(),
  documentGet: () => new DocumentGet(),
  documentEdit: () => new DocumentEdit(),
  documentDelete: () => new DocumentDelete(),
  documentSet: () => new DocumentSet(),
  documentSetMass: () => new DocumentSetMass(),
  documentStoreGet: () => new DocumentStoreGet(),
  rssGet: () => new RSSGet(),
  forEach: () => new ForEach(),
  whileLoop: () => new WhileLoop(),
  stringEvaluator: () => new StringEvaluator(),
  stringCombiner: () => new StringCombiner(),
  randomStringFromList: () => new RandomStringFromList(),
  stringVariable: () => new StringVariable(),
  fewshotVariable: () => new FewshotVariable(),
  stringAdder: () => new StringAdder(),
  profanityFilter: () => new ProfanityFilter(),
  numberVariable: () => new NumberVariable(),
  booleanVariable: () => new BooleanVariable(),
  arrayVariable: () => new ArrayVariable(),
  logicalOperator: () => new LogicalOperator(),
  inputComponent: () => new InputComponent(),
  inputDestructureComponent: () => new EventDestructureComponent(),
  inputRestructureComponent: () => new EventRestructureComponent(),
  inputsToJson: () => new InputsToJSON(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new SpellComponent(),
  output: () => new Output(),
  stringProcessor: () => new StringProcessor(),
  switchGate: () => new SwitchGate(),
  triggerIn: () => new TriggerIn(),
  triggerOut: () => new TriggerOut(),
  waitForAll: () => new WaitForAll(),
  exclusiveGate: () => new ExclusiveGate(),
  checkEthBalance: () => new CheckEthBalance(),
  checkBalanceForERC20: () => new CheckBalanceForERC20(),
  getRecentTransactions: () => new GetRecentTransactions(),
  checkForRecentTransactionsFromWallet: () =>
    new CheckForRecentTransactionsFromWallet(),
  weaviateWikipedia: () => new WeaviateWikipedia(),
  getWikipediaSummary: () => new GetWikipediaSummary(),
  merge: () => new Merge(),
  orGate: () => new OrGate(),
  log: () => new Log(),
  queryGoogle: () => new QueryGoogle(),
  ImageGeneration: () => new ImageGeneration(),
  Generator: () => new Generator(),
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

export const getComponents = () => {
  const sortedComponents = Object.keys(components)
    .sort()
    .reduce<Record<any, any>>((acc: any, key) => {
      acc[key] = components[key]
      return acc
    }, {} as Record<any, any>)

  return Object.values(sortedComponents)
    .map(component => component())
    .sort(compare)
}
