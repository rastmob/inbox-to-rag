require('dotenv').config();
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const { Configuration, OpenAIApi } = require('openai');

// Load and parse XML
const xmlData = fs.readFileSync('emails.xml', 'utf8');
const parser = new XMLParser();
const parsed = parser.parse(xmlData);

let emails = parsed.emails?.email || [];
if (!Array.isArray(emails)) emails = [emails];

const chunks = emails.map(e => {
  return `Subject: ${e.subject}\nFrom: ${e.from}\nDate: ${e.date}\nBody: ${e.text}`;
});

// OpenAI config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function embedChunks(chunks) {
  const vectors = [];
  for (const chunk of chunks) {
    const res = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: chunk
    });
    vectors.push({
      embedding: res.data.data[0].embedding,
      text: chunk
    });
  }
  return vectors;
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

async function askQuestion(question, embeddedChunks) {
  const qEmbed = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: question
  });
  const questionVec = qEmbed.data.data[0].embedding;

  const ranked = embeddedChunks
    .map(item => ({
      score: cosineSimilarity(item.embedding, questionVec),
      text: item.text
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = ranked.map(r => r.text).join('\n\n---\n\n');

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an assistant helping based on email context.' },
      { role: 'user', content: `Answer the question using the emails:\n\n${context}\n\nQuestion: ${question}` }
    ]
  });

  return response.data.choices[0].message.content;
}

(async () => {
  const vectors = await embedChunks(chunks);
  const answer = await askQuestion('What did John say about the invoice?', vectors);
  console.log('\n🧠 Answer:\n', answer);
})();
