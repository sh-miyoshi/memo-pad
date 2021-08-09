import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const LoadList = async () => {
  try {
    const memos = await AsyncStorage.getItem('memos');
    return memos != null ? JSON.parse(memos) : [];
  } catch (e) {
    // error reading value
    console.log(e);
  }
  return [];
};

export const LoadMemo = async (id) => {
  try {
    const memos = await AsyncStorage.getItem('memo_details');
    if (memos != null) {
      const memo = JSON.parse(memos).find((m) => m.id === id);
      if (memo != null) {
        return memo;
      }
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
  return { text: '' };
};

export const UpdateMemo = async (id, text) => {
  if (text == null || text.length <= 0) {
    return null;
  }

  const title = text.split('\n')[0];
  if (id == null) {
    return addMemo(title, text);
  }

  try {
    let memos = await AsyncStorage.getItem('memo_details');
    if (memos != null) {
      const index = JSON.parse(memos).findIndex((m) => m.id === id);
      memos[index].text = text;
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memos));
    }

    memos = await AsyncStorage.getItem('memos');
    if (memos != null) {
      const index = JSON.parse(memos).findIndex((m) => m.id === id);
      memos[index].updatedAt = Date.now();
      memos[index].title = title;
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos));
    }
  } catch (e) {
    console.log(e);
  }

  return id;
};

export const RemoveMemo = async (id) => {
  let memos = await AsyncStorage.getItem('memo_details');
  if (memos != null) {
    const res = JSON.parse(memos).filter((m) => m.id !== id);
    await AsyncStorage.mergeItem('memo_details', JSON.stringify(res));
  }
  memos = await AsyncStorage.getItem('memos');
  if (memos != null) {
    const res = JSON.parse(memos).filter((m) => m.id !== id);
    await AsyncStorage.mergeItem('memos', JSON.stringify(res));
  }
};

export const Clear = async () => {
  await AsyncStorage.clear();
};

export const AddDummy = async () => {
  await AsyncStorage.removeItem('memos');
  await AsyncStorage.removeItem('memo_details');

  const now = Date.now();
  const memos = [
    {
      id: 'id1',
      title: 'テストデータ1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'id2',
      title: 'ダミーデータ',
      createdAt: now,
      updatedAt: now,
    },
  ];
  await AsyncStorage.setItem('memos', JSON.stringify(memos));

  const memoDetails = [
    {
      id: 'id1',
      text: 'テストデータ1',
    },
    {
      id: 'id2',
      text: 'ダミーデータ',
    },
  ];
  await AsyncStorage.setItem('memo_details', JSON.stringify(memoDetails));
};

const addMemo = async (title, text) => {
  const now = Date.now();
  let id = uuidv4();

  try {
    let memos = await AsyncStorage.getItem('memos');
    let memo = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
    };
    if (memos == null) {
      await AsyncStorage.setItem('memos', JSON.stringify([memo]));
    } else {
      memos = JSON.parse(memos);
      memos.push(memo);
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos));
    }

    let memoDetails = await AsyncStorage.getItem('memo_details');
    memo = {
      id,
      text,
    };
    if (memoDetails == null) {
      await AsyncStorage.setItem('memo_details', JSON.stringify([memo]));
    } else {
      memoDetails = JSON.parse(memoDetails);
      memoDetails.push(memo);
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memoDetails));
    }
  } catch (e) {
    // saving error
    console.log(e);
    id = null;
  }

  return id;
};
