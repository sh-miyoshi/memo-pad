import React from 'react';
import { Text, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default function Top() {
  return (
    <View>
      <TopHeader />
      <Text>hello</Text>
    </View>
  );
}

function TopHeader() {
  return (
    <Header
      centerComponent={{ text: 'メモ帳', style: { color: '#ffffff' } }}
      rightComponent={<Icon name='menu' color='#ffffff' onPress={() => { }} />}
      containerStyle={{ backgroundColor: '#808080' }}
    />
  )
}