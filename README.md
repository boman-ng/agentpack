# AgentPack

[English](README.md) | [简体中文](docs/README.zh-CN.md)

AgentPack is a reusable collection of instructions, skills, and optional tool connections for AI agents. It gives your agent consistent workflows for clarifying requirements, developing software, designing interfaces, and reviewing results.

## What you can do

| Component | Use it to |
|---|---|
| [Global instructions](instructions/AGENTS.md) | Guide engineering decisions, communication, and task completion with shared working principles |
| [Dev suite](skills/dev/SKILL.md) | Develop features, fix bugs, simplify existing work, separate development from testing, and manage branches and commits |
| [Design suite](skills/design/SKILL.md) | Turn rough ideas into clear requirements, shape and build interfaces, and review usability and visual quality |
| [Upstream skills](SOURCES.md) | Add specialist skills for interface design, animation, research, diagrams, and browser automation |
| [AnySearch MCP](mcp/anysearch.md) | Give your agent an optional connection to web search |

For interface implementation, select both Design and Dev. Add the optional **Answer me with HTML** suite for interactive clarification pages: answer on the page, then copy its Reply into chat.

## Get started

Paste this request into an agent with Git and filesystem access:

```text
Install https://github.com/boman-ng/agentpack from its master branch.
Follow INSTALL.md for the agent tool I want to configure.
Help me choose instructions, complete skill suites, and optional MCP connections.
Show what will be replaced or removed. After I confirm the scope,
back up, install, and verify the selected components.
```

Installation applies to your user-level setup. Choose complete suites from the [catalog](SOURCES.md), which lists their contents, prerequisites, and licenses. The [installation guide](INSTALL.md) covers setup, updates, and recovery.

To update, ask your agent to follow the same guide using your installation record and the latest `master`. Keep lasting customizations in your checkout or fork so they can be reapplied during updates.

## License

AgentPack's original material is licensed under [MIT](LICENSE). Upstream content retains its [own licenses and notices](THIRD_PARTY_LICENSES.md).
