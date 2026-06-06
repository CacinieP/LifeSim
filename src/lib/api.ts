import type { ApiConfig, ChatMessage, DecisionContext, ScenarioData } from "@/types"

const PROVIDER_ENDPOINTS: Record<string, string> = {
  deepseek: "https://api.deepseek.com/v1",
  openai: "https://api.openai.com/v1",
  moonshot: "https://api.moonshot.cn/v1",
  zhipu: "https://open.bigmodel.cn/api/paas/v4",
  wanjie: "https://api.wanjie.com/v1",
  stepfun: "https://api.stepfun.com/v1",
}

export function getApiBaseUrl(config: ApiConfig): string {
  if (config.provider === "custom") {
    return config.customEndpoint.trim().replace(/\/$/, "")
  }
  return PROVIDER_ENDPOINTS[config.provider] || ""
}

export function buildSystemPrompt(decisionContext: DecisionContext, profileContent: string): string {
  const parts = [
    "你是 LifeSim 人生模拟器的 AI 助手「未来」，帮助用户理清重大人生决策。",
    "用温暖、耐心的语气提问，每次回复简洁（2-4 句话），一次只问一个关键问题。",
  ]
  if (decisionContext.decisionType) {
    parts.push(`用户决策类型：${decisionContext.decisionType}`)
  }
  if (decisionContext.decisionOptions.trim()) {
    parts.push(`待选方案：${decisionContext.decisionOptions}`)
  }
  if (decisionContext.decisionPriority.trim()) {
    parts.push(`核心诉求：${decisionContext.decisionPriority}`)
  }
  if (profileContent.trim()) {
    parts.push(`用户个人资料：\n${profileContent.slice(0, 2000)}`)
  }
  return parts.join("\n")
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
      reasoning?: string
    }
  }>
  error?: { message?: string }
}

export async function chatCompletion(
  apiConfig: ApiConfig,
  messages: ChatMessage[],
  systemPrompt: string,
  maxTokens = 1024,
): Promise<string> {
  const baseUrl = getApiBaseUrl(apiConfig)
  if (!baseUrl) throw new Error("请配置 API 端点")
  if (!apiConfig.apiKey.trim()) throw new Error("请配置 API Key")
  if (!apiConfig.modelName.trim()) throw new Error("请配置模型名称")

  const body: Record<string, unknown> = {
    model: apiConfig.modelName,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: maxTokens,
  }

  if (apiConfig.provider === "stepfun" && apiConfig.modelName.includes("3.7")) {
    body.reasoning_effort = "low"
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as ChatCompletionResponse
  if (!response.ok) {
    throw new Error(data.error?.message || `API 请求失败 (${response.status})`)
  }

  const message = data.choices?.[0]?.message
  const content = message?.content?.trim()
  const reasoning = message?.reasoning?.trim()
  return content || reasoning || "（模型未返回内容）"
}

function getImageApiKey(apiConfig: ApiConfig): string {
  return apiConfig.imageApiKey.trim() || apiConfig.apiKey.trim()
}

function getImageEndpoint(apiConfig: ApiConfig): string {
  if (apiConfig.imageProvider === "stepfun") return "https://api.stepfun.com/v1"
  return getApiBaseUrl(apiConfig)
}

interface ImageGenerationResponse {
  data?: Array<{ url?: string; b64_json?: string }>
  error?: { message?: string }
}

export async function generateImage(apiConfig: ApiConfig, prompt: string): Promise<string> {
  if (apiConfig.imageProvider === "none") throw new Error("未启用图像生成")

  const apiKey = getImageApiKey(apiConfig)
  const baseUrl = getImageEndpoint(apiConfig)
  if (!apiKey) throw new Error("请配置图像生成 API Key")
  if (!baseUrl) throw new Error("请配置图像生成端点")
  if (!apiConfig.imageModelName.trim()) throw new Error("请配置图像生成模型")

  const model = apiConfig.imageModelName.trim()
  const body: Record<string, unknown> = {
    model,
    prompt: prompt.slice(0, 500),
    response_format: "url",
    size: "1024x1024",
    n: 1,
  }

  if (model === "step-image-edit-2") {
    body.cfg_scale = 1.0
    body.steps = 8
  } else {
    body.cfg_scale = 7.5
    body.steps = 50
  }

  const response = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as ImageGenerationResponse
  if (!response.ok) {
    throw new Error(data.error?.message || `图像生成失败 (${response.status})`)
  }

  const item = data.data?.[0]
  if (item?.url) return item.url
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`
  throw new Error("图像生成未返回结果")
}

export async function testApiConnection(apiConfig: ApiConfig): Promise<string> {
  return chatCompletion(
    apiConfig,
    [{ role: "user", content: "请只回复：连接成功" }],
    "你是一个测试助手，请简短回复。",
    128,
  )
}

function parseJsonResponse<T>(raw: string): T {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  let jsonText = fenced ? fenced[1].trim() : trimmed
  const start = jsonText.indexOf("{")
  const end = jsonText.lastIndexOf("}")
  if (start !== -1 && end > start) jsonText = jsonText.slice(start, end + 1)
  return JSON.parse(jsonText) as T
}

export async function generateScenarioData(
  apiConfig: ApiConfig,
  chatHistory: ChatMessage[],
  decisionContext: DecisionContext,
  profileContent: string,
): Promise<ScenarioData> {
  const contextLines = [
    decisionContext.decisionType ? `决策类型：${decisionContext.decisionType}` : "",
    decisionContext.decisionOptions.trim() ? `待选方案：${decisionContext.decisionOptions}` : "",
    decisionContext.decisionPriority.trim() ? `核心诉求：${decisionContext.decisionPriority}` : "",
    profileContent.trim() ? `个人资料：\n${profileContent.slice(0, 2000)}` : "",
  ].filter(Boolean)

  const systemPrompt = [
    "你是 LifeSim 人生模拟器的数据生成器。",
    "根据对话与背景信息，生成 3 条不同的人生路径推演数据。",
    "只输出合法 JSON，不要使用 markdown 代码块。",
    "JSON 结构必须包含：userSummary, researchSummary, branches(3条), recommendation, disclaimer。",
    "每条 branch 需含 id(1-3), name, icon(单个emoji), shortDesc, stages(每条约3个阶段), bestCase, worstCase, mostLikely, pros, cons, scores(difficulty/satisfaction/risk/growth 均为1-5整数)。",
    "每个 stage 需含 stage, period, scene, actionItems, milestone, choices(每阶段3个，含 text/personality/strategy)。",
    "recommendation 需含 primaryId, reasoning, tips, actionChecklist, pitfalls。",
  ].join("\n")

  const transcript = chatHistory.map((m) => `${m.role === "user" ? "用户" : "未来"}：${m.content}`).join("\n")
  const userContent = [
    contextLines.length ? `背景信息：\n${contextLines.join("\n")}` : "",
    `对话记录：\n${transcript}`,
    "请生成完整推演 JSON。",
  ].filter(Boolean).join("\n\n")

  const raw = await chatCompletion(apiConfig, [{ role: "user", content: userContent }], systemPrompt, 4096)
  return parseJsonResponse<ScenarioData>(raw)
}
