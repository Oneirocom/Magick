
import Rete from 'rete';

import {
    InputControl,
    MagickComponent,
    MagickNode,
    MagickWorkerInputs,
    MagickWorkerOutputs,
    ModuleContext,
    SocketGeneratorControl,
    stringSocket,
    triggerSocket,
    WorkerData
} from "@magickml/core";

import bm25 from "wink-bm25-text-search";
import model from "wink-eng-lite-web-model";
import winkNLP from "wink-nlp";
import soundex from "wink-nlp-utils/src/string-soundex.js";

const nlp = winkNLP(model);
const its = nlp.its;
const prepTask = function (text) {
    const tokens: any[] = [];
    nlp
      .readDoc(text)
      .tokens()
      // Use only words ignoring punctuations etc and from them remove stop words
      .filter((t) => t.out(its.type) === "word" && !t.out(its.stopWordFlag))
      // Handle negation and extract stem of the word
      .each((t) => {
        const tokenStem = t.out(its.stem);
        const tokenSoundex = soundex(tokenStem);
        const tokenWithNegation = t.out(its.negationFlag)
          ? "!" + tokenSoundex
          : tokenSoundex;
        tokens.push(tokenWithNegation);
      });
  
    return tokens;
  };

function recommendTools(tools, inputText) {
    // Create the BM25 index
    function createBM25Index(tools) {
        const engine = new bm25();
        engine.defineConfig({ fldWeights: { title: 1, body: 2, keyword: 3 } });
        engine.definePrepTasks([prepTask]);
        const documents = tools.map((tool) => ({
            title: tool.title,
            body: tool.body,
            id: tool.id,
            keyword: tool.keyword,
        }));

        documents.forEach((element) => {
            engine.addDoc(element, element.id);
        });
        return engine;
    }

    const bm25Index = createBM25Index(tools);
    bm25Index.consolidate();
    const results = bm25Index.search(inputText);
    console.log("Query:" + inputText );
    console.log("Result: " + results)
    if (results.length === 0) {
        return [{"title": "Default", "body": "No results found"}]
    }
    return results.map((result) => {
        result = {id: result[0], score: result[1]}
        const tool = tools.find((tool) => tool.id == result.id);
        return {...tool, score: result.score};
      });
}

const info = 'Select an agent based on the input prompt.';

type InputReturn = {
    embedding: any;
};

export class AgentRecommender extends MagickComponent<Promise<any>> {
    constructor() {
        super('Agent Recommender', {
            outputs: {
                trigger: 'option',
                default: 'string',
            },
        }, 'Langchain', info);
    }
    builder(node: MagickNode): MagickNode {
        const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
        const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
        const defaultOutput = new Rete.Output('default', 'Default', stringSocket)
        const prompt = new Rete.Input('prompt', 'Prompt', stringSocket, true)
        const outputGenerator = new SocketGeneratorControl({
            connectionType: 'output',
            ignored: ['trigger', 'prompt', 'default'],
            name: 'Output Sockets',
        })

        const inputGenerator = new SocketGeneratorControl({
            connectionType: 'input',
            ignored: ['trigger', 'prompt', 'default'],
            name: 'Input Sockets',
        })

        const nameControl = new InputControl({
            dataKey: 'name',
            name: 'Component Name',
        })
        node.inspector
            .add(nameControl)
            .add(inputGenerator)
            .add(outputGenerator)

        return node
            .addInput(dataInput)
            .addInput(prompt)
            .addOutput(defaultOutput)
            .addOutput(dataOutput)

    }
    /**
  * Worker function to process and store the event
  * @param node
  * @param inputs
  * @param _outputs
  * @param context
  */
    async worker(
        node: WorkerData,
        inputs: MagickWorkerInputs,
        _outputs: MagickWorkerOutputs,
        context: ModuleContext,
    ) {
        console.log(_outputs)
        const prompt = (inputs["prompt"] || ["NO PROMPT"])[0]
        delete inputs["prompt"]
        let tool = Object.values((inputs || {key: "NO TOOL FOUND"})).map((input) => {
            return JSON.parse(input.join())
        })
        //Minimum 3 Tools required
        tool.push({
            title: "Default",
            body: "No Relevant Tools Found",
            id: "101",
            keyword: "NONE"
        })
        const recommendedTools = recommendTools(tool, prompt);
        console.log("RECOMMENDED TOOLS", recommendedTools)
        let output = {}
        if (recommendedTools) {
            if (recommendedTools[0].title == "Default") {
                output[recommendedTools[0].title] = ["No Relevant Tool Found"]
                console.log("OUTPUT", output)
                return output;
            }
            output[recommendedTools[0].title] = prompt
            console.log("OUTPUT", output)
        }
        return output;

    }
}