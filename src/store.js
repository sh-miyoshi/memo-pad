// import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const memos = [
  {
    id: "id1",
    title: "大事なもの",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "id2",
    title: "アイテム",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const textMemos = [
  {
    id: "id1",
    text: "大事なもの"
  },
  {
    id: "id2",
    text: "アイテム"
  }
]

export const LoadList = () => {
  return memos
}

export const LoadMemo = (id) => {
  const memo = textMemos.find(m => m.id === id)
  if (memo != null) {
    return memo
  }
  return { text: '' }
}

export const AddMemo = (title, text) => {
  const now = Date.now()
  const id = uuidv4()

  memos.push({
    id: id,
    title: title,
    createdAt: now,
    updatedAt: now,
  })

  textMemos.push({
    id: id,
    text: text,
  })
}

export const UpdateMemo = (id, text) => {
  let index = textMemos.findIndex(m => m.id === id)
  if (index == -1) {
    return
  }

  textMemos[index].text = text

  index = memos.findIndex(m => m.id === id)
  memos[index].updatedAt = Date.now()
}
