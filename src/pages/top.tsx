import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import { Header, Overlay, Button, Icon, ListItem } from 'react-native-elements'
import { DeleteDialog } from '../components/delete'
import { LoadMemoList, AddDummy, Clear, MemoListInfo, RemoveMemo } from '../store'
import { ENABLE_DEV_FEATURE } from '../env'

export const Top = ({ navigation }) => {
  const [memos, setMemos] = useState<MemoListInfo[]>([])
  const [deleteID, setDeleteID] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const m = await LoadMemoList()
      setMemos(m)
    })

    return unsubscribe
  }, [navigation])

  const goMemo = (id: string | null) => {
    if (id != null) {
      console.log(`Edit ${id}`)
    } else {
      console.log('Create new memo')
    }
    navigation.navigate('Memo', { id })
  }

  return (
    <View style={styles.container}>
      <TopHeader />

      {ENABLE_DEV_FEATURE && (
        <View>
          <Button
            title="Clear"
            onPress={
              async () => {
                await Clear()
                setMemos([])
              }
            }
          />

          <Button
            title="AddDummy"
            onPress={
              async () => {
                await AddDummy()
                const m = await LoadMemoList()
                setMemos(m)
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

      <DeleteDialog
        visible={deleteID != null}
        onCancel={() => { setDeleteID(null) }}
        onDelete={
          async () => {
            console.log(`Delete target: ${deleteID}`)
            await RemoveMemo(deleteID)
            setDeleteID(null)
            const m = await LoadMemoList()
            setMemos(m)
          }
        }
      />
    </View>
  )
}

const TopHeader = () => {
  const [menuShow, setMenuShow] = useState<boolean>(false)
  const toggleMenu = () => {
    setMenuShow(!menuShow)
  }

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
  )
}

const MemoList = ({ memos, goMemo, setDeleteID }) => (
  <View style={styles.list}>
    <FlatList
      data={memos}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <ListItem bottomDivider onPress={() => goMemo(item.id)} onLongPress={() => { setDeleteID(item.id) }}>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{formatDate(item.updatedAt)}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafa',
    alignItems: 'center'
  },
  list: {
    flex: 1,
    width: '90%'
  },
  admob: {
    margin: 10
  }
})

const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}/${(`0${d.getMonth() + 1}`).slice(-2)}/${(`0${d.getDate()}`).slice(-2)} ${(`0${d.getHours()}`).slice(-2)}:${(`0${d.getMinutes()}`).slice(-2)}:${(`0${d.getSeconds()}`).slice(-2)}`
}
