import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

export const LoadMemoList = async () => {
  try {
    const memos = await storage.load({ key: 'memos' });
    return memos.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return [];
    }
    // error reading value
    console.log(`Load memo list failed: ${err}`);
  }
  return [];
};

export const LoadMemo = async (id) => {
  console.log(`Load memo ${id}`);

  try {
    return await storage.load({
      key: 'memo_details',
      id,
    });
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return { text: '' };
    }
    // error reading value
    console.log(`Load memo failed: ${err}`);
  }
  return { text: '' };
};

export const UpdateMemo = async (id, text) => {
  console.log(`Update memo ${id}`);

  if (typeof text !== 'string') {
    return null;
  }

  const title = text.split('\n')[0];
  if (id == null) {
    return addMemo(title, text);
  }

  try {
    let memo = await storage.load({
      key: 'memo_details',
      id,
    });
    memo.text = text;
    await storage.save({
      key: 'memo_details',
      id,
      data: memo,
    });

    memo = await storage.load({
      key: 'memos',
      id,
    });
    memo.updatedAt = Date.now();
    memo.title = title;
    storage.save({
      key: 'memos',
      id,
      data: memo,
    });
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return id;
    }
    console.log(`Update memo failed: ${err}`);
  }

  return id;
};

export const RemoveMemo = (id) => {
  console.log(`Remove memo ${id}`);

  storage.remove({
    key: 'memo_details',
    id,
  });
  storage.remove({
    key: 'memos',
    id,
  });
};

export const Clear = async () => {
  await storage.clearMap();
};

export const AddDummy = async () => {
  await Clear();

  // const now = Date.now();
  // const memos = {
  //   memo: [
  //     {
  //       id: 'id1',
  //       title: 'テストデータ1',
  //       createdAt: now,
  //       updatedAt: now,
  //     },
  //     {
  //       id: 'id2',
  //       title: 'ダミーデータ',
  //       createdAt: now,
  //       updatedAt: now,
  //     },
  //   ],
  // };
  // await AsyncStorage.setItem('memos', JSON.stringify(memos));

  // const memoDetails = {
  //   memo: [
  //     {
  //       id: 'id1',
  //       text: 'テストデータ1',
  //     },
  //     {
  //       id: 'id2',
  //       text: 'ダミーデータ',
  //     },
  //   ],
  // };
  // await AsyncStorage.setItem('memo_details', JSON.stringify(memoDetails));
};

const addMemo = async (title, text) => {
  const now = Date.now();
  let id = uuidv4();

  try {
    storage.save({
      key: 'memos',
      id,
      data: {
        id,
        title,
        createdAt: now,
        updatedAt: now,
      },
    });

    storage.save({
      key: 'memo_details',
      id,
      data: {
        id,
        text,
      },
    });
  } catch (e) {
    // saving error
    console.log(`Add memo failed: ${e}`);
    id = null;
  }

  return id;
};
