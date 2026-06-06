---
title: LifeSim - 人生模拟器
emoji: 🎯
colorFrom: indigo
colorTo: blue
sdk: docker
app_file: start.sh
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

使用 **Docker** 模式（见 [Docker 创空间文档](https://modelscope.cn/docs/studios/docker) 与 [ModelScope-Studio 技能](https://modelscope.cn/skills/modelscope/ModelScope-Studio)）：

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 多阶段构建：Node 编译前端 + Python/FastAPI 在 **7860** 端口托管 |
| `docker.yaml` | 指定 Docker 构建入口 |
| `app.py` / `start.sh` | 容器启动命令 |

推送代码后必须 **触发部署**（设置里点「部署」，或调用 deploy API），然后在 **构建日志** 中确认 `docker build` 成功。

```powershell
.\scripts\deploy-modelscope.ps1 -Token <你的魔搭Token>
```

> Docker 模式需完成魔搭平台阿里云账号绑定与实名认证。首次构建约 3–5 分钟。
