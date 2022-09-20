import { ThothComponent } from '../types'
import { AddAgent } from './agents/AddAgent'
import { AgentTextCompletion } from './agents/AgentTextCompletion'
import { CacheManagerDelete } from './agents/CacheManagerDelete'
import { CacheManagerGet } from './agents/CacheManagerGet'
import { CacheManagerSet } from './agents/CacheManagerSet'
import { CreateOrGetAgent } from './agents/CreateOrGetAgent'
import { CustomTextCompletion } from './agents/CustomTextCompletion'
import { EventRecall } from './agents/EventRecall'
import { EventStore } from './agents/EventStore'
import { InputDestructureComponent } from './agents/InputDestructure'
import { InputRestructureComponent } from './agents/InputRestructure'
import { Request } from './agents/Request'
import { InputComponent } from './io/Input'
import { Output } from './io/Output'
import { TriggerIn } from './io/TriggerIn'
import { TriggerOut } from './io/TriggerOut'
import { BooleanGate } from './logic/BooleanGate'
import { Coallesce } from './logic/Coallesce'
import { Code } from './logic/Code'
import { ForEach } from './logic/ForEach'
import { IsNullOrUndefined } from './logic/IsNullOrUndefined'
import { IsQuery } from './logic/IsQuery'
import { IsVariableTrue } from './logic/IsVariableTrue'
import { LogicalOperator } from './logic/LogicalOperator'
import { OrGate } from './logic/OrGate'
import { SwitchGate } from './logic/SwitchGate'
import { WaitForAll } from './logic/WaitForAll'
import { WhileLoop } from './logic/WhileLoop'
import { Wysiwyg } from './logic/Wysiwyg'
import { ActionTypeComponent } from './ml/ActionType'
import { Classifier } from './ml/Classifier'
import { DifficultyDetectorComponent } from './ml/DifficultyDetector'
import { EntityDetector } from './ml/EntityDetector'
import { Generator } from './ml/Generator'
import { HuggingfaceComponent } from './ml/Huggingface'
import { ItemTypeComponent } from './ml/ItemDetector'
import { KeywordExtractor } from './ml/KeywordExtractor'
import { NamedEntityRecognition } from './ml/NamedEntityRecognition'
import { ProseToScript } from './ml/ProseToScript'
import { SafetyVerifier } from './ml/SafetyVerifier'
import { SentenceMatcher } from './ml/SentenceMatcher'
import { SummarizeFacts } from './ml/SummarizeFacts'
import { TenseTransformer } from './ml/TenseTransformer'
import { TextToSpeech } from './ml/TextToSpeech'
import { TimeDetectorComponent } from './ml/TimeDetector'
import { DocumentDelete } from './search/DocumentDelete'
import { DocumentEdit } from './search/DocumentEdit'
import { DocumentGet } from './search/DocumentGet'
import { DocumentSet } from './search/DocumentSet'
import { DocumentSetMass } from './search/DocumentSetMass'
import { DocumentStoreGet } from './search/DocumentStoreGet'
import { RSSGet } from './search/RSSGet'
import { Search } from './search/Search'
import { VectorSearch } from './search/VectorSearch'
import { WeaviateWikipedia } from './search/WeaviateWikipedia'
import { GetWikipediaSummary } from './services/GetWikipediaSummary'
import { SpellComponent } from './services/Spell'
import { StateRead } from './state/StateRead'
import { StateWrite } from './state/StateWrite'
import { ComplexStringMatcher } from './strings/ComplexStringMatcher'
import { JoinListComponent } from './strings/JoinList'
import { ProfanityFilter } from './strings/ProfanityFilter'
import { RandomStringFromList } from './strings/RandomStringFromList'
import { StringAdder } from './strings/StringAdder'
import { StringCombiner } from './strings/StringCombiner'
import { StringEvaluator } from './strings/StringEvaluator'
import { StringProcessor } from './strings/StringProcessor'
import { Alert } from './utility/AlertMessage'
import { Cast } from './utility/Cast'
import { Destructure } from './utility/Destructure'
import { Echo } from './utility/Echo'
import { InputsToJSON } from './utility/InputsToJSON'
import { InRange } from './utility/InRange'
import { Log } from './utility/Log'
import { Merge } from './utility/Merge'
import { VariableReplacer } from './utility/VariableReplacer'
import { ArrayVariable } from './variable/ArrayVariable'
import { BooleanVariable } from './variable/BooleanVariable'
import { FewshotVariable } from './variable/FewshotVariable'
import { NumberVariable } from './variable/NumberVariable'
import { StringVariable } from './variable/StringVariable'

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

