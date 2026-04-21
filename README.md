# ai-comment-reply-test
一、AI调用
* 接入了 DeepSeek 
* 根据 标题 + 正文 + 评论 自动生成回复
* 回复风格做了优化
* 能自动区分：
    * 提问类评论 → 直接回答
    * 观点/质疑 → 用比较友好的方式回应
* 回复长度控制在 60 字以内
* 做了基础清洗（去空格、换行、引号）
* 评论太短会走默认回复
* AI 调用异常也有 fallback，不会影响接口可用性

二、接口 & 部署
* 用 Node.js + Express 搭了一个 HTTP API
* 接口支持 JSON 请求
* 已部署到 Render，可以直接调用
当前地址：https://ai-comment-reply-test.onrender.com/test

