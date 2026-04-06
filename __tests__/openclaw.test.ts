import { loadChatSessions, sendChatMessage } from '../lib/openclaw';

describe('openclaw chat gateway helpers', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('posts chat messages and unwraps reply content', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ sessionId: 'abc', reply: { content: 'hello back' } }),
    });

    await expect(sendChatMessage({ sessionId: 'abc', message: 'hi', gatewayUrl: 'http://example.com' })).resolves.toEqual({
      sessionId: 'abc',
      reply: 'hello back',
      raw: { sessionId: 'abc', reply: { content: 'hello back' } },
    });

    expect(global.fetch).toHaveBeenCalledWith('http://example.com/api/chat', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'abc', message: 'hi' }),
    }));
  });

  it('falls back to local sessions when the gateway is unavailable', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));

    await expect(loadChatSessions('http://example.com')).resolves.toHaveLength(2);
    await expect(loadChatSessions('http://example.com')).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'stacey-alpha', title: 'Stacey Alpha' }),
      expect.objectContaining({ id: 'project-notes', title: 'Project Notes' }),
    ]));
  });
});
