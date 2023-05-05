import React from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import { Dialog } from 'react-native-paper'

export const DeleteDialog = ({ visible, cancel, deleteFunc }) => (
  <Dialog visible={visible} onDismiss={cancel}>
    <Dialog.Title>削除</Dialog.Title>
    <Dialog.Content>
      <Text>本当に削除しますか？</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button
        type="clear"
        onPress={cancel}
        title="キャンセル"
      />
      <Button
        onPress={deleteFunc}
        title="削除"
      />
    </Dialog.Actions>
  </Dialog>
)
