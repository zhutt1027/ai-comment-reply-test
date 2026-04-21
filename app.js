require('dotenv').config()

const express = require('express')
const OpenAI = require('openai')

const app = express()
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})

function cleanReply(text) {
  if (!text) return ''
  return String(text)
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function generateReply(title, content, question) {
  const safeQuestion = String(question || '').trim()

  if (safeQuestion.length < 3) {
    return '感谢关注，欢迎继续讨论～'
  }

  if (/^(哈哈|呵呵|666|牛|离谱|\?+|？+)$/.test(safeQuestion)) {
    return '感谢关注，欢迎继续讨论～'
  }

  const completion = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          '你是资讯网站评论区的运营人员，请以自然、口语化、有人味的方式回复用户评论。不要使用“根据文章”“本文”等表达。如果是提问，直接回答；如果是观点或质疑，用友好方式回应。控制在60字以内。'
      },
      {
        role: 'user',
        content: `标题：${title}\n正文：${content}\n评论：${safeQuestion}`
      }
    ]
  })

  return cleanReply(
    completion.choices?.[0]?.message?.content || ''
  )
}

app.post('/test', async (req, res) => {
  try {
    const { title, content, question } = req.body

    const reply = await generateReply(title, content, question)

    res.json({ ok: true, reply })
  } catch (err) {
    console.error(err)

    res.json({
      ok: true,
      reply: '感谢你的关注～'
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🔥 http://localhost:${PORT}/test`)
})

app.get('/', (req, res) => {
  res.send('服务正常运行 🚀')
})