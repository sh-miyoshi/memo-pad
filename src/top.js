import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, Icon, Overlay, Button, ListItem } from 'react-native-elements';

export const Top = ({ navigation }) => {
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

  const goMemo = (id) => {
    if (id != null) {
      console.log("Edit " + id)
    } else {
      console.log("Create new memo")
    }
    navigation.navigate('Memo')
  }

  return (
    <View style={styles.container}>
      <TopHeader />

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
        onPress={() => goMemo(null)}
      />

      {
        memos.map((memo, i) => (
          <ListItem key={i} bottomDivider onPress={() => goMemo(memo.id)} style={{ width: '90%' }}>
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
        <Text>・文字の大きさ</Text>
      </Overlay>
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
