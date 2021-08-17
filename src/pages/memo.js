import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { TextInput, DefaultTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {
  LoadMemo, UpdateMemo, RemoveMemo, AddImage,
} from '../store';
import { DeleteDialog } from '../components/delete';
import { ENABLE_DEV_FEATURE } from '../env';

export const Memo = ({ navigation, route }) => {
  const [deleteID, setDeleteID] = useState(null);

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
    });

    if (!result.cancelled) {
      console.log(`pick image path: ${result.uri}`);
      AddImage(route.params.id, result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <MemoHeader id={route.params.id} setDeleteID={setDeleteID} />
      <MemoBody id={route.params.id} />

      <Button
        title="画像をピン止め"
        titleStyle={{ color: 'black', padding: 10 }}
        buttonStyle={{ backgroundColor: '#d3d3d3', margin: 10 }}
        onPress={addImage}
      />

      <DeleteDialog
        visible={deleteID != null}
        cancel={() => { setDeleteID(null); }}
        deleteMemo={
          async () => {
            console.log(`Delete target: ${deleteID}`);
            await RemoveMemo(deleteID);
            navigation.navigate('Top');
          }
        }
      />
    </View>
  );
};

const MemoHeader = ({ id, setDeleteID }) => (
  <View>
    <Header
      rightComponent={(
        <View style={styles.headerIcon}>
          <Icon name="delete" type="antdesign" color="#ffffff" onPress={() => { setDeleteID(id); }} />
          {ENABLE_DEV_FEATURE && <Icon name="menu" type="feather" color="#ffffff" style={{ marginLeft: 16 }} />}
        </View>
      )}
      containerStyle={{ backgroundColor: '#808080' }}
    />
  </View>
);

const MemoBody = ({ id }) => {
  const [text, setText] = React.useState('');
  const [currentID, setCurrentID] = React.useState(id);

  useEffect(() => {
    const load = async () => {
      const memo = await LoadMemo(id);
      setText(memo.text);
    };
    load();
  }, []);

  return (
    <View style={styles.textinput}>
      <TextInput
        value={text}
        onChangeText={
          async (newText) => {
            setText(newText);
            const updatedID = await UpdateMemo(currentID, newText);
            setCurrentID(updatedID);
          }
        }
        multiline
        placeholder="メモ内容(自動保存されます)"
        theme={textTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafa',
    alignItems: 'center',
  },

  headerIcon: {
    flexDirection: 'row',
  },

  textinput: {
    width: '90%',
  },
});

const textTheme = {
  ...DefaultTheme,
  colors: {
    primary: '#000000',
    background: '#fafafa',
  },
};
