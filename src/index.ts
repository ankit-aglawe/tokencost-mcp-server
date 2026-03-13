#!/usr/bin/env node
/**
 * TokenCost MCP Server
 *
 * Provides LLM token pricing data for 60+ AI models.
 * Query, compare, and estimate costs across OpenAI, Anthropic, Google, Meta, and more.
 *
 * https://tokencost.app
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { models, providers, findModel, findModels, type ModelPricing } from "./pricing.js";

const server = new McpServer({
  name: "tokencost-mcp-server",
  version: "1.0.0",
});

// ── Helpers ──────────────────────────────────────────────

function formatUSD(amount: number): string {
  if (amount < 0.0001) return "< $0.0001";
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  if (amount < 1) return `$${amount.toFixed(3)}`;
  return `$${amount.toFixed(2)}`;
}

function formatContext(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  return `${(n / 1000).toFixed(0)}K`;
}

function modelToJSON(m: ModelPricing) {
  return {
    id: m.id,
    name: m.name,
    provider: m.provider,
    input_per_1m_tokens: m.inputPer1M,
    output_per_1m_tokens: m.outputPer1M,
    context_window: m.contextWindow,
    max_output: m.maxOutput,
    ...(m.notes ? { notes: m.notes } : {}),
  };
}

function modelToMarkdown(m: ModelPricing): string {
  const lines = [
    `## ${m.name} (${m.provider})`,
    `- **Input**: $${m.inputPer1M}/1M tokens`,
    `- **Output**: $${m.outputPer1M}/1M tokens`,
    `- **Context**: ${formatContext(m.contextWindow)}`,
    `- **Max Output**: ${formatContext(m.maxOutput)}`,
  ];
  if (m.notes) lines.push(`- **Notes**: ${m.notes}`);
  lines.push(`- **More info**: https://tokencost.app/models/${m.id}`);
  return lines.join("\n");
}

// ── Tools ────────────────────────────────────────────────

server.registerTool(
  "tokencost_get_model_pricing",
  {
    title: "Get Model Pricing",
    description: `Get pricing details for a specific LLM model.

Args:
  - model (string): Model ID or name to look up (e.g., "gpt-5", "claude-sonnet-4.6", "gemini-3-pro")

Returns:
  Model pricing details including input/output costs per 1M tokens, context window, and max output.
  Returns an error message if the model is not found, with suggestions for similar models.

Examples:
  - "gpt-5" → GPT-5 pricing from OpenAI
  - "claude-opus-4.6" → Claude Opus 4.6 pricing from Anthropic
  - "gemini" → First matching Gemini model`,
    inputSchema: {
      model: z.string().min(1).describe("Model ID or name (e.g., 'gpt-5', 'claude-sonnet-4.6')"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ model }) => {
    const found = findModel(model);
    if (!found) {
      const similar = findModels(model);
      const suggestion = similar.length > 0
        ? `\n\nDid you mean: ${similar.slice(0, 5).map(m => m.id).join(", ")}?`
        : `\n\nAvailable providers: ${providers.join(", ")}. Use tokencost_list_models to see all models.`;
      return {
        content: [{ type: "text", text: `Model "${model}" not found.${suggestion}` }],
      };
    }
    return {
      content: [{ type: "text", text: modelToMarkdown(found) }],
      structuredContent: modelToJSON(found),
    };
  }
);

server.registerTool(
  "tokencost_compare_models",
  {
    title: "Compare Model Pricing",
    description: `Compare pricing across multiple LLM models side by side.

Args:
  - models (string[]): Array of model IDs or names to compare (2-10 models)

Returns:
  Side-by-side comparison table with input/output costs, context windows, and relative cost differences.

Examples:
  - ["gpt-5", "claude-sonnet-4.6"] → Compare OpenAI vs Anthropic pricing
  - ["gpt-5-mini", "gemini-3-flash", "claude-haiku-4.5"] → Compare budget models`,
    inputSchema: {
      models: z.array(z.string().min(1))
        .min(2, "Provide at least 2 models to compare")
        .max(10, "Maximum 10 models per comparison")
        .describe("Model IDs or names to compare"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ models: modelQueries }) => {
    const results: { query: string; model: ModelPricing | undefined }[] = modelQueries.map(q => ({
      query: q,
      model: findModel(q),
    }));

    const notFound = results.filter(r => !r.model);
    const found = results.filter(r => r.model).map(r => r.model!);

    if (found.length < 2) {
      return {
        content: [{
          type: "text",
          text: `Need at least 2 valid models to compare. Not found: ${notFound.map(r => r.query).join(", ")}. Use tokencost_list_models to see available models.`,
        }],
      };
    }

    const cheapestInput = Math.min(...found.map(m => m.inputPer1M));
    const cheapestOutput = Math.min(...found.map(m => m.outputPer1M));

    const lines = ["# Model Pricing Comparison", ""];
    lines.push("| Model | Provider | Input/1M | Output/1M | Context | Max Output |");
    lines.push("|-------|----------|----------|-----------|---------|------------|");
    for (const m of found) {
      const inputMult = m.inputPer1M / cheapestInput;
      const outputMult = m.outputPer1M / cheapestOutput;
      const inputNote = inputMult > 1 ? ` (${inputMult.toFixed(1)}x)` : " (cheapest)";
      const outputNote = outputMult > 1 ? ` (${outputMult.toFixed(1)}x)` : " (cheapest)";
      lines.push(`| ${m.name} | ${m.provider} | $${m.inputPer1M}${inputNote} | $${m.outputPer1M}${outputNote} | ${formatContext(m.contextWindow)} | ${formatContext(m.maxOutput)} |`);
    }

    if (notFound.length > 0) {
      lines.push("", `*Models not found: ${notFound.map(r => r.query).join(", ")}*`);
    }
    lines.push("", `*Data from [TokenCost](https://tokencost.app)*`);

    const structured = {
      models: found.map(modelToJSON),
      cheapest_input: found.reduce((a, b) => a.inputPer1M < b.inputPer1M ? a : b).id,
      cheapest_output: found.reduce((a, b) => a.outputPer1M < b.outputPer1M ? a : b).id,
      not_found: notFound.map(r => r.query),
    };

    return {
      content: [{ type: "text", text: lines.join("\n") }],
      structuredContent: structured,
    };
  }
);

server.registerTool(
  "tokencost_estimate_cost",
  {
    title: "Estimate Token Cost",
    description: `Calculate the cost for a specific number of input and output tokens with a given model.

Args:
  - model (string): Model ID or name
  - input_tokens (number): Number of input tokens (0 to 100B)
  - output_tokens (number): Number of output tokens (0 to 100B)

Returns:
  Cost breakdown with input cost, output cost, and total cost in USD.

Examples:
  - model="gpt-5", input_tokens=1000, output_tokens=500 → Cost for a typical API call
  - model="claude-sonnet-4.6", input_tokens=100000, output_tokens=4000 → Cost for a long context call`,
    inputSchema: {
      model: z.string().min(1).describe("Model ID or name"),
      input_tokens: z.number().int().min(0).max(100_000_000_000).describe("Number of input tokens"),
      output_tokens: z.number().int().min(0).max(100_000_000_000).describe("Number of output tokens"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ model, input_tokens, output_tokens }) => {
    const found = findModel(model);
    if (!found) {
      return {
        content: [{ type: "text", text: `Model "${model}" not found. Use tokencost_list_models to see available models.` }],
      };
    }

    const inputCost = (input_tokens / 1_000_000) * found.inputPer1M;
    const outputCost = (output_tokens / 1_000_000) * found.outputPer1M;
    const totalCost = inputCost + outputCost;

    const text = [
      `# Cost Estimate: ${found.name}`,
      "",
      `| | Tokens | Cost |`,
      `|---|--------|------|`,
      `| Input | ${input_tokens.toLocaleString()} | ${formatUSD(inputCost)} |`,
      `| Output | ${output_tokens.toLocaleString()} | ${formatUSD(outputCost)} |`,
      `| **Total** | **${(input_tokens + output_tokens).toLocaleString()}** | **${formatUSD(totalCost)}** |`,
      "",
      `*Rates: $${found.inputPer1M}/1M input, $${found.outputPer1M}/1M output*`,
      `*Calculate more at [TokenCost](https://tokencost.app)*`,
    ].join("\n");

    const structured = {
      model: found.id,
      model_name: found.name,
      provider: found.provider,
      input_tokens,
      output_tokens,
      input_cost_usd: inputCost,
      output_cost_usd: outputCost,
      total_cost_usd: totalCost,
      rates: {
        input_per_1m: found.inputPer1M,
        output_per_1m: found.outputPer1M,
      },
    };

    return {
      content: [{ type: "text", text }],
      structuredContent: structured,
    };
  }
);

server.registerTool(
  "tokencost_find_cheapest",
  {
    title: "Find Cheapest Models",
    description: `Find the cheapest LLM models, optionally filtered by provider or minimum context window.

Args:
  - provider (string, optional): Filter by provider (e.g., "OpenAI", "Anthropic", "Google")
  - min_context (number, optional): Minimum context window size in tokens
  - sort_by (string, optional): Sort by "input", "output", or "combined" cost (default: "combined")
  - limit (number, optional): Number of results to return (default: 10, max: 30)

Returns:
  Ranked list of cheapest models with pricing details.

Examples:
  - {} → Top 10 cheapest models overall
  - { provider: "OpenAI" } → Cheapest OpenAI models
  - { min_context: 200000, sort_by: "input" } → Cheapest 200K+ context models by input price`,
    inputSchema: {
      provider: z.string().optional().describe("Filter by provider name (e.g., 'OpenAI', 'Anthropic')"),
      min_context: z.number().int().min(0).optional().describe("Minimum context window size in tokens"),
      sort_by: z.enum(["input", "output", "combined"]).default("combined").describe("Sort by input, output, or combined cost"),
      limit: z.number().int().min(1).max(30).default(10).describe("Number of results to return"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ provider, min_context, sort_by, limit }) => {
    let filtered = [...models];

    if (provider) {
      const p = provider.toLowerCase();
      filtered = filtered.filter(m => m.provider.toLowerCase() === p);
      if (filtered.length === 0) {
        return {
          content: [{ type: "text", text: `No models found for provider "${provider}". Available: ${providers.join(", ")}` }],
        };
      }
    }

    if (min_context) {
      filtered = filtered.filter(m => m.contextWindow >= min_context);
      if (filtered.length === 0) {
        return {
          content: [{ type: "text", text: `No models with context window >= ${min_context.toLocaleString()} tokens.` }],
        };
      }
    }

    const sortFn = sort_by === "input"
      ? (a: ModelPricing, b: ModelPricing) => a.inputPer1M - b.inputPer1M
      : sort_by === "output"
        ? (a: ModelPricing, b: ModelPricing) => a.outputPer1M - b.outputPer1M
        : (a: ModelPricing, b: ModelPricing) => (a.inputPer1M + a.outputPer1M) - (b.inputPer1M + b.outputPer1M);

    filtered.sort(sortFn);
    const top = filtered.slice(0, limit);

    const lines = [
      `# Cheapest Models${provider ? ` (${provider})` : ""}${min_context ? ` — ${formatContext(min_context)}+ context` : ""}`,
      `*Sorted by ${sort_by} cost*`,
      "",
      "| # | Model | Provider | Input/1M | Output/1M | Context |",
      "|---|-------|----------|----------|-----------|---------|",
    ];

    top.forEach((m, i) => {
      lines.push(`| ${i + 1} | ${m.name} | ${m.provider} | $${m.inputPer1M} | $${m.outputPer1M} | ${formatContext(m.contextWindow)} |`);
    });

    lines.push("", `*${filtered.length} total models matched. Data from [TokenCost](https://tokencost.app)*`);

    return {
      content: [{ type: "text", text: lines.join("\n") }],
      structuredContent: {
        models: top.map(modelToJSON),
        total_matched: filtered.length,
        filters: { provider: provider ?? null, min_context: min_context ?? null, sort_by },
      },
    };
  }
);

server.registerTool(
  "tokencost_list_models",
  {
    title: "List All Models",
    description: `List all available LLM models with pricing data, optionally filtered by provider.

Args:
  - provider (string, optional): Filter by provider (e.g., "OpenAI", "Anthropic", "Google")

Returns:
  List of all models with IDs, names, and providers. Use model IDs with other tools.

Examples:
  - {} → All 60+ models
  - { provider: "Anthropic" } → All Anthropic Claude models`,
    inputSchema: {
      provider: z.string().optional().describe("Filter by provider name"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ provider }) => {
    let filtered = models;
    if (provider) {
      const p = provider.toLowerCase();
      filtered = models.filter(m => m.provider.toLowerCase() === p);
    }

    const byProvider = new Map<string, ModelPricing[]>();
    for (const m of filtered) {
      const list = byProvider.get(m.provider) ?? [];
      list.push(m);
      byProvider.set(m.provider, list);
    }

    const lines = [`# Available Models (${filtered.length})`, ""];
    for (const [prov, ms] of byProvider) {
      lines.push(`## ${prov}`);
      for (const m of ms) {
        lines.push(`- **${m.name}** (\`${m.id}\`) — $${m.inputPer1M}/$${m.outputPer1M} per 1M tokens`);
      }
      lines.push("");
    }
    lines.push(`*Full pricing at [TokenCost](https://tokencost.app)*`);

    return {
      content: [{ type: "text", text: lines.join("\n") }],
      structuredContent: {
        total: filtered.length,
        providers: [...byProvider.keys()],
        models: filtered.map(m => ({ id: m.id, name: m.name, provider: m.provider })),
      },
    };
  }
);

server.registerTool(
  "tokencost_list_providers",
  {
    title: "List Providers",
    description: `List all LLM providers with model counts and pricing ranges.

Returns:
  All providers with the number of models and pricing range for each.`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => {
    const byProvider = new Map<string, ModelPricing[]>();
    for (const m of models) {
      const list = byProvider.get(m.provider) ?? [];
      list.push(m);
      byProvider.set(m.provider, list);
    }

    const lines = [`# LLM Providers (${byProvider.size})`, ""];
    const providerData: { provider: string; model_count: number; input_range: string; output_range: string }[] = [];

    for (const [prov, ms] of byProvider) {
      const minInput = Math.min(...ms.map(m => m.inputPer1M));
      const maxInput = Math.max(...ms.map(m => m.inputPer1M));
      const minOutput = Math.min(...ms.map(m => m.outputPer1M));
      const maxOutput = Math.max(...ms.map(m => m.outputPer1M));

      const inputRange = minInput === maxInput ? `$${minInput}` : `$${minInput}–$${maxInput}`;
      const outputRange = minOutput === maxOutput ? `$${minOutput}` : `$${minOutput}–$${maxOutput}`;

      lines.push(`- **${prov}** — ${ms.length} model${ms.length > 1 ? "s" : ""} | Input: ${inputRange}/1M | Output: ${outputRange}/1M`);
      providerData.push({ provider: prov, model_count: ms.length, input_range: inputRange, output_range: outputRange });
    }

    lines.push("", `*Explore all models at [TokenCost](https://tokencost.app)*`);

    return {
      content: [{ type: "text", text: lines.join("\n") }],
      structuredContent: { total_providers: byProvider.size, total_models: models.length, providers: providerData },
    };
  }
);

// ── Start Server ─────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TokenCost MCP Server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
