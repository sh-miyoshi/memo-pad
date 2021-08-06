import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { TextInput, DefaultTheme } from 'react-native-paper';

export const Memo = () => {
  return (
    <View style={styles.container}>
      <MemoHeader />
      <MemoBody />
    </View>
  )
}

const MemoHeader = () => {
  return (
    <View>
      <Header
        rightComponent={
          <View style={styles.headerIcon}>
            <Icon name='delete' type="antdesign" color='#ffffff' />
            <Icon name='menu' type="feather" color='#ffffff' style={{ marginLeft: 16 }} />
          </View>
        }
        containerStyle={{ backgroundColor: '#808080' }}
      />
    </View>
  )
}

const MemoBody = () => {
  const [text, setText] = React.useState('');

  return (
    <View style={styles.textinput}>
      <TextInput
        value={text}
        onChangeText={text => setText(text)}
        multiline
        placeholder="メモ内容(自動保存されます)"
        theme={textTheme}
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

  headerIcon: {
    flexDirection: 'row'
  },

  textinput: {
    width: '90%'
  },
});

const textTheme = {
  ...DefaultTheme,
  colors: {
    primary: '#000000',
    background: '#fafafa'
  }
}