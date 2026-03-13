# TokenCost MCP Server

An MCP (Model Context Protocol) server that provides real-time LLM token pricing data for **60+ AI models** across 15 providers.

Query, compare, and estimate costs for models from OpenAI, Anthropic, Google, Meta, xAI, Mistral, DeepSeek, and more — directly from your AI assistant.

Built by [TokenCost](https://tokencost.app) — the free LLM token cost calculator.

<a href="https://glama.ai/mcp/servers/ankit-aglawe/tokencost-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/ankit-aglawe/tokencost-mcp-server/badge" alt="tokencost-mcp-server MCP server" />
</a>

## Tools

| Tool | Description |
|------|-------------|
| `tokencost_get_model_pricing` | Get pricing for a specific model |
| `tokencost_compare_models` | Side-by-side pricing comparison |
| `tokencost_estimate_cost` | Calculate cost for given token counts |
| `tokencost_find_cheapest` | Find cheapest models with filters |
| `tokencost_list_models` | List all available models |
| `tokencost_list_providers` | List all providers with pricing ranges |

## Quick Start

### Claude Desktop / Cursor / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "tokencost": {
      "command": "npx",
      "args": ["-y", "tokencost-mcp-server"]
    }
  }
}
```

### From Source

```bash
git clone https://github.com/ankit-aglawe/tokencost-mcp-server
cd tokencost-mcp-server
npm install
npm run build
npm start
```

## Example Usage

**"How much would it cost to process 1M input tokens with GPT-5?"**

→ Uses `tokencost_estimate_cost` with `model="gpt-5"`, `input_tokens=1000000`, `output_tokens=0`

**"Compare Claude Sonnet 4.6 vs GPT-5 vs Gemini 3 Pro pricing"**

→ Uses `tokencost_compare_models` with `["claude-sonnet-4.6", "gpt-5", "gemini-3-pro"]`

**"What's the cheapest model with at least 200K context?"**

→ Uses `tokencost_find_cheapest` with `min_context=200000`

## Supported Providers

OpenAI, Anthropic, Google, xAI, Meta, Mistral, DeepSeek, Alibaba (Qwen), Amazon (Nova), NVIDIA, Cohere, Perplexity, Moonshot (Kimi), Zhipu (GLM), MiniMax

## Pricing Data

Pricing is kept accurate and up to date by the [TokenCost](https://tokencost.app) team. We track official provider announcements and update pricing as soon as changes are published — new models, price cuts, and deprecations are reflected within days.

If you notice outdated pricing or a missing model, [open an issue](https://github.com/ankit-aglawe/tokencost-mcp-server/issues) and we'll get it updated.

## License

MIT