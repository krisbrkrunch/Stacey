export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  avatar?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
  avatarLabel?: string;
  messages: ChatMessage[];
}

const DEFAULT_GATEWAY_URL = process.env.EXPO_PUBLIC_GATEWAY_URL || 'http://gateway.local:18789';
const DEFAULT_CHAT_PATH = '/api/chat';

function withBase(url: string, path: string) {
  return new URL(path, url).toString();
}

async function safeJson(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }
}

export async function sendChatMessage(input: {
  sessionId?: string;
  message: string;
  gatewayUrl?: string;
}) {
  const gatewayUrl = input.gatewayUrl || DEFAULT_GATEWAY_URL;
  const response = await fetch(withBase(gatewayUrl, DEFAULT_CHAT_PATH), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: input.sessionId, message: input.message }),
  });

  if (!response.ok) {
    throw new Error(`Gateway request failed (${response.status})`);
  }

  const data = await safeJson(response);
  const reply = data.reply?.content || data.message || data.text || 'No reply returned by gateway.';
  const sessionId = data.sessionId || input.sessionId || 'default';
  return { sessionId, reply, raw: data };
}

export async function loadChatSessions(gatewayUrl?: string): Promise<ChatSession[]> {
  const url = gatewayUrl || DEFAULT_GATEWAY_URL;
  try {
    const response = await fetch(withBase(url, '/api/sessions'));
    if (!response.ok) throw new Error('bad status');
    const data = await safeJson(response);
    if (Array.isArray(data.sessions)) return data.sessions;
  } catch {
    // fallback below
  }

  return [
    {
      id: 'stacey-alpha',
      title: 'Stacey Alpha',
      lastMessage: 'OpenClaw is wired in with a fallback mock if the gateway is asleep.',
      updatedAt: new Date().toISOString(),
      unreadCount: 1,
      avatarLabel: 'SA',
      messages: [],
    },
    {
      id: 'project-notes',
      title: 'Project Notes',
      lastMessage: 'Markdown, avatars, timestamps, and TTS are now handled in the chat UI.',
      updatedAt: new Date(Date.now() - 1000 * 60 * 23).toISOString(),
      avatarLabel: 'PN',
      messages: [],
    },
  ];
}
