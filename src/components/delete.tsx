import React from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-elements'
import { Dialog } from 'react-native-paper'

type Props = {
  visible: boolean
  onCancel: () => void
  onDelete: () => void
}

export const DeleteDialog: React.FC<Props> = ({ visible, onCancel, onDelete }) => (
  <Dialog visible={visible} onDismiss={onCancel}>
    <Dialog.Title>削除</Dialog.Title>
    <Dialog.Content>
      <Text>本当に削除しますか？</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button
        type="clear"
        onPress={onCancel}
        title="キャンセル"
      />
      <Button
        onPress={onDelete}
        title="削除"
      />
    </Dialog.Actions>
  </Dialog>
)
