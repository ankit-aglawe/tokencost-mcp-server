export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  contextWindow: number;
  maxOutput: number;
  notes?: string;
}

export const models: ModelPricing[] = [
  // ── OpenAI ──────────────────────────────────────────────
  { id: "gpt-5.4", name: "GPT-5.4", provider: "OpenAI", inputPer1M: 2.5, outputPer1M: 15, contextWindow: 1050000, maxOutput: 128000, notes: "Most capable OpenAI model. 2x input / 1.5x output pricing above 272K context." },
  { id: "gpt-5.4-pro", name: "GPT-5.4 Pro", provider: "OpenAI", inputPer1M: 30, outputPer1M: 180, contextWindow: 1050000, maxOutput: 128000, notes: "Extended thinking for complex reasoning tasks." },
  { id: "gpt-5.2", name: "GPT-5.2", provider: "OpenAI", inputPer1M: 1.75, outputPer1M: 14, contextWindow: 400000, maxOutput: 16384 },
  { id: "gpt-5.1", name: "GPT-5.1", provider: "OpenAI", inputPer1M: 1.25, outputPer1M: 10, contextWindow: 400000, maxOutput: 16384 },
  { id: "gpt-5.3-codex", name: "GPT-5.3 Codex", provider: "OpenAI", inputPer1M: 1.75, outputPer1M: 14, contextWindow: 400000, maxOutput: 32768, notes: "Coding-focused model" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", inputPer1M: 1.25, outputPer1M: 10, contextWindow: 400000, maxOutput: 16384 },
  { id: "gpt-5-medium", name: "GPT-5 Medium", provider: "OpenAI", inputPer1M: 1.25, outputPer1M: 10, contextWindow: 400000, maxOutput: 16384 },
  { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", inputPer1M: 0.25, outputPer1M: 2, contextWindow: 400000, maxOutput: 16384 },
  { id: "gpt-5-nano", name: "GPT-5 Nano", provider: "OpenAI", inputPer1M: 0.05, outputPer1M: 0.4, contextWindow: 128000, maxOutput: 16384 },
  { id: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI", inputPer1M: 2, outputPer1M: 8, contextWindow: 1047576, maxOutput: 32768 },
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "OpenAI", inputPer1M: 0.4, outputPer1M: 1.6, contextWindow: 1047576, maxOutput: 32768 },
  { id: "gpt-4.1-nano", name: "GPT-4.1 Nano", provider: "OpenAI", inputPer1M: 0.1, outputPer1M: 0.4, contextWindow: 1047576, maxOutput: 32768 },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPer1M: 2.5, outputPer1M: 10, contextWindow: 128000, maxOutput: 16384 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", inputPer1M: 0.15, outputPer1M: 0.6, contextWindow: 128000, maxOutput: 16384 },
  { id: "o4-mini", name: "o4 Mini", provider: "OpenAI", inputPer1M: 1.1, outputPer1M: 4.4, contextWindow: 200000, maxOutput: 100000, notes: "Reasoning model" },
  { id: "o3", name: "o3", provider: "OpenAI", inputPer1M: 2, outputPer1M: 8, contextWindow: 200000, maxOutput: 100000, notes: "Reasoning model" },
  { id: "o3-mini", name: "o3 Mini", provider: "OpenAI", inputPer1M: 1.1, outputPer1M: 4.4, contextWindow: 200000, maxOutput: 100000, notes: "Reasoning model" },
  { id: "o1", name: "o1", provider: "OpenAI", inputPer1M: 15, outputPer1M: 60, contextWindow: 200000, maxOutput: 100000, notes: "Reasoning model" },

  // ── Anthropic ───────────────────────────────────────────
  { id: "claude-opus-4.6-adaptive", name: "Claude Opus 4.6 Adaptive", provider: "Anthropic", inputPer1M: 5, outputPer1M: 25, contextWindow: 200000, maxOutput: 32000, notes: "Highest quality Anthropic model with adaptive reasoning" },
  { id: "claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic", inputPer1M: 5, outputPer1M: 25, contextWindow: 200000, maxOutput: 32000, notes: "Most capable Anthropic model" },
  { id: "claude-opus-4.5", name: "Claude Opus 4.5", provider: "Anthropic", inputPer1M: 5, outputPer1M: 25, contextWindow: 200000, maxOutput: 32000 },
  { id: "claude-sonnet-4.6-adaptive", name: "Claude Sonnet 4.6 Adaptive", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: 200000, maxOutput: 64000, notes: "Adaptive reasoning variant of Sonnet 4.6" },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: 200000, maxOutput: 64000 },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: 200000, maxOutput: 64000 },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15, contextWindow: 200000, maxOutput: 64000 },
  { id: "claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", inputPer1M: 1, outputPer1M: 5, contextWindow: 200000, maxOutput: 8192 },
  { id: "claude-4.5-haiku-reasoning", name: "Claude 4.5 Haiku Reasoning", provider: "Anthropic", inputPer1M: 1, outputPer1M: 5, contextWindow: 200000, maxOutput: 8192, notes: "Haiku with reasoning capabilities" },
  { id: "claude-haiku-3.5", name: "Claude Haiku 3.5", provider: "Anthropic", inputPer1M: 0.8, outputPer1M: 4, contextWindow: 200000, maxOutput: 8192 },

  // ── Google ──────────────────────────────────────────────
  { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro", provider: "Google", inputPer1M: 2, outputPer1M: 12, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", provider: "Google", inputPer1M: 2, outputPer1M: 12, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", provider: "Google", inputPer1M: 0.5, outputPer1M: 3, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-3-flash-reasoning", name: "Gemini 3 Flash Reasoning", provider: "Google", inputPer1M: 0.5, outputPer1M: 3, contextWindow: 1048576, maxOutput: 65536, notes: "Reasoning variant" },
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite", provider: "Google", inputPer1M: 0.25, outputPer1M: 1.5, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", inputPer1M: 1.25, outputPer1M: 10, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", inputPer1M: 0.3, outputPer1M: 2.5, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite", provider: "Google", inputPer1M: 0.1, outputPer1M: 0.4, contextWindow: 1048576, maxOutput: 65536 },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", inputPer1M: 0.1, outputPer1M: 0.4, contextWindow: 1048576, maxOutput: 8192 },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash-Lite", provider: "Google", inputPer1M: 0.075, outputPer1M: 0.3, contextWindow: 1048576, maxOutput: 8192 },

  // ── xAI ─────────────────────────────────────────────────
  { id: "grok-4", name: "Grok 4", provider: "xAI", inputPer1M: 3, outputPer1M: 15, contextWindow: 2000000, maxOutput: 16384 },
  { id: "grok-4-20", name: "Grok 4-20", provider: "xAI", inputPer1M: 2, outputPer1M: 6, contextWindow: 131072, maxOutput: 16384 },
  { id: "grok-4.1-fast", name: "Grok 4.1 Fast", provider: "xAI", inputPer1M: 0.2, outputPer1M: 0.5, contextWindow: 131072, maxOutput: 16384 },
  { id: "grok-4.1-fast-reasoning", name: "Grok 4.1 Fast Reasoning", provider: "xAI", inputPer1M: 0.2, outputPer1M: 0.5, contextWindow: 131072, maxOutput: 16384, notes: "Reasoning variant" },

  // ── Meta ────────────────────────────────────────────────
  { id: "llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", inputPer1M: 0.27, outputPer1M: 0.85, contextWindow: 1048576, maxOutput: 16384, notes: "Price via hosted APIs" },
  { id: "llama-4-scout", name: "Llama 4 Scout", provider: "Meta", inputPer1M: 0.08, outputPer1M: 0.3, contextWindow: 1048576, maxOutput: 16384, notes: "Price via hosted APIs" },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", provider: "Meta", inputPer1M: 0.18, outputPer1M: 0.18, contextWindow: 131072, maxOutput: 4096, notes: "Price via Groq/Together" },

  // ── Mistral ─────────────────────────────────────────────
  { id: "mistral-large-3", name: "Mistral Large 3", provider: "Mistral", inputPer1M: 0.5, outputPer1M: 1.5, contextWindow: 262000, maxOutput: 8192 },
  { id: "mistral-small", name: "Mistral Small", provider: "Mistral", inputPer1M: 0.1, outputPer1M: 0.3, contextWindow: 128000, maxOutput: 4096 },

  // ── DeepSeek ────────────────────────────────────────────
  { id: "deepseek-v3.2-chat", name: "DeepSeek V3.2 (Chat)", provider: "DeepSeek", inputPer1M: 0.28, outputPer1M: 0.42, contextWindow: 128000, maxOutput: 8192 },
  { id: "deepseek-v3.2-reasoner", name: "DeepSeek V3.2 (Reasoner)", provider: "DeepSeek", inputPer1M: 0.28, outputPer1M: 0.42, contextWindow: 128000, maxOutput: 8192, notes: "Reasoning model" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", inputPer1M: 1.35, outputPer1M: 5.40, contextWindow: 128000, maxOutput: 32768, notes: "Reasoning model" },

  // ── Alibaba / Qwen ───────────────────────────────────────
  { id: "qwen-3.5-397b", name: "Qwen 3.5 397B", provider: "Alibaba", inputPer1M: 0.60, outputPer1M: 3.60, contextWindow: 128000, maxOutput: 32768, notes: "Largest Qwen model" },
  { id: "qwen-3.5-27b", name: "Qwen 3.5 27B", provider: "Alibaba", inputPer1M: 0.30, outputPer1M: 2.40, contextWindow: 128000, maxOutput: 32768, notes: "Cost-effective Qwen model" },

  // ── Amazon Nova ───────────────────────────────────────────
  { id: "nova-2.0-pro-reasoning", name: "Nova 2.0 Pro Reasoning", provider: "Amazon", inputPer1M: 1.25, outputPer1M: 10, contextWindow: 128000, maxOutput: 32768, notes: "AWS Bedrock reasoning model" },
  { id: "nova-2.0-lite", name: "Nova 2.0 Lite", provider: "Amazon", inputPer1M: 0.30, outputPer1M: 2.50, contextWindow: 128000, maxOutput: 32768, notes: "Lightweight AWS model" },

  // ── NVIDIA ────────────────────────────────────────────────
  { id: "nemotron-3-super-120b", name: "Nemotron 3 Super 120B", provider: "NVIDIA", inputPer1M: 0.30, outputPer1M: 0.80, contextWindow: 1000000, maxOutput: 32768, notes: "Open-source hybrid Mamba-Transformer MoE. 120B total, ~12.7B active params." },

  // ── Cohere ────────────────────────────────────────────────
  { id: "command-a", name: "Command A", provider: "Cohere", inputPer1M: 2.50, outputPer1M: 10, contextWindow: 128000, maxOutput: 4096, notes: "Enterprise RAG-optimized model" },

  // ── Perplexity ────────────────────────────────────────────
  { id: "sonar-pro", name: "Sonar Pro", provider: "Perplexity", inputPer1M: 3, outputPer1M: 15, contextWindow: 128000, maxOutput: 4096, notes: "Search-augmented AI model" },

  // ── Kimi ──────────────────────────────────────────────────
  { id: "kimi-k2.5", name: "Kimi K2.5", provider: "Moonshot", inputPer1M: 0.60, outputPer1M: 3, contextWindow: 128000, maxOutput: 32768, notes: "High-quality model from Moonshot AI" },

  // ── Zhipu / GLM ───────────────────────────────────────────
  { id: "glm-5", name: "GLM-5", provider: "Zhipu", inputPer1M: 1, outputPer1M: 3.20, contextWindow: 128000, maxOutput: 32768, notes: "Leading Chinese LLM" },

  // ── MiniMax ───────────────────────────────────────────────
  { id: "minimax-m2.5", name: "MiniMax M2.5", provider: "MiniMax", inputPer1M: 0.30, outputPer1M: 1.20, contextWindow: 128000, maxOutput: 32768, notes: "Strong quality-to-price ratio" },
];

export const providers = [...new Set(models.map((m) => m.provider))];

export function findModel(query: string): ModelPricing | undefined {
  const q = query.toLowerCase();
  return models.find(m => m.id === q || m.name.toLowerCase() === q) ??
    models.find(m => m.id.includes(q) || m.name.toLowerCase().includes(q));
}

export function findModels(query: string): ModelPricing[] {
  const q = query.toLowerCase();
  return models.filter(m =>
    m.id.includes(q) || m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)
  );
}
