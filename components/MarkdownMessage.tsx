import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <View>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}

const markdownStyles = StyleSheet.create({
  body: { color: '#e0e0e0', fontSize: 14, lineHeight: 20 },
  text: { color: '#e0e0e0' },
  strong: { color: '#ffffff' },
  em: { color: '#e0e0e0' },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { color: '#e0e0e0', marginVertical: 2 },
  link: { color: '#00d4ff', textDecorationLine: 'underline' },
  code_inline: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: '#f3f3f3',
  },
  fence: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    color: '#f3f3f3',
  },
  code_block: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    color: '#f3f3f3',
  },
});
