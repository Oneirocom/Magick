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
import bm25 from "wink-bm25-text-search"
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model"
import soundex from "wink-nlp-utils/src/string-soundex.js"


const info = 'Select an agent based on the input prompt.';

// type InputReturn = {
//     embedding: any;
// };

// Create the nlp model for tokenizer and soundbox
const nlp = winkNLP(model);
const its = nlp.its;
//All the tool properties are subjected to this prepTask for adding to the index
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

/**
 * Takes in the tools and input prompt and selects the best tool based on the input prompt
 * @param tools 
 * @param inputText 
 * @returns 
 */
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
    return results.map((result) => {
        result = { id: result[0], score: result[1] }
        const tool = tools.find((tool) => tool.id == result.id);
        return { ...tool, score: result.score };
    });
}



/**
 * 
 */
export class AgentExecutor extends MagickComponent<Promise<any>> {
    constructor() {
        super('Agent Executor', {
            outputs: {
                trigger: 'option',
                output: 'output'
            },
        }, 'Experimental', info);
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
  * Worker function to parse the inputs, and get the tool properties from them.
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
            const prompt = (inputs["prompt"] || ["NO PROMPT"])[0]
            delete inputs["prompt"]
            const tool = Object.values((inputs || { key: "NO TOOL FOUND" })).map((input) => {
                return input[0]
            })
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
            if (Array.isArray(recommendedTools) && recommendedTools.length > 0) {
                const strFn = recommendedTools[0].action
                const myFunction = new Function(`${strFn}; return ${recommendedTools[0].function_name}`)();
                const return_value = await myFunction({...context, prompt: prompt})
                if (return_value == "") return { output: ""}
                return {
                    output: "The action result is " + return_value
                };
            }
            return {
                output: "NO ACTION TO BE TAKEN"
            };
        } catch (error) {
            console.log("ERROR", error)
            return {
                output: "NO ACTION TO BE TAKEN"
            };
        }

    }
}