To fine-tune the model, first upload a file containing prompts and completions.

The file can be CSV, Excel, or JSONL. It must contain two columns, "prompt" and "completion". For Excel, the first column is "prompt", and the second column is "completion". Combined they cannot have more than 2048 tokens. [More details](https://beta.openai.com/docs/guides/fine-tuning/preparing-your-dataset)

Then create a new model using that training file. You can use a second file for validating the model. Read more about [prompt design](https://beta.openai.com/docs/guides/completion/prompt-design).

For example:

```
{ "prompt": "Company: BHFF insurance\nProduct: allround insurance\nAd:One stop shop for all your insurance needs!\nSupported:",
  "completion": "yes" }
{ "prompt": "Company: Loft conversion specialists\nProduct: -\nAd:Straight teeth in weeks!\nSupported:",
  "completion":"no" }
```
