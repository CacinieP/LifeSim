export const decisionTypeOptions = [
  { value: "", label: "请选择决策类型" },
  { value: "gaokao", label: "高考填志愿" },
  { value: "graduate", label: "考研保研择校" },
  { value: "job", label: "求职选 offer" },
  { value: "career", label: "职业转型" },
  { value: "city", label: "城市选择" },
  { value: "other", label: "其他" },
]

export const providerOptions = [
  { value: "stepfun", label: "阶跃星辰 (StepFun)" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "openai", label: "OpenAI" },
  { value: "moonshot", label: "月之暗面" },
  { value: "zhipu", label: "智谱 AI" },
  { value: "wanjie", label: "万界方舟" },
  { value: "custom", label: "自定义" },
]

export const defaultModels: Record<string, string> = {
  stepfun: "step-3.7-flash",
  deepseek: "deepseek-chat",
  openai: "gpt-4o-mini",
  moonshot: "moonshot-v1-8k",
  zhipu: "glm-4",
  wanjie: "deepseek-chat",
  custom: "",
}

export const defaultEndpoints: Record<string, string> = {
  stepfun: "https://api.stepfun.com/v1",
}
