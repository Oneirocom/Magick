import nlp from "compromise";
import nlpNouns from "compromise";
import nlpNgrams from "compromise"
import nlpNer from "compromise";
import nlpSentence from "compromise";
import * as stringSimilarity from "string-similarity";
nlp.extend(nlpNer as any);
nlp.extend(nlpNouns as any);
nlp.extend(nlpNgrams as any);
nlp.extend(nlpSentence as any);



function extractSentences(text) {
  const doc = nlp(text);
  return doc.sentences().json().map(sentence => sentence.text);
}

function filterIrrelevantNounPhrases(nounPhrases) {
  const commonWords = ['a', ',', 'an', 'the', 'this', 'that', 'these', 'those', 'it', 'they', 'he', 'she', 'we', 'you', 'i', 'am', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'be', 'been', 'being', 'get', 'got', 'gotten', 'gets', 'do', 'does', 'did', 'done', 'doing', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'under', 'between', 'out', 'up', 'down', 'off', 'back', 'away', 'throughout', 'before', 'above', 'below', 'near', 'next', 'since', 'until', 'via', 'upon', 'without', 'within', 'according', 'along', 'aside', 'away', 'back', 'besides', 'between', 'beyond', 'but', 'concerning', 'considering', 'despite', 'during', 'except', 'excluding', 'following', 'for', 'including', 'inside', 'into', 'like', 'minus', 'near', 'next', 'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without'];
  return nounPhrases.filter(
    (phrase) => !commonWords.some((word) => phrase.toLowerCase().includes(word))
  )
};
function generateQuestionsAndAnswers(corpus) {
  const sentences = extractSentences(corpus);
  const questionsAndAnswers = [];

  const questionTemplates = [
    { format: 'What is ${subject}?', type: 'definition' },
    { format: 'What does ${subject} do?', type: 'function' },
    { format: 'What are the features of ${subject}?', type: 'features' },
    { format: 'How does ${subject} work?', type: 'operation' },
    { format: 'What is the meaning of ${subject}?', type: 'definition' },
    { format: 'What is the purpose of ${subject}?', type: 'function' },
    { format: 'What is the role of ${subject}?', type: 'function' },
    { format: 'What is ${subject} used for?', type: 'function' },
    { format: 'What are the benefits of ${subject}?', type: 'features' },
    { format: 'What are the drawbacks of ${subject}?', type: 'features' },
    { format: 'How is ${subject} related to ${object}?', type: 'relationship' },
    { format: 'What are the advantages of ${subject} over ${object}?', type: 'comparison' },
    { format: 'What are the disadvantages of ${subject} compared to ${object}?', type: 'comparison' },
    { format: 'What is the history of ${subject}?', type: 'history' },
    { format: 'What are the future prospects of ${subject}?', type: 'future' },
    { format: 'What are the challenges facing ${subject}?', type: 'challenges' },
    { format: 'What are the opportunities available for ${subject}?', type: 'opportunities' },
    { format: 'What is the impact of ${subject} on society?', type: 'impact' },
    { format: 'What is the significance of ${subject}?', type: 'significance' },
    { format: 'What is the role of ${subject} in the ${object} industry?', type: 'industry' },
    { format: 'What is the current state of ${subject}?', type: 'state' },
    { format: 'When did ${subject} first appear?', type: 'history' },
    { format: 'When was ${subject} invented?', type: 'history' },
    { format: 'When did ${subject} become popular?', type: 'history' },
    { format: 'When was ${subject} introduced?', type: 'history' },
    { format: 'When will ${subject} be available?', type: 'future' },
    { format: 'When is ${subject} expected to be released?', type: 'future' },
    { format: 'When was ${subject} last updated?', type: 'state' },
    { format: 'When did ${subject} last receive a major update?', type: 'state' },
    { format: 'When was ${subject} last modified?', type: 'state' },
    { format: 'The ${subject} is...', type: 'definition' },
    { format: 'The ${subject} does...', type: 'function' },
    { format: 'The ${subject} has...', type: 'features' },
    { format: 'The ${subject} works by...', type: 'operation' },
    { format: 'The ${subject} is used for...', type: 'function' },
    { format: 'The benefits of ${subject} are...', type: 'features' },
    { format: 'The drawbacks of ${subject} are...', type: 'features' },
    { format: '${subject} - what can you tell me about it?', type: 'open' },
    { format: 'Tell me about ${subject}', type: 'open' },
    { format: 'What comes to mind when you think of ${subject}?', type: 'open' },
    { format: '${subject} - when did it first become popular?', type: 'history' },
    { format: '${subject} - what is its origin?', type: 'history' },
    { format: 'How has ${subject} evolved over time?', type: 'history' },
    { format: 'What makes ${subject} unique?', type: 'features' },
    { format: 'Why is ${subject} important?', type: 'significance' },
    { format: '${subject} - what are some examples?', type: 'examples' },
    { format: '${subject} - what are some common uses?', type: 'function' },
    { format: '${subject} - what are some potential drawbacks?', type: 'challenges' },
    { format: 'What are your thoughts on ${subject}?', type: 'opinions' },
    { format: '${subject} - is it worth the investment?', type: 'opinions' },
    { format: '${subject} - what are the latest developments?', type: 'future' },
    { format: 'When it comes to ${subject}, what are some current trends', type: 'state' },
    { format: 'What are some possible uses of ${subject}?', type: 'function' },
    { format: 'How can ${subject} be improved?', type: 'challenges' },
    { format: 'What are some potential applications of ${subject}?', type: 'opportunities' },
    { format: 'What are some future developments for ${subject}?', type: 'future' },
    { format: 'What are some common misconceptions about ${subject}?', type: 'significance' },
    { format: 'What are some real-world examples of ${subject} in action?', type: 'examples' },
    { format: 'What are some current trends in ${subject}?', type: 'state' },
    { format: 'What are some ethical considerations related to ${subject}?', type: 'impact' },
    { format: 'What are some potential risks associated with using ${subject}?', type: 'challenges' },
    { format: 'What are some benefits of ${subject} that are often overlooked?', type: 'features' },
    { format: 'What are some ways that ${subject} is changing the industry?', type: 'industry' },
    { format: 'What are some key players in the ${subject} market?', type: 'industry' },
    { format: 'What are some emerging technologies that are related to ${subject}?', type: 'future' },
    { format: 'What are some innovative ways that ${subject} is being used?', type: 'examples' },
    { format: 'What are some challenges that ${subject} is facing in the current market?', type: 'challenges' },
    { format: 'What are some potential partnerships or collaborations for ${subject}?', type: 'opportunities' },
    { format: 'What are some common misconceptions about the ${object} industry?', type: 'significance' },
    { format: 'What are some real-world examples of the ${object} industry in action?', type: 'examples' },
    { format: 'What are some current trends in the ${object} industry?', type: 'state' },
    { format: 'What are some ethical considerations related to the ${object} industry?', type: 'impact' },
    { format: 'What are some potential risks associated with the ${object} industry?', type: 'challenges' },
    { format: 'What are some benefits of the ${object} industry that are often overlooked?', type: 'features' },
    { format: 'What are some ways that the ${object} industry is changing?', type: 'industry' },
    { format: 'What are some key players in the ${object} industry?', type: 'industry' },
    { format: 'What are some emerging technologies that are related to the ${object} industry?', type: 'future' },
    { format: 'What are some innovative ways that the ${object} industry is being used?', type: 'examples' },
    { format: 'What are some challenges that the ${object} industry is facing in the current market?', type: 'challenges' },
    { format: 'What are some potential partnerships or collaborations for the ${object} industry?', type: 'opportunities' },
    { format: '${subject} - what do you think?', type: 'opinion' },
    { format: 'What are some experts saying about ${subject}?', type: 'opinion' },
    { format: 'What are some alternative perspectives on ${subject}?', type: 'opinion' },
    { format: 'What are some potential future scenarios for ${subject}?', type: 'future' },
    { format: 'What are some historical events that have influenced the development of ${subject}?', type: 'history' },

  ];

  // const commonWords = ['a', 'an', 'the', 'this', 'that', 'these', 'those', 'it', 'they', 'he', 'she', 'we', 'you', 'i', 'am', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'be', 'been', 'being', 'get', 'got', 'gotten', 'gets', 'do', 'does', 'did', 'done', 'doing', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'under', 'between', 'out', 'up', 'down', 'off', 'back', 'away', 'throughout', 'before', 'above', 'below', 'near', 'next', 'since', 'until', 'via', 'upon', 'without', 'within', 'according', 'along', 'aside', 'away', 'back', 'besides', 'between', 'beyond', 'but', 'concerning', 'considering', 'despite', 'during', 'except', 'excluding', 'following', 'for', 'including', 'inside', 'into', 'like', 'minus', 'near', 'next', 'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without'];
  // Regular expression for matching words and numbers joined by non-letter characters
  const splitRegex = /([\d\w]+)([^\d\w]+)/;


  sentences.forEach(sentence => {
    const doc = nlp(sentence);
    // Find potential subjects and predicates
    // Remove punctuation and split into tokens
    const tokens = doc.terms().out('array').map(token => token.replace(/[^\d\w]+/g, '').toLowerCase());
    const subjects = filterIrrelevantNounPhrases(doc.match('#Noun+').out('array')).map(token => token.replace(/[^\d\w]+/g, '').toLowerCase());
    const predicates = filterIrrelevantNounPhrases(doc.match('#Verb+').out('array')).map(token => token.replace(/[^\d\w]+/g, '').toLowerCase());
    console.log(predicates)
    // Create a list of sentence tokens
    // const sentenceTokens = doc.terms().out('array');

    // Iterate through each subject and predicate
    zip([subjects, predicates]).forEach((subject, predicate) => {

      // Calculate the average distance between the sentence and question templates
      const templateDistances = questionTemplates.map(template => {
        const templateTokens = template.format.split(' ');
        const templateSum = templateTokens.reduce((sum, token) => {
          return sum + tokens.reduce((total, sentenceToken) => {
            // Handle cases where two words or a number and word are joined together
            const matches = sentenceToken.match(splitRegex);
            if (matches && matches[1] === token) {
              return total + stringSimilarity.compareTwoStrings(matches[1], token);
            } else {
              return total + stringSimilarity.compareTwoStrings(sentenceToken, token);
            }
          }, 0);
        }, 0);
        return templateSum / templateTokens.length;
      });
      const minDistance = Math.min(...templateDistances);

      // Only generate a question if the subject and predicate are close enough to the question template
      if (minDistance < 3) {
        // Choose a question template with the closest distance
        const closestTemplateIndex = templateDistances.indexOf(minDistance);
        const template = questionTemplates[closestTemplateIndex];

        // Generate the question and answer
        console.log(subject, predicate)
        const question = template.format.replace('${subject}', subject.join(" ")).replace('${object}', predicate);
        //const answer = sentence.replace(subject, '${subject}').replace(predicate, '${predicate}');

        // Add the question and answer to the list
        questionsAndAnswers.push({ prompt: question, completeIn: sentence, type: template.type });
      }
    });
  });


  const uniqueQuestionsAndAnswers = [];
  const uniqueQuestions = new Set();
  questionsAndAnswers.forEach(questionAndAnswer => {
    if (!uniqueQuestions.has(questionAndAnswer.prompt)) {
      uniqueQuestionsAndAnswers.push(questionAndAnswer);
      uniqueQuestions.add(questionAndAnswer.prompt);
    }
  });

  console.log("uniqueQuestionsAndAnswers", uniqueQuestionsAndAnswers);
  return uniqueQuestionsAndAnswers;
}
function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) { return array[i] })
  });
}
async function extractPromptsAndCompletions(text, windowSize = 2, task = 'question_answering') {
  // Tokenize the text into sentences
  //@ts-ignore
  const natural = await import('natural/lib/natural/tokenizers');
  // const dist = await import('natural/lib/natural/distance')
  const tokenizer = new natural.SentenceTokenizer();
  const TFTDF = await import('natural/lib/natural/tfidf');
  const tfidf = new TFTDF.TfIdf();
  let data = [];
  switch (task) {
    case 'completion':
      const sentences = tokenizer.tokenize(text);

      for (let i = 0; i < sentences.length - windowSize; i++) {
        const prompt = sentences.slice(i, i + windowSize).join(' ');
        const completion = sentences[i + windowSize];
        data.push({ prompt, completion });
      }
      break;
    case 'summarization':
      // Implement your custom summarization extraction logic here
      break;
    case 'question_answering':
      console.log("text", text)
      tfidf.addDocument(text);
      const keywords = [];
      const numKeywords = 100;

      tfidf.listTerms(0 /* document index */).slice(0, numKeywords).forEach((item) => {
        keywords.push(item.term);
      });
      /* console.log("keywords", keywords)
      const pos = extractPOS(text);
      console.log(pos)
      const grammar = new Grammar();
      populateGrammar(grammar, pos);
      grammar.getRules() */
      data = generateQuestionsAndAnswers(text);
      console.log("data", data)
      break;
    default:
      throw new Error('Invalid task specified.');
  }
  return data;
}


export { extractPromptsAndCompletions }