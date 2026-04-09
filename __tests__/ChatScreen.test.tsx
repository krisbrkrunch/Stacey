import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ChatScreen from '../screens/ChatScreen';
import { sendChatMessage } from '../lib/openclaw';
import * as Speech from 'expo-speech';

jest.mock('../lib/openclaw', () => ({ sendChatMessage: jest.fn() }));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  getAvailableVoicesAsync: jest.fn(async () => ([{ identifier: 'voice-1', name: 'Voice One', language: 'en-US' }])),
}));

const inputBarState: { value?: string; onSend?: () => void; onSpeakLast?: () => void; onStopSpeak?: () => void; canSpeak?: boolean; } = {};

jest.mock('../components/InputBar', () => {
  return function MockInputBar(props: any) {
    inputBarState.value = props.value;
    inputBarState.onSend = props.onSend;
    inputBarState.onSpeakLast = props.onSpeakLast;
    inputBarState.onStopSpeak = props.onStopSpeak;
    inputBarState.canSpeak = props.canSpeak;
    return null;
  };
});

jest.mock('../components/MarkdownMessage', () => ({ content }: { content: string }) => content);

const mockedSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;
const mockedSpeech = Speech as jest.Mocked<typeof Speech>;

// Suppress act warnings in test renderer
const origConsoleError = console.error;
console.error = jest.fn();

describe('ChatScreen', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  beforeEach(() => {
    mockedSendChatMessage.mockReset();
    mockedSpeech.speak.mockReset();
    mockedSpeech.stop.mockReset();
  });

  it('renders the chat header and wires the speech controls', async () => {
    await act(async () => {
      renderer.create(<ChatScreen route={{ params: { session: { id: 's1', title: 'Test Chat', messages: [] } } }} />);
      await Promise.resolve();
    });

    expect(inputBarState.canSpeak).toBe(true);
    expect(inputBarState.value).toBe('');
    expect(inputBarState.onSpeakLast).toEqual(expect.any(Function));
  });

  it('plays the last assistant message through speech and can stop playback', async () => {
    await act(async () => {
      renderer.create(<ChatScreen route={{ params: { session: { id: 's1', title: 'Test Chat', messages: [] } } }} />);
      await Promise.resolve();
    });

    await act(async () => {
      inputBarState.onSpeakLast?.();
    });
    expect(mockedSpeech.speak).toHaveBeenCalledWith(expect.stringContaining('I\'m live'), expect.objectContaining({ language: 'en-US' }));

    await act(async () => {
      inputBarState.onStopSpeak?.();
    });
    expect(mockedSpeech.stop).toHaveBeenCalled();
  });
});
