---
title: LifeSim - 人生模拟器
emoji: 🎯
colorFrom: indigo
colorTo: blue
sdk: static
app_build_command: npm ci && MODELSCOPE=true npm run build
app_file: dist/index.html
pinned: false
license: apache-2.0
short_description: AI 驱动的重大人生决策辅助工具，支持对话推演与场景可视化
tags:
  - life-simulation
  - decision-making
  - llm
  - react
---

# LifeSim - 人生模拟器

AI 驱动的重大人生决策辅助工具。通过与大模型对话，梳理决策背景，并生成多分支人生推演与场景可视化。

## 功能

- 配置 LLM 提供商与模型（默认阶跃星辰 StepFun）
- 对话式收集决策背景与约束
- 自动生成多场景推演数据
- 可选接入阶跃星辰生图，为场景生成配图

## 本地开发

```bash
npm install
npm run dev
```

## 创空间部署

本仓库使用 **Static 静态模式**部署到魔搭创空间（见 [快速创建文档](https://www.modelscope.cn/docs/studios/quick-create)）：

- README 顶部 YAML：`sdk: static` + `app_build_command` + `app_file`
- 推送后平台会自动执行 `npm ci && MODELSCOPE=true npm run build`，并托管 `dist/index.html`
- 仓库内已预置 `dist/` 作为构建失败时的兜底

推送代码后，在创空间页面点击 **「重启空间展示」** 或 **「部署」**，等待构建日志出现 `npm run build` 完成后再访问。

若创空间设置里 SDK 类型仍为 Docker，请在 **设置** 中改为与 README 一致的 **Static**，或重新创建创空间并选择静态网页类型。
