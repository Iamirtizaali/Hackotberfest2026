// Minimal DeepSeek client (OpenAI-compatible chat completions) that always returns parsed JSON.
// Works with DeepSeek directly or a host such as Hive via DEEPSEEK_BASE_URL.
const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const TIMEOUT_MS = 120000;

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type DeepSeekErrorCode = 'missing_key' | 'upstream' | 'bad_json' | 'timeout';

export class DeepSeekError extends Error {
  code: DeepSeekErrorCode;

  constructor(code: DeepSeekErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

type CallOptions = {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
};

const requestCompletion = async (
  url: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<string> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (response.status === 401) {
      throw new DeepSeekError(
        'upstream',
        'The AI provider rejected the API key. Check DEEPSEEK_API_KEY and DEEPSEEK_BASE_URL in .env.local and restart the dev server.'
      );
    }

    if (!response.ok) {
      const text = await response.text();
      throw new DeepSeekError('upstream', `DeepSeek returned ${response.status}: ${text.slice(0, 300)}`);
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    if (err instanceof DeepSeekError) throw err;
    if (err?.name === 'AbortError') {
      throw new DeepSeekError('timeout', 'DeepSeek took too long to respond. Try a shorter brief.');
    }
    throw new DeepSeekError('upstream', `Could not reach DeepSeek: ${err?.message || err}`);
  } finally {
    clearTimeout(timer);
  }
};

const parseJson = (content: string) => {
  if (!content || !content.trim()) return null;

  // Strip accidental ```json fences before parsing
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/, '');

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
};

export async function callDeepSeekJSON({
  system,
  messages,
  maxTokens = 12000,
  temperature = 0.3
}: CallOptions): Promise<any> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new DeepSeekError('missing_key', 'Set DEEPSEEK_API_KEY in .env.local and restart the dev server.');
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
  const url = `${baseUrl}/chat/completions`;
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-flash';
  const reasoningEffort = process.env.DEEPSEEK_REASONING_EFFORT;
  // DeepSeek's own API takes max_tokens; OpenAI-style hosts like Hive take max_completion_tokens
  const tokenParam = baseUrl === DEFAULT_BASE_URL ? 'max_tokens' : 'max_completion_tokens';
  const baseMessages: ChatMessage[] = [{ role: 'system', content: system }, ...messages];

  // JSON mode can occasionally return empty or truncated content, so retry once with a nudge
  for (let attempt = 0; attempt < 2; attempt++) {
    const attemptMessages: ChatMessage[] =
      attempt === 0
        ? baseMessages
        : [...baseMessages, { role: 'user', content: 'Return only valid json matching the schema.' }];

    const content = await requestCompletion(
      url,
      {
        model,
        messages: attemptMessages,
        response_format: { type: 'json_object' },
        [tokenParam]: maxTokens,
        temperature,
        stream: false,
        ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {})
      },
      apiKey
    );

    const parsed = parseJson(content);

    if (parsed && typeof parsed === 'object') return parsed;
  }

  throw new DeepSeekError('bad_json', 'DeepSeek did not return valid JSON. Please try again.');
}
