const API_KEY = process.env.STEPFUN_API_KEY
const ENDPOINT = (process.env.STEPFUN_ENDPOINT || "https://api.stepfun.com/v1").replace(/\/$/, "")
const MODEL = process.env.STEPFUN_MODEL || "step-3.7-flash"

if (!API_KEY?.trim()) {
  console.error("请设置环境变量 STEPFUN_API_KEY")
  process.exit(1)
}

async function chat(messages, systemPrompt, maxTokens = 256) {
  const body = {
    model: MODEL,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: maxTokens,
  }
  if (MODEL.includes("3.7")) body.reasoning_effort = "low"

  const res = await fetch(`${ENDPOINT}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)

  const msg = data.choices?.[0]?.message
  return (msg?.content || msg?.reasoning || "").trim() || "（无回复）"
}

function extractFirstJsonObject(text) {
  const start = text.indexOf("{")
  if (start === -1) throw new SyntaxError("未找到 JSON 对象")

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i++) {
    const char = text[i]
    if (inString) {
      if (escaped) escaped = false
      else if (char === "\\") escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === "{") depth++
    else if (char === "}") {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }

  throw new SyntaxError("JSON 对象不完整")
}

const tests = [
  {
    name: "1. 连接测试 (testApiConnection)",
    run: () => chat([{ role: "user", content: "请只回复：连接成功" }], "你是测试助手，请简短回复。", 128),
  },
  {
    name: "2. 对话测试 (chatCompletion)",
    run: async () => {
      const r1 = await chat(
        [{ role: "user", content: "我在北大计算机和清华软件工程之间纠结，该怎么选？" }],
        "你是 LifeSim 助手「未来」，用温暖语气提问，每次 2-3 句话。",
        256,
      )
      const r2 = await chat(
        [
          { role: "user", content: "我在北大计算机和清华软件工程之间纠结，该怎么选？" },
          { role: "assistant", content: r1 },
          { role: "user", content: "我比较保守，喜欢稳定，不太能接受失败。" },
        ],
        "你是 LifeSim 助手「未来」，用温暖语气提问，每次 2-3 句话。",
        256,
      )
      return `首轮: ${r1.slice(0, 60)}... | 次轮: ${r2.slice(0, 60)}...`
    },
  },
  {
    name: "3. 推演生成 (generateScenarioData)",
    run: async () => {
      const raw = await chat(
        [{
          role: "user",
          content: [
            "背景：考研保研择校，北大计算机 vs 清华软件工程，看重保研率",
            "对话：用户偏保守稳定，家庭中等，热爱学术研究",
            "请输出推演 JSON，含 userSummary,researchSummary,branches(3条),recommendation,disclaimer。只输出 JSON。",
          ].join("\n"),
        }],
        "你是 LifeSim 数据生成器，只输出合法 JSON，不要 markdown。",
        4096,
      )
      const data = JSON.parse(extractFirstJsonObject(raw))
      if (!data.branches?.length) throw new Error("JSON 缺少 branches")
      return `生成 ${data.branches.length} 条路径，推荐路线 #${data.recommendation?.primaryId}`
    },
  },
  {
    name: "4. 模型列表 (GET /models)",
    run: async () => {
      const res = await fetch(`${ENDPOINT}/models`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        signal: AbortSignal.timeout(15000),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
      const has = data.data?.some((m) => m.id === MODEL)
      if (!has) throw new Error(`模型列表中未找到 ${MODEL}`)
      return `共 ${data.data.length} 个模型，${MODEL} 可用`
    },
  },
]

console.log(`StepFun LLM 全量测试`)
console.log(`端点: ${ENDPOINT}`)
console.log(`模型: ${MODEL}\n`)

let passed = 0
let failed = 0

for (const t of tests) {
  process.stdout.write(`${t.name} ... `)
  const start = Date.now()
  try {
    const result = await t.run()
    console.log(`✓ (${Date.now() - start}ms)`)
    console.log(`   ${result}\n`)
    passed++
  } catch (e) {
    console.log(`✗ (${Date.now() - start}ms)`)
    console.log(`   ${e.message}\n`)
    failed++
  }
}

console.log(`结果: ${passed} 通过, ${failed} 失败, 共 ${tests.length} 项`)
process.exit(failed > 0 ? 1 : 0)
