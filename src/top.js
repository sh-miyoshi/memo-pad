import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Header, Icon, Overlay, Button } from 'react-native-elements';

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
        rightComponent={<Icon name='menu' type="feather" color='#ffffff' onPress={toggleMenu} />}
        containerStyle={{ backgroundColor: '#808080' }}
      />
      <Overlay isVisible={menuShow} onBackdropPress={toggleMenu}>
        <Text>設定</Text>
      </Overlay>

      <Button
        icon={
          <Icon
            name="pluscircleo"
            type="antdesign"
            size={15}
            color="white"
          />
        }
        title="新しいメモを追加"
      />

    </View>
  )
}