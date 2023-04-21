import bm25 from "wink-bm25-text-search"
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model"
import soundex from "wink-nlp-utils/src/string-soundex.js"
const nlp = winkNLP(model);
const its = nlp.its;
const prepTask = function (text) {
    const tokens = [];
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
            //@ts-ignore
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
            action: tool.action,
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
    console.log("Query:" + inputText);
    console.log("Result: " + results)
    return results.map((result) => {
        result = { id: result[0], score: result[1] }
        const tool = tools.find((tool) => tool.id == result.id);
        return { ...tool, score: result.score };
    });
}

// DOCUMENTED 
import Rete from 'rete'
import {
    MagickNode,
    MagickWorkerInputs,
    MagickWorkerOutputs,
    ModuleContext,
    WorkerData,
    InputControl,
    SocketGeneratorControl,
    anySocket,
    stringSocket,
    triggerSocket,
    MagickComponent
} from '@magickml/core'

const info = 'Select an agent based on the input prompt.';

type InputReturn = {
    embedding: any;
};

export class AgentRecommender extends MagickComponent<Promise<any>> {
    constructor() {
        super('Agent Recommender', {
            outputs: {
                trigger: 'option',
                output: 'output'
            },
        }, 'Langchain', info);
    }
    builder(node: MagickNode): MagickNode {
        const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
        const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
        const defaultOutput = new Rete.Output('output', 'output', anySocket)
        const prompt = new Rete.Input('prompt', 'Prompt', stringSocket, true)

        const inputGenerator = new SocketGeneratorControl({
            connectionType: 'input',
            ignored: ['trigger', 'prompt', 'output'],
            name: 'Input Sockets',
        })

        const nameControl = new InputControl({
            dataKey: 'name',
            name: 'Component Name',
        })
        node.inspector
            .add(nameControl)
            .add(inputGenerator)

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
        try {
            console.log("INPUTS", inputs)
            const prompt = (inputs["prompt"] || ["NO PROMPT"])[0]
            delete inputs["prompt"]
            let tool = Object.values((inputs || { key: "NO TOOL FOUND" })).map((input) => {
                return input[0]
            })
            console.log(tool)
            //Minimum 3 Tools required
            //@ts-ignore
            tool.push({
                //@ts-ignore
                title: "Default",
                body: "No Relevant Tools Found",
                id: "101",
                keyword: "NONE",
                function_name: "action",
                action: "const action = () => {return 'NO RELEVANT TOOL FOUND'}"
            })
            const recommendedTools = recommendTools(tool, prompt);
            console.log("RECOMMENDED TOOLS", recommendedTools)

            if (Array.isArray(recommendedTools) && recommendedTools.length > 0) {
                const strFn = recommendedTools[0].action
                const myFunction = new Function(`${strFn}; return ${recommendedTools[0].function_name}`)();
                const return_value = await myFunction(context)
                return {
                    output: return_value
                };
            }
            return {
                output: "NO OUTPUT"
            };
        } catch (error) {
            console.log("ERROR", error)
            return {
                output: "NO OUTPUT"
            };
        }

    }
}