import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

export type MemoListInfo = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

type MemoList = {
  memo: MemoListInfo[]
}

type ImageInfo = {
  id: string
  uri: string
}

type MemoDetailInfo = {
  id: string
  text: string
  images: ImageInfo[]
}

type MemoDetailList = {
  memo: MemoDetailInfo[]
}

export const LoadMemoList = async (): Promise<MemoListInfo[]> => {
  try {
    const memos_str = await AsyncStorage.getItem('memos')
    if (memos_str == null) {
      return []
    } else {
      const memos: MemoList = JSON.parse(memos_str)
      return memos.memo.sort((a, b) => b.updatedAt - a.updatedAt)
    }
  } catch (e) {
    // error reading value
    console.log(`Load memo list failed: ${e}`)
  }
  return []
}

export const LoadMemo = async (id: string): Promise<MemoDetailInfo> => {
  console.log(`Load memo ${id}`)

  try {
    const memos = await AsyncStorage.getItem('memo_details')
    if (memos != null) {
      const memo: MemoDetailInfo = JSON.parse(memos).memo.find((m) => m.id === id)
      if (memo != null) {
        return memo
      }
    }
  } catch (e) {
    // error reading value
    console.log(`Load memo failed: ${e}`)
  }
  return { id: '', text: '', images: [] }
}

export const UpdateMemo = async (id: string, text: string): Promise<string> => {
  console.log(`Update memo ${id}`)

  const title = text.split('\n')[0]
  if (id == null) {
    return addMemo(title, text)
  }

  try {
    const memo_details_str = await AsyncStorage.getItem('memo_details')
    if (memo_details_str != null) {
      const memo_details: MemoDetailList = JSON.parse(memo_details_str)
      const index = memo_details.memo.findIndex((m) => m.id === id)
      memo_details.memo[index].text = text
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memo_details))
    }

    const memo_list_str = await AsyncStorage.getItem('memos')
    if (memo_list_str != null) {
      const memos = JSON.parse(memo_list_str)
      const index = memos.memo.findIndex((m) => m.id === id)
      memos.memo[index].updatedAt = Date.now()
      memos.memo[index].title = title
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos))
    }
  } catch (e) {
    console.log(`Update memo failed: ${e}`)
  }

  return id
}

export const RemoveMemo = async (id) => {
  console.log(`Remove memo ${id}`)

  const memo_details_str = await AsyncStorage.getItem('memo_details')
  if (memo_details_str != null) {
    const memo_details = JSON.parse(memo_details_str)
    const removed = memo_details.memo.filter((m) => m.id !== id)
    memo_details.memo = removed
    await AsyncStorage.mergeItem('memo_details', JSON.stringify(memo_details))
  }
  const memos_str = await AsyncStorage.getItem('memos')
  if (memos_str != null) {
    const memos = JSON.parse(memos_str)
    const removed = memos.memo.filter((m) => m.id !== id)
    memos.memo = removed
    await AsyncStorage.mergeItem('memos', JSON.stringify(memos))
  }
}

export const AddImage = async (memoID: string, path: string) => {
  const memo_details_str = await AsyncStorage.getItem('memo_details')
  if (memo_details_str != null) {
    const memo_details = JSON.parse(memo_details_str)
    const index = memo_details.memo.findIndex((m) => m.id === memoID)
    const info = {
      id: uuid.v4(),
      uri: path
    }
    if (memo_details.memo[index].images == null) {
      memo_details.memo[index].images = []
    }
    memo_details.memo[index].images.push(info)
    await AsyncStorage.mergeItem('memo_details', JSON.stringify(memo_details))
  }
}

export const LoadImage = async (memoID: string, imageID: string): Promise<ImageInfo> => {
  if (imageID.length <= 0) {
    return { id: '', uri: '' }
  }

  console.log(`load image for memo: ${memoID}, image: ${imageID}`)
  const memo = await LoadMemo(memoID)
  if (memo.images != null) {
    const img = memo.images.find((img) => img.id === imageID)
    if (img != null) {
      console.log(`target image: ${JSON.stringify(img)}`)
      return img
    }
  }
  return { id: '', uri: '' }
}

export const RemoveImage = async (memoID: string, imageID: string) => {
  if (imageID.length <= 0) {
    return
  }

  console.log(`delete image for memo: ${memoID}, image: ${imageID}`)
  const memo_details_str = await AsyncStorage.getItem('memo_details')
  const memo_details = JSON.parse(memo_details_str)
  const index = memo_details.memo.findIndex((m) => m.id === memoID)
  if (index < 0) {
    return
  }

  if (memo_details.memo[index].images != null) {
    const removed = []
    memo_details.memo[index].images.forEach((image) => {
      if (image.id !== imageID) {
        removed.push(image)
      }
    })
    memo_details.memo[index].images = removed
    await AsyncStorage.mergeItem('memo_details', JSON.stringify(memo_details))
  }
}

export const Clear = async () => {
  await AsyncStorage.clear()
}

export const AddDummy = async () => {
  await Clear()

  const now = Date.now()
  const memos = {
    memo: [
      {
        id: 'id1',
        title: 'テストデータ1',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'id2',
        title: 'ダミーデータ',
        createdAt: now,
        updatedAt: now
      }
    ]
  }
  await AsyncStorage.setItem('memos', JSON.stringify(memos))

  const memoDetails = {
    memo: [
      {
        id: 'id1',
        text: 'テストデータ1',
        images: []
      },
      {
        id: 'id2',
        text: 'ダミーデータ',
        images: []
      }
    ]
  }
  await AsyncStorage.setItem('memo_details', JSON.stringify(memoDetails))
}

const addMemo = async (title: string, text: string): Promise<string> => {
  const now = Date.now()
  const id = uuid.v4().toString()

  try {
    const memos_str = await AsyncStorage.getItem('memos')
    const memo: MemoListInfo = {
      id: id,
      title: title,
      createdAt: now,
      updatedAt: now
    }
    if (memos_str == null) {
      await AsyncStorage.setItem('memos', JSON.stringify({ memo: [memo] }))
    } else {
      const memos = JSON.parse(memos_str)
      memos.memo.push(memo)
      await AsyncStorage.mergeItem('memos', JSON.stringify(memos))
    }

    const memo_details_str = await AsyncStorage.getItem('memo_details')
    const memo_detail: MemoDetailInfo = {
      id,
      text,
      images: []
    }
    if (memo_details_str == null) {
      await AsyncStorage.setItem('memo_details', JSON.stringify({ memo: [memo_detail] }))
    } else {
      const memo_details = JSON.parse(memo_details_str)
      memo_details.memo.push(memo_detail)
      await AsyncStorage.mergeItem('memo_details', JSON.stringify(memo_details))
    }
  } catch (e) {
    // saving error
    console.log(`Add memo failed: ${e}`)
    return ""
  }

  return id
}
