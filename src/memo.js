import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';

export const Memo = () => {
  return (
    <View style={styles.container}>
      <MemoHeader />
    </View>
  )
}

const MemoHeader = () => {
  return (
    <View>
      <Header
        rightComponent={{ text: '削除アイコン、メニュー' }}
        containerStyle={{ backgroundColor: '#808080' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafa',
    alignItems: 'center',
  },
});
