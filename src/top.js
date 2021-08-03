import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Header, Icon, Overlay } from 'react-native-elements';

export const Top = () => {
  return (
    <View>
      <TopHeader />
      <Text>hello</Text>
    </View>
  );
}

const TopHeader = () => {
  const [menuShow, setMenuShow] = useState(false);
  const toggleMenu = () => {
    setMenuShow(!menuShow)
  }

  return (
    <View>
      <Header
        centerComponent={{ text: 'メモ帳', style: { color: '#ffffff' } }}
        rightComponent={<Icon name='menu' color='#ffffff' onPress={toggleMenu} />}
        containerStyle={{ backgroundColor: '#808080' }}
      />
      <Overlay isVisible={menuShow} onBackdropPress={toggleMenu}>
        <Text>設定</Text>
      </Overlay>
    </View>
  )
}