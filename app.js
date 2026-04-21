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
  const completion = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          '你是资讯网站评论区的运营人员，请根据文章和评论生成自然回复，不要解释，不要加引号，控制在80字以内。'
      },
      {
        role: 'user',
        content: `标题：${title}\n正文：${content}\n评论：${question}`
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

app.listen(3000, () => {
  console.log('🔥 http://localhost:3000/test')
})