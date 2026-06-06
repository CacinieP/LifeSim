---
title: LifeSim - 人生模拟器
emoji: 🎯
colorFrom: indigo
colorTo: blue
sdk: docker
app_file: app.py
app_port: 7860
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

本仓库使用 Docker 模式部署到魔搭创空间：

- `docker.yaml`：指定 `Dockerfile` 构建入口
- `Dockerfile`：构建前端静态资源并通过 FastAPI 在 7860 端口提供服务
- `app.py`：静态资源与 SPA 路由服务

推送代码后，在创空间页面点击「重启空间展示」即可生效。
