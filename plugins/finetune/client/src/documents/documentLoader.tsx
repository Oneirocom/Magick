import axios from "axios";
import nlp from "compromise";
import nlpNouns from "compromise";
import nlpNgrams from "compromise"
import nlpNer from "compromise";
nlp.extend(nlpNer as any);
nlp.extend(nlpNouns as any);
nlp.extend(nlpNgrams as any);

function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}



function filterIrrelevantNounPhrases(nounPhrases) {
    const commonWords = ['thing', 'way', 'lot', 'part'];
    return nounPhrases.filter(
        (phrase) => !commonWords.some((word) => phrase.toLowerCase().includes(word))
    );
}

function generateQuestions(tokenizedSentences) {
    const text = tokenizedSentences.join(' ');
    const doc = nlp(text);
    const entities = doc.topics().out('array');
    const nounPhrases = filterIrrelevantNounPhrases(doc.nouns().out('array'));
    const questions = [];
  
    for (const entity of entities) {
      questions.push(`Who or what is ${entity}?`);
    }
  
    for (const nounPhrase of nounPhrases) {
      questions.push(`What can you tell me about ${nounPhrase}?`);
    }
  
    return removeDuplicates(questions);
  }

async function extractPromptsAndCompletions(text, windowSize = 2, task = 'question_answering') {
    // Tokenize the text into sentences
    //@ts-ignore
    const natural = await import('natural/lib/natural/tokenizers');
    const dist = await import('natural/lib/natural/distance')
    const tokenizer = new natural.SentenceTokenizer();
    function findAnswer(text, keyword) {
        const threshold = 0.7; // You can adjust this value to change the similarity threshold
        const sentences = tokenizer.tokenize(text);
        const jw = dist.JaroWinklerDistance;
        const relatedSentences = sentences.filter((sentence) => {
          const wordsInSentence = sentence.toLowerCase().split(' ');
          return wordsInSentence.some((word) => jw(word, keyword.toLowerCase(), {ignoreCase: true} ) >= threshold);
        });
        
        return relatedSentences.join('.');
      }
      
    const data = [];
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
            const q_sent = tokenizer.tokenize(text);
            const questions = generateQuestions(q_sent);
            for (const question of questions) {
                const keywords = nlp(question as string).nouns().out('array');
                const answer = keywords
                    .map((keyword) => findAnswer(text, keyword))
                    .filter((answer) => answer !== '')
                    .join(' ');
                data.push({ prompt: question, completion: answer });
            }
            break;
        default:
            throw new Error('Invalid task specified.');
    }
    return data;
}


export { extractPromptsAndCompletions}