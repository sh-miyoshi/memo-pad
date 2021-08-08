// import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
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
  console.log(`all memos: ${memos}`)
  const res = memos.concat()
  res.sort()
  return res
}

export const LoadMemo = (id) => {
  const memo = textMemos.find(m => m.id === id)
  if (memo != null) {
    return memo
  }
  return { text: '' }
}

export const UpdateMemo = (id, text) => {
  if (text == null || text.length <= 0) {
    return null
  }

  const title = text.split('\n')[0]
  if (id == null) {
    return addMemo(title, text)
  }

  let index = textMemos.findIndex(m => m.id === id)
  textMemos[index].text = text

  index = memos.findIndex(m => m.id === id)
  memos[index].updatedAt = Date.now()
  memos[index].title = title
  return id
}

const addMemo = (title, text) => {
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

  return id
}