import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Header, Icon, Overlay, Button, ListItem } from 'react-native-elements';

export const Top = () => {
  const memos = [
    {
      id: "id1",
      title: "大事なもの",
    },
    {
      id: "id2",
      title: "アイテム",
    },
  ]

  return (
    <View>
      <TopHeader />
      {
        memos.map((memo, i) => (
          <ListItem key={i} bottomDivider onPress={() => { console.log(memo.title) }}>
            <ListItem.Content>
              <ListItem.Title>{memo.title}</ListItem.Title>
              <ListItem.Subtitle>2021/08/04 21:01</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
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
            color="black"
          />
        }
        title="新しいメモを追加"
        titleStyle={{ color: "black", padding: 10 }}
        buttonStyle={{ backgroundColor: "#d3d3d3", margin: 10 }}
      />

    </View>
  )
}