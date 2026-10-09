# AgentPack

[English](../README.md) | [简体中文](README.zh-CN.md)

AgentPack 是一套面向 AI Agent 的可复用指令、技能和可选工具连接。它为 Agent 提供一致的工作方式，帮助你澄清需求、开发软件、设计界面和评审结果。

## 可以做什么

| 组件 | 用途 |
|---|---|
| [全局指令](../instructions/AGENTS.md) | 用共同的工作原则指导工程决策、沟通和任务交付 |
| [Dev 套件](../skills/dev/SKILL.md) | 开发功能、修复问题、清理已有内容，分离开发与测试角色，并管理分支和提交 |
| [Design 套件](../skills/design/SKILL.md) | 将模糊想法转化为明确需求，规划和构建界面，评审可用性与视觉质量 |
| [上游技能](../SOURCES.md) | 按需增加界面设计、动效、研究、图表和浏览器自动化等专业技能 |
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

安装作用于用户级配置。[组件目录](../SOURCES.md)列出了各套件的内容、运行条件和许可，选择时以完整套件为单位。[安装指南](../INSTALL.md)说明了安装、更新和恢复方法。

更新时，让 Agent 根据你的安装记录，按照同一指南更新到最新 `master`。需要长期保留的定制应放在自己的仓库副本或 fork 中，以便更新时重新应用。

## 许可

AgentPack 的原创内容采用 [MIT 许可](../LICENSE)。上游内容保留[各自的许可和声明](../THIRD_PARTY_LICENSES.md)。
