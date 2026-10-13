# Skills

[English](../README.md) | **简体中文**

Skills 为 AI Agent 提供**通用指令**和 **Dev**、**Design** 技能套件。本仓库还整理了可选的外部技能、MCP 服务和阅读资料。

[本仓库组件](#本仓库组件) · [开始使用](#开始使用) · [外部目录](#外部技能与-mcp-服务) · [参考资料](#参考资料)

<a id="本仓库组件"></a>

## 📦 本仓库组件

| 领域 | 组件 | 用途 |
|---|---|---|
| 通用 | [全局指令](../instructions/AGENTS.md) | 指导工程决策、沟通和任务交付的工作原则 |
| 软件工程 | [Dev 套件](../skills/dev/SKILL.md) | 开发功能、修复问题、维护已有内容、独立验证改动、管理 Git 交付，并按要求起草或提交项目 Issue |
| 界面设计 | [Design 套件](../skills/design/SKILL.md) | 澄清需求、规划和构建界面、评审可用性与视觉质量 |

- **界面实现：** 同时选择 Design 和 Dev。[外部技能与 MCP 服务](#外部技能与-mcp-服务)提供其他能力。
- **可选需求澄清：** Answer me with HTML 可通过交互页面帮助澄清需求：在页面中回答，再将 Reply 复制回聊天。

<a id="开始使用"></a>

## 🚀 开始使用

### 安装

将以下请求发给具有 Git 和文件访问能力的 Agent：

```text
从默认分支的最新内容安装 https://github.com/boman-ng/skills。
针对我希望配置的 Agent 工具，按照 INSTALL.md 操作。
协助我选择指令、完整技能套件和可选 MCP 服务。
列出将替换或移除的内容；在我确认范围后，
备份、安装并验证所选组件。
```

按照[安装说明](../INSTALL.md)，使用目标 Agent 支持的安装方式，将所选组件安装到用户级配置中。来源仓库默认使用默认分支的最新内容，也可明确指定版本。

### 更新

更新时，让 Agent 更新你已选择的组件。需要长期保留的定制应放在自己的仓库副本或 fork 中，以便更新时重新应用。

<a id="外部技能与-mcp-服务"></a>

## 🌐 外部技能与 MCP 服务

以下项目需另行安装。按领域选择，并遵循各项目当前的安装说明。安装技能套件时，保留完整套件及其必需的资源、许可和声明。

| 领域 | 仓库 | 类型 | 用途 | 许可 |
|---|---|---|---|---|
| 界面设计 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 技能套件 | 界面设计、实现、无障碍与细节优化 | Apache-2.0 |
| 界面设计 | [emilkowalski/skills](https://github.com/emilkowalski/skills) | 技能套件 | Web 与原生界面的设计工程和动画 | MIT |
| 动画 | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 技能套件 | GSAP 动画、时间线、滚动交互、框架集成与性能优化 | 技能采用 MIT；运行库条款独立 |
| 动画 | [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | 技能与 MCP | Motion 与 CSS 动画指导，以及免费 Motion MCP；不含 `motion-plus` | MIT（项目声明） |
| 动画 | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | 技能 | 跨动画系统的动效方向、时序、缓动与编排 | MIT |
| 学术研究 | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | 技能套件 | Academic Research Skills（ARS）：文献检索与综述、研究规划、学术写作和稿件评审 | [CC BY-NC 4.0](https://github.com/Imbad0202/academic-research-skills/blob/main/LICENSE) |
| 图表与可视化 | [tt-a1i/archify](https://github.com/tt-a1i/archify) | 技能 | 生成独立 HTML 架构图、流程图和数据流图，支持交互浏览 | MIT |
| 图表与可视化 | [larashero3-dotcom/lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) | 技能 | 基于模板生成 HTML 数据图表和报告 | [PolyForm Noncommercial 1.0.0](https://github.com/larashero3-dotcom/lieflat-charts/blob/main/LICENSE) |
| 图表与可视化 | [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | 技能套件 | 生成交互式解释与澄清页面，将页面中的回复复制回聊天 | MIT |
| 浏览器自动化 | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | 技能 | 浏览器交互、内容提取、测试，以及受支持的 Electron 应用自动化 | Apache-2.0 |
| 网络搜索 | [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server) | MCP | 通过 MCP 提供网络搜索 | Apache-2.0 |

<a id="参考资料"></a>

## 📚 参考资料

这些资源用于阅读和参考，不作为技能安装。

| 仓库 | 用途 | 许可 |
|---|---|---|
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | System Design 101：用图解介绍系统架构、数据库、分布式系统与工程取舍 | [CC BY-NC-ND 4.0](https://github.com/ByteByteGoHq/system-design-101/blob/main/LICENSE.md) |
| [mattpocock/skills](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336) | 此参考快照为 Skills 的模块设计、领域语言、增量反馈、决策依赖和指令组织提供参考 | [MIT](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/LICENSE) |

<a id="反馈"></a>

## 💬 反馈

- **Skills：** 报告问题或提出改进建议，请阅读 [ISSUE.md](../ISSUE.md)，无需安装 Skills。
- **其他项目：** 在开发其他项目时发现的问题，可要求使用 [dev-issue](../skills/dev-issue/SKILL.md)，并说明目标项目。

<a id="许可"></a>

## 📜 许可

本仓库的原创内容采用 [MIT 许可](../LICENSE)。外部项目保留各自的许可和声明。
