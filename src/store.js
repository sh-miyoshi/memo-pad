import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/*

memos = {
  memo: [
    {
      id: string,
      title: string,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
memo_details = {
  memo: [
    {
      id: string,
      text: string,
      images: []string
    }
  ]
}

*/

export const LoadMemoList = async () => {
  try {
    const memos = await AsyncStorage.getItem('memos');
    return memos != null ? JSON.parse(memos).memo.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch (e) {
    // error reading value
    console.log(`Load memo list failed: ${e}`);
  }
  return [];
};

export const LoadMemo = async (id) => {
  console.log(`Load memo ${id}`);

  try {
    const memos = await AsyncStorage.getItem('memo_details');
    if (memos != null) {
      const memo = JSON.parse(memos).memo.find((m) => m.id === id);
      if (memo != null) {
        return memo;
      }
    }
  } catch (e) {
    // error reading value
    console.log(`Load memo failed: ${e}`);
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
    let memos = await AsyncStorage.getItem('memo_details');
    if (memos != null) {
      memos = JSON.parse(memos);
      const index = memos.memo.findIndex((m) => m.id === id);
      memos.memo[index].text = text;
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memos));
    }

    memos = await AsyncStorage.getItem('memos');
    if (memos != null) {
      memos = JSON.parse(memos);
      const index = memos.memo.findIndex((m) => m.id === id);
      memos.memo[index].updatedAt = Date.now();
      memos.memo[index].title = title;
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos));
    }
  } catch (e) {
    console.log(`Update memo failed: ${e}`);
  }

  return id;
};

export const RemoveMemo = async (id) => {
  console.log(`Remove memo ${id}`);

  let memos = await AsyncStorage.getItem('memo_details');
  if (memos != null) {
    memos = JSON.parse(memos);
    const removed = memos.memo.filter((m) => m.id !== id);
    memos.memo = removed;
    await AsyncStorage.mergeItem('memo_details', JSON.stringify(memos));
  }
  memos = await AsyncStorage.getItem('memos');
  if (memos != null) {
    memos = JSON.parse(memos);
    const removed = memos.memo.filter((m) => m.id !== id);
    memos.memo = removed;
    await AsyncStorage.mergeItem('memos', JSON.stringify(memos));
  }
};

export const Clear = async () => {
  await AsyncStorage.clear();
};

export const AddDummy = async () => {
  await Clear();

  const now = Date.now();
  const memos = {
    memo: [
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
    ],
  };
  await AsyncStorage.setItem('memos', JSON.stringify(memos));

  const memoDetails = {
    memo: [
      {
        id: 'id1',
        text: 'テストデータ1',
        images: [],
      },
      {
        id: 'id2',
        text: 'ダミーデータ',
        images: [],
      },
    ],
  };
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
      await AsyncStorage.setItem('memos', JSON.stringify({ memo: [memo] }));
    } else {
      memos = JSON.parse(memos);
      memos.memo.push(memo);
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos));
    }

    let memoDetails = await AsyncStorage.getItem('memo_details');
    memo = {
      id,
      text,
      images: [],
    };
    if (memoDetails == null) {
      await AsyncStorage.setItem('memo_details', JSON.stringify({ memo: [memo] }));
    } else {
      memoDetails = JSON.parse(memoDetails);
      memoDetails.memo.push(memo);
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memoDetails));
    }
  } catch (e) {
    // saving error
    console.log(`Add memo failed: ${e}`);
    id = null;
  }

  return id;
};
