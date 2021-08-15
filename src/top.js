import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';
import {
  Header, Icon, Overlay, Button, ListItem,
} from 'react-native-elements';
import { AdMobBanner } from 'expo-ads-admob';
import {
  LoadList, RemoveMemo, Clear, AddDummy,
} from './store';
import { DeleteDialog } from './delete';
import { ENABLE_DEV_FEATURE, AD_UNIT_ID } from './env';

export const Top = ({ navigation }) => {
  const [memos, setMemos] = useState([]);
  const [deleteID, setDeleteID] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const m = await LoadList();
      setMemos(m);
    });

    return unsubscribe;
  }, [navigation]);

  const goMemo = (id) => {
    if (id != null) {
      console.log(`Edit ${id}`);
    } else {
      console.log('Create new memo');
    }
    navigation.navigate('Memo', { id });
  };

  const bannerError = () => {
    console.log('Ad Fail error');
  };

  return (
    <View style={styles.container}>
      <TopHeader />

      {ENABLE_DEV_FEATURE && (
        <View>
          <Button
            title="Clear"
            onPress={
              async () => {
                await Clear();
                setMemos([]);
              }
            }
          />

          <Button
            title="AddDummy"
            onPress={
              async () => {
                await AddDummy();
                const m = await LoadList();
                setMemos(m);
              }
            }
          />
        </View>
      )}

      <Button
        icon={(
          <Icon
            name="pluscircleo"
            type="antdesign"
            color="black"
          />
        )}
        title="新しいメモを追加"
        titleStyle={{ color: 'black', padding: 10 }}
        buttonStyle={{ backgroundColor: '#d3d3d3', margin: 10 }}
        onPress={() => goMemo(null)}
      />

      <MemoList memos={memos} goMemo={goMemo} setDeleteID={setDeleteID} />

      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID={AD_UNIT_ID}
        onDidFailToReceiveAdWithError={bannerError}
      />

      <DeleteDialog
        visible={deleteID != null}
        cancel={() => { setDeleteID(null); }}
        deleteMemo={
          async () => {
            console.log(`Delete target: ${deleteID}`);
            await RemoveMemo(deleteID);
            setDeleteID(null);
            const m = await LoadList();
            setMemos(m);
          }
        }
      />
    </View>
  );
};

const TopHeader = () => {
  const [menuShow, setMenuShow] = useState(false);
  const toggleMenu = () => {
    setMenuShow(!menuShow);
  };

  return (
    <View>
      <Header
        centerComponent={{ text: 'メモ帳', style: { color: '#ffffff' } }}
        rightComponent={
          ENABLE_DEV_FEATURE && (<Icon name="menu" type="feather" color="#ffffff" onPress={toggleMenu} />)
        }
        containerStyle={{ backgroundColor: '#808080' }}
      />
      <Overlay isVisible={menuShow} onBackdropPress={toggleMenu}>
        <Text>設定</Text>
        <Text>・文字の大きさ</Text>
      </Overlay>
    </View>
  );
};

const MemoList = ({ memos, goMemo, setDeleteID }) => (
  <View style={styles.list}>
    <FlatList
      data={memos}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <ListItem bottomDivider onPress={() => goMemo(item.id)} onLongPress={() => { setDeleteID(item.id); }}>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{formatDate(item.updatedAt)}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafa',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    width: '90%',
  },
});

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}/${(`0${d.getMonth() + 1}`).slice(-2)}/${(`0${d.getDate()}`).slice(-2)} ${(`0${d.getHours()}`).slice(-2)}:${(`0${d.getMinutes()}`).slice(-2)}:${(`0${d.getSeconds()}`).slice(-2)}`;
};
