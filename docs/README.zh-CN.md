# AgentPack

[English](../README.md) | [简体中文](README.zh-CN.md)

AgentPack 是一套面向 AI Agent 的可复用指令、技能、参考资料和可选工具连接。它为 Agent 提供一致的工作方式，帮助你澄清需求、开发软件、设计界面和评审结果。

## 可以做什么

| 组件 | 用途 |
|---|---|
| [全局指令](../instructions/AGENTS.md) | 用共同的工作原则指导工程决策、沟通和任务交付 |
| [Dev 套件](../skills/dev/SKILL.md) | 开发功能、修复问题、清理已有内容，分离开发与测试角色，并管理分支和提交 |
| [Design 套件](../skills/design/SKILL.md) | 将模糊想法转化为明确需求，规划和构建界面，评审可用性与视觉质量 |
| [上游技能](#上游技能) | 按需增加界面设计、动效、研究、图表和浏览器自动化等专业技能 |
| [AnySearch MCP](../mcp/anysearch.md) | 为 Agent 提供可选的网络搜索连接 |

需要实现界面时，同时选择 Design 和 Dev。还可选装 **Answer me with HTML** 套件，通过交互页面澄清需求：在页面中回答，再将 Reply 复制回聊天。

## 开始使用

将以下请求发给具有 Git 和文件访问能力的 Agent：

```text
从 master 分支安装 https://github.com/boman-ng/agentpack。
针对我希望配置的 Agent 工具，按照 INSTALL.md 操作。
协助我选择指令、完整技能套件和可选 MCP 连接。
列出将替换或移除的内容；在我确认范围后，
备份、安装并验证所选组件。
```

安装作用于用户级配置。从下方仓库中选择完整套件。[安装指南](../INSTALL.md)列出了固定版本、套件成员和运行条件，并说明安装、更新和恢复方法。

更新时，让 Agent 根据你的安装记录，按照同一指南更新到最新 `master`。需要长期保留的定制应放在自己的仓库副本或 fork 中，以便更新时重新应用。

## 引用的仓库

### 上游技能

每行是一个可选套件。按需选择能力，安装时包含该套件的[全部成员](../INSTALL.md#upstream-members)。

| 仓库 | 用途 | License |
|---|---|---|
| [ARS — Imbad0202/academic-research-skills-codex](https://github.com/Imbad0202/academic-research-skills-codex) | 调研、文献综述、实验规划、学术写作与稿件评审 | CC BY-NC 4.0 |
| [Archify — tt-a1i/archify](https://github.com/tt-a1i/archify) | 生成独立 HTML 架构图、流程图和数据流图，支持交互浏览 | MIT |
| [Lieflat Charts — larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | 基于模板生成 HTML 数据图表和报告 | [PolyForm Noncommercial 1.0.0](../third_party/licenses/lieflat-charts/LICENSE) |
| [Answer me with HTML — QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | 生成交互式解释与澄清页面，将页面中的回复复制回聊天 | MIT |
| [Impeccable — pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 界面设计、实现、无障碍与细节优化 | Apache-2.0 |
| [Browser — vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | 浏览器交互、内容提取、测试，以及受支持的 Electron 应用自动化 | Apache-2.0 |
| [Emil — emilkowalski/skills](https://github.com/emilkowalski/skills) | Web 与原生界面的设计工程和动画 | MIT |
| [GSAP — greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 动画、时间线、滚动交互、框架集成与性能优化 | 技能采用 MIT；运行库条款独立 |
| [Motion — motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | Motion 与 CSS 动画指导，以及可选的连接工具 | 上游声明为 MIT |
| [LottieFiles — LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | 跨动画系统的动效方向、时序、缓动与编排 | MIT |

### 工具连接

| 仓库 | 用途 | License |
|---|---|---|
| [AnySearch — anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | 通过 [AnySearch MCP 连接](../mcp/anysearch.md)提供可选的网络搜索 | Apache-2.0 |

### 参考资料

这些资源用于阅读和参考，不作为技能安装。

| 仓库 | 用途 | License |
|---|---|---|
| [System Design 101 — ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 用图解介绍系统架构、数据库、分布式系统与工程取舍 | [CC BY-NC-ND 4.0](https://github.com/ByteByteGoHq/system-design-101/blob/main/LICENSE.md) |

## 许可

AgentPack 的原创内容采用 [MIT 许可](../LICENSE)。上游内容及其附带的依赖保留[各自的许可和声明](../THIRD_PARTY_LICENSES.md)。非商业许可限制商业使用。
