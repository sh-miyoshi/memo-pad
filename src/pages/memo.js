import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, Dimensions,
} from 'react-native';
import {
  Header, Icon, Button, Image, Overlay,
} from 'react-native-elements';
import { TextInput, DefaultTheme } from 'react-native-paper';
import { DeleteDialog } from '../components/delete';
import {
  LoadMemo, UpdateMemo, RemoveMemo, AddImage, LoadImage, RemoveImage,
} from '../store';
import * as ImagePicker from 'expo-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import { ENABLE_DEV_FEATURE } from '../env';

export const Memo = ({ navigation, route }) => {
  const [deleteID, setDeleteID] = useState(null);
  const [deleteImageID, setDeleteImageID] = useState(null);
  const [images, setImages] = useState([]);
  const [viewImageURI, setViewImageURI] = useState('');

  const loadImages = async () => {
    const memo = await LoadMemo(route.params.id);
    setImages(memo.images);
  };

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
    });

    if (!result.canceled) {
      console.log(`pick image path: ${result.assets[0].uri}`);
      await AddImage(route.params.id, result.assets[0].uri);
      await loadImages();
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

      <ImageList images={images} setViewImageURI={setViewImageURI} memoID={route.params.id} setDeleteImageID={setDeleteImageID} />

      <DeleteDialog
        visible={deleteID != null}
        cancel={() => { setDeleteID(null); }}
        deleteFunc={
          async () => {
            console.log(`Delete target: ${deleteID}`);
            await RemoveMemo(deleteID);
            navigation.navigate('Top');
          }
        }
      />

      <DeleteDialog
        visible={deleteImageID != null}
        cancel={() => { setDeleteImageID(null); }}
        deleteFunc={
          async () => {
            await RemoveImage(route.params.id, deleteImageID);
            loadImages();
            setDeleteImageID(null);
          }
        }
      />

      <Overlay isVisible={viewImageURI !== ''} onBackdropPress={() => { setViewImageURI(''); }}>
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height}
        >
          <Image
            style={{
              margin: 20,
              width: Dimensions.get('window').width - 40,
              height: Dimensions.get('window').height - 40,
            }}
            source={{
              uri: viewImageURI,
            }}
          />
        </ImageZoom>
      </Overlay>
    </View>
  )
}
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
  const [text, setText] = useState('');
  const [currentID, setCurrentID] = useState(id);

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
        numberOfLines={15}
      />
    </View>
  );
};

const ImageList = ({
  images, memoID, setViewImageURI, setDeleteImageID,
}) => (
  <View style={styles.imageArea}>
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image
          source={{
            uri: item.uri,
          }}
          style={{
            width: 200,
            height: 200,
          }}
          onPress={async () => {
            const image = await LoadImage(memoID, item.id);
            console.log(`load image: ${JSON.stringify(image)}`);
            setViewImageURI(image.uri);
          }}
          onLongPress={() => {
            setDeleteImageID(item.id);
          }}
        />
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

  headerIcon: {
    flexDirection: 'row',
  },

  textinput: {
    width: '90%',
    margin: 10,
  },

  imageArea: {
    height: 250,
  },

  admob: {
    margin: 10,
  },
});

const textTheme = {
  ...DefaultTheme,
  colors: {
    primary: '#000000',
    background: '#fafafa',
  },
};
