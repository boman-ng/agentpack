# AnySearch MCP

Optional remote search through the target host's native MCP support. These are connection settings, not a client configuration file.

| Setting | Value |
|---|---|
| Server name | `anysearch` |
| Remote endpoint | `https://api.anysearch.com/mcp` |
| HTTP header | `X-Anysearch-Client: mcp/1.0.0` |
| Authentication | Anonymous; no account or API key is configured |

Use [INSTALL.md](../INSTALL.md) to discover the host's user MCP configuration and map these values into its supported format. Preserve the header value; it is not a credential. If the host cannot connect with these settings, report the limitation rather than installing a bridge or changing authentication.

Queries and requested URLs go to an external service. Availability and anonymous rate limits depend on that service; a valid configuration does not establish connectivity.

The configuration reference is [anysearch-ai/anysearch-mcp-server](https://github.com/anysearch-ai/anysearch-mcp-server/tree/f4ca4d4941e4c122be6522c1afc76012f1669654), commit `f4ca4d4941e4c122be6522c1afc76012f1669654`, Apache-2.0. This records the source of the settings, not the remotely deployed service version. See [third-party attribution](../THIRD_PARTY_LICENSES.md) for preserved license and notice texts.
