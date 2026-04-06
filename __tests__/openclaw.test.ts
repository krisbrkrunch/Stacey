import { sendChatMessage } from '../lib/openclaw';

describe('sendChatMessage', () => {
  it('parses gateway replies', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ reply: { content: 'pong' }, sessionId: 'abc' }),
    } as any);

    await expect(sendChatMessage({ sessionId: 'abc', message: 'hi', gatewayUrl: 'http://example.com' })).resolves.toMatchObject({
      sessionId: 'abc',
      reply: 'pong',
    });
  });
});
