import * as React from 'react'
import { useState } from 'react'

import styled from '../styles/styled-components'
import Button from './Button'
import Card from './Card'
import TagContext from './TagContext'
import Textarea from './Textarea'
import { ITag } from '../models'

export type ConfirmData = {
  groupId: number
  content: string
}

export interface ITaskAdditionContext {
  tags: ITag[]
}

export interface ITaskAdditionProps {
  groupId: number
  onConfirm?: (
    data: ConfirmData,
    reset: (reopen?: boolean) => void,
    fromShortcut: boolean
  ) => void
}

export interface ITaskAdditionState {
  editing: boolean
  content: string
}

function OriginalTaskAddition(
  props: ITaskAdditionProps & ITaskAdditionContext
) {
  const { groupId, onConfirm } = props

  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState('')

  const reset = (editing: boolean = false) => {
    setContent('')
    setEditing(editing)
  }

  const onContentChange = (content: string) => {
    setContent(content)
  }

  const onToggle = () => {
    setContent('')
    setEditing(!editing)
  }

  const confirm = () => {
    if (content.trim() && onConfirm) {
      onConfirm({ groupId, content }, reset, false)
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<any>) => {
    if (e.keyCode === 13 && e.ctrlKey && content.trim() && onConfirm) {
      onConfirm({ groupId, content: content.trim() }, reset, true)
    }
  }

  if (!editing) {
    return (
      <Button full onClick={onToggle}>
        Add Task
      </Button>
    )
  }

  return (
    <StyledCard as={Card}>
      <Textarea
        autoFocus
        rows={3}
        limit={1000}
        value={content}
        placeholder='Task Content'
        onChange={onContentChange}
        onKeyUp={onKeyUp}
      />
      <Actions>
        <Button size='small' icon='Check' onClick={confirm} />
        <Button size='small' icon='X' onClick={onToggle} />
      </Actions>
      {/* <Header>
          <Title>
            <Checkbox/>
            <DateInfo>Created at 5 minutes ago</DateInfo>
          </Title>
          <Tag color='#82C788'>NORMAL</Tag>
        </Header>
        <Container>{task.content}</Container>
        <Footer>
          <DueTime overdue>
            <DueTimeIcon size='small' name='Clock'/>
            <DueTimeDetail>
              Today at 10:00 am
            </DueTimeDetail>
          </DueTime>
        </Footer> */}
    </StyledCard>
  )
}

export default function TaskAddition(props: ITaskAdditionProps) {
  return (
    <TagContext.Consumer>
      {(context) => <OriginalTaskAddition {...context} {...props} />}
    </TagContext.Consumer>
  )
}

const StyledCard = styled.div(() => ({
  margin: '10px'
}))

const Actions = styled.div(() => ({
  marginTop: '5px',
  display: 'flex',
  alignItems: 'center'
}))

// const Header = styled.div(() => ({
//   marginBottom: '8px',
//   display: 'flex',
// }))

// const Title = styled.div(() => ({
//   flex: 1,
//   alignItems: 'middle',
// }))

// const DateInfo = styled.span(({ theme }) => ({
//   fontSize: '12px',
//   color: theme.fgLight,
//   verticalAlign: 'text-bottom',
//   userSelect: 'none',
// }))

// const Container = styled.div(() => ({
//   fontSize: '13px',
//   overflow: 'hidden',
// }))

// const Footer = styled.div(() => ({
//   marginTop: '8px',
// }))

// const DueTime = styled.span<{overdue: boolean}>(({ theme, overdue }) => ({
//   color: overdue ? theme.colors.red : theme.fg,
//   userSelect: 'none',
// }))

// const DueTimeIcon = styled(Icon)(() => ({
//   verticalAlign: 'middle',
// }))

// const DueTimeDetail = styled.span(() => ({
//   marginLeft: '5px',
//   verticalAlign: 'middle',
//   fontSize: '12px',
// }))