// NOTE: PLEASE KEEP THESE IN ALPHABETICAL ORDER
// todo some kind of custom build parser perhaps to take car of keeping these in alphabetical order

export const components = {
  actionTypeComponent: () => new ActionTypeComponent(),
  alert: () => new Alert(),
  booleanGate: () => new BooleanGate(),
  cast: () => new Cast(),
  coallesce: () => new Coallesce(),
  inRange: () => new InRange(),
  code: () => new Code(),
  wysiwyg: () => new Wysiwyg(),
  sentenceMatcher: () => new SentenceMatcher(),
  difficultyDetectorComponent: () => new DifficultyDetectorComponent(),
  destructure: () => new Destructure(),
  // enkiTask: () => new EnkiTask(),
  entityDetector: () => new EntityDetector(),
  complexStringMatcher: () => new ComplexStringMatcher(),
  echo: () => new Echo(),
  variableReplacer: () => new VariableReplacer(),
  SummarizeFacts: () => new SummarizeFacts(),
  textToSpeech: () => new TextToSpeech(),
  agentTextCompletion: () => new AgentTextCompletion(),
  customTextCompletion: () => new CustomTextCompletion(),
  keywordExtractor: () => new KeywordExtractor(),
  namedEntityRecognition: () => new NamedEntityRecognition(),
  createOrGetAgent: () => new CreateOrGetAgent(),
  Classifier: () => new Classifier(),
  isNullOrUndefined: () => new IsNullOrUndefined(),
  isQuery: () => new IsQuery(),
  isVariableTrue: () => new IsVariableTrue(),
  conversationStore: () => new EventStore(),
  conversationRecall: () => new EventRecall(),
  request: () => new Request(),
  search: () => new Search(),
  vectorSearch: () => new VectorSearch(),
  documentGet: () => new DocumentGet(),
  documentEdit: () => new DocumentEdit(),
  documentDelete: () => new DocumentDelete(),
  documentSet: () => new DocumentSet(),
  documentSetMass: () => new DocumentSetMass(),
  documentStoreGet: () => new DocumentStoreGet(),
  rssGet: () => new RSSGet(),
  forEach: () => new ForEach(),
  whileLoop: () => new WhileLoop(),
  cacheManagerGet: () => new CacheManagerGet(),
  cacheManagerDelete: () => new CacheManagerDelete(),
  cacheManagerSet: () => new CacheManagerSet(),
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
  addAgent: () => new AddAgent(),
  logicalOperator: () => new LogicalOperator(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputDestructureComponent: () => new InputDestructureComponent(),
  inputRestructureComponent: () => new InputRestructureComponent(),
  inputsToJson: () => new InputsToJSON(),
  itemTypeComponent: () => new ItemTypeComponent(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new SpellComponent(),
  output: () => new Output(),
  proseToScript: () => new ProseToScript(),
  safetyVerifier: () => new SafetyVerifier(),
  stateWrite: () => new StateWrite(),
  stateRead: () => new StateRead(),
  stringProcessor: () => new StringProcessor(),
  switchGate: () => new SwitchGate(),
  tenseTransformer: () => new TenseTransformer(),
  timeDetectorComponent: () => new TimeDetectorComponent(),
  triggerIn: () => new TriggerIn(),
  triggerOut: () => new TriggerOut(),
  waitForAll: () => new WaitForAll(),
  weaviateWikipedia: () => new WeaviateWikipedia(),
  getWikipediaSummary: () => new GetWikipediaSummary(),
  merge: () => new Merge(),
  orGate: () => new OrGate(),
  log: () => new Log(),
}

function compare(a: ThothComponent<unknown>, b: ThothComponent<unknown>) {
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
    // @ts-ignore
    // TODO fix this ignore
    .reduce(function (acc, key: keyof typeof components) {
      acc[key] = components[key]
      return acc
    }, {} as Record<string, any>)

  return Object.values(sortedComponents)
    .map(component => component())
    .sort(compare)
}
