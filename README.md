# 📬 inbox-to-rag

> Convert your XML email archive into a smart RAG (Retrieval-Augmented Generation) source using Node.js + OpenAI

---

### 🔍 What is this?

**inbox-to-rag** is a lightweight Node.js script that takes an XML file containing your emails and lets you ask smart questions about them — powered by OpenAI embeddings + GPT.

Great for:
- Searching your inbox intelligently
- Prototyping RAG workflows
- Working with email archives

---

### 💡 How it works

1. 📥 Load and parse `emails.xml`
2. 🧠 Create vector embeddings with OpenAI
3. 🧾 Compare your question to the email content
4. 🤖 Feed the most relevant chunks into GPT-4 for the final answer

---

### ⚙️ Setup

#### 1. Clone this repo
```bash
git clone https://github.com/rastmob/inbox-to-rag.git
cd inbox-to-rag
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Create your `.env` file
```env
OPENAI_API_KEY=your-openai-key-here
```

You can use `.env.example` as a starting point.

#### 4. Add your `emails.xml`
Drop your XML file in the root of the project. The structure should look something like:

```xml
<emails>
  <email>
    <subject>Invoice Reminder</subject>
    <from>john@example.com</from>
    <date>2024-12-01</date>
    <text>Just a reminder about the unpaid invoice from November.</text>
  </email>
  ...
</emails>
```

---

### 🚀 Run it

```bash
npm start
```

You can change the sample question in `index.js`:
```js
const answer = await askQuestion('What did John say about the invoice?', vectors);
```

---

### 🧠 Example output

```
🧠 Answer:
John reminded you about an unpaid invoice from November. He likely expects a follow-up or payment soon.
```

---

### 📦 Technologies Used

- Node.js
- [OpenAI Embeddings + GPT-4](https://platform.openai.com/docs/)
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)
- dotenv

---

### ✨ Author

Made with ❤️ by [Mehmet Alp](mailto:mehmet.alp@rastmobile.com)  
📬 For software development related emails: **mehmet.alp@rastmobile.com**  
🔗 [Rast Mobile](https://www.rastmobile.com)  
👨‍💻 GitHub: [rastmob](https://github.com/rastmob)

---

### 🪪 License

MIT — use freely, improve freely 🚀
