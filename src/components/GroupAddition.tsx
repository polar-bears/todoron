import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'
import Button from './Button'
import Input from './Input'

export interface Props {
  onConfirm?: (value: string, reset: () => void) => void
}

export default function GroupAddition (props: Props) {
  const { onConfirm = noop } = props

  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState('')

  const onInputValue = (newVal: string) => {
    setValue(newVal)
  }

  const confirm = () => {
    if (value.trim() && onConfirm) {
      onConfirm(value, () => {
        setEditing(false)
        setValue('')
      })
    }
  }

  const onToggle = () => {
    setEditing(!editing)
    setValue('')
  }

  return (
    <Wrapper>
      {editing ? (
        <Container>
          <Input
            autoFocus
            value={value}
            placeholder='Group Name'
            onEnter={confirm}
            onChange={onInputValue}
          />
          <Button size='small' icon='Check' onClick={confirm} />
          <Button size='small' icon='X' onClick={onToggle} />
        </Container>
      ) : (
        <AddButton full size='large' onClick={onToggle}>
          Add Group
        </AddButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div(() => ({
  width: '300px'
}))

const Container = styled.div(({ theme }) => ({
  background: theme.bg,
  marginRight: '10px',
  padding: '0 10px',
  verticalAlign: 'top',
  display: 'flex',
  alignItems: 'center',
  input: {
    flex: 1
  }
}))

const AddButton = styled(Button)(({ theme }) => ({
  background: theme.bg,
  boxShadow: theme.boxShadow
}))
