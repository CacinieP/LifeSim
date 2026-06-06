---
title: LifeSim - 人生模拟器
emoji: 🎯
colorFrom: indigo
colorTo: blue
sdk: static
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

按魔搭官方 [ModelScope-Studio 技能](https://modelscope.cn/skills/modelscope/ModelScope-Studio) 使用 **Static** 模式：

| 要点 | 说明 |
|------|------|
| 无云端构建 | Static **不会**在平台执行 `npm run build`，通常也**没有构建日志** |
| 本地构建 | 必须把 `dist/` 提交进创空间 Git 仓库 |
| 推送后部署 | 代码 push 后需调用 **部署/上线**（`deployStudio`），仅刷新页面不够 |
| 资源路径 | 构建时设 `MODELSCOPE=true`，生成相对路径 `./assets/...`，避免白屏 |

```bash
npm ci
# Windows: set MODELSCOPE=true
# Linux/macOS: export MODELSCOPE=true
npm run build
git add -f dist README.md
git commit -m "chore: update dist for ModelScope"
git push modelscope master
# 然后在创空间设置里点「部署」或「上线创空间」
```

也可运行 `.\scripts\deploy-modelscope.ps1 -Token <你的Token>`（会 push 并尝试触发部署 API）。

> 若希望平台自动 `npm build`，可改用 `sdk: docker`（需阿里云实名认证），见[Docker 创空间文档](https://modelscope.cn/docs/studios/docker)。
