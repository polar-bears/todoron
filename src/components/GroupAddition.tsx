import * as React from 'react'
import { useState } from 'react'

import styled from '../styles/styled-components'
import Button from './Button'
import Input from './Input'

export interface IGroupAdditionProps {
  onConfirm?: (value: string, reset: () => void) => void
}

export interface IGroupAdditionState {
  editing: boolean
  value: string
}

function GroupAddition(props: IGroupAdditionProps) {
  const { onConfirm } = props

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')

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
          />
          <Button icon='Check' onClick={confirm} />
          <Button icon='X' onClick={onToggle} />
        </Container>
      ) : (
        <Button full size='large' onClick={onToggle}>
          Add Group
        </Button>
      )}
    </Wrapper>
  )
}

export default GroupAddition

const Wrapper = styled.div(() => ({
  width: '100%'
}))

const Container = styled.div(() => ({
  display: 'flex',
  input: {
    flex: 1
  }
}))
