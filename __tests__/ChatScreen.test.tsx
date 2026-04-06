import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ChatScreen from '../screens/ChatScreen';
import { sendChatMessage } from '../lib/openclaw';
import * as Speech from 'expo-speech';

jest.mock('../lib/openclaw', () => ({
  sendChatMessage: jest.fn(),
}));

const inputBarState: { value?: string; onSend?: () => void; onSpeakLast?: () => void; canSpeak?: boolean } = {};

jest.mock('../components/InputBar', () => {
  return function MockInputBar(props: any) {
    inputBarState.value = props.value;
    inputBarState.onSend = props.onSend;
    inputBarState.onSpeakLast = props.onSpeakLast;
    inputBarState.canSpeak = props.canSpeak;
    return null;
  };
});

jest.mock('../components/MarkdownMessage', () => ({ content }: { content: string }) => content);

const mockedSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;
const mockedSpeech = Speech as jest.Mocked<typeof Speech>;

describe('ChatScreen', () => {
  beforeEach(() => {
    mockedSendChatMessage.mockReset();
    mockedSpeech.speak.mockReset();
  });

  it('renders the chat header and wires the speech controls', async () => {
    await act(async () => {
      renderer.create(<ChatScreen route={{ params: { session: { id: 's1', title: 'Test Chat', messages: [] } } }} />);
    });

    expect(inputBarState.canSpeak).toBe(true);
    expect(inputBarState.value).toBe('');
    expect(inputBarState.onSpeakLast).toEqual(expect.any(Function));
  });

  it('plays the last assistant message through speech', async () => {
    await act(async () => {
      renderer.create(<ChatScreen route={{ params: { session: { id: 's1', title: 'Test Chat', messages: [] } } }} />);
    });

    expect(inputBarState.canSpeak).toBe(true);
    await act(async () => {
      inputBarState.onSpeakLast?.();
    });
    expect(mockedSpeech.speak).toHaveBeenCalledWith(expect.stringContaining('I\'m live'), expect.objectContaining({ language: 'en-US' }));
  });
});
