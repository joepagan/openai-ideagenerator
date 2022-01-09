require('dotenv').config();
const OpenAI = require('openai-api');
const fs = require('fs');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);
const words = fs.readFileSync('./data/words-and-phrases.txt', 'utf8', (err, data) => data.trim()).split('\n');

// let words2 = [];
// words.forEach((word) => {
//     word.split(',').forEach((w) => {
//         // trim whitespace
//         words2.push(w.trim());
//     });
// });

// let text = words2.join('\n');
// fs.writeFileSync('data/modified.txt', text, "utf8");


let wordsString = '';
words.forEach((word, index) => {
    if (index === 0) {
        wordsString = word;
        return;
    }
    wordsString = `${word}, ${wordsString}`;
});
// console.log(wordsString);

(async () => {
    for (let i = 0; i < 5; i++) {
        const gptResponse = await openai.complete({
            engine: 'davinci',
            prompt: `This is a phrase generator\n\nPhrase description: A phrase using seed words\nSeed words: bob, bucket, tulip, dog, run, down\nThe phrase: the dog who ran, pour the bucket, down went the dog\n\nPhrase description: A phrase using seed words\nSeed words: ${wordsString}\nThe phrase:`,
            maxTokens: 20,
            temperature: 0.9,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['\n', "testing"]
        });
    
        console.log(gptResponse.data.choices[0].text);
    }
})();
