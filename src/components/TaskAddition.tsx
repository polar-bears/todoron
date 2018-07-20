import * as React from 'react'

import styled from '../styles/theme'
import Button from './Button'
import Card from './Card'
import TagContext from './TagContext'
import Textarea from './Textarea'
import { ITag } from '../models'

type ConfirmData = {
  groupId: number,
  content: string,
}

export interface ITaskAdditionContext {
  tags: ITag[]
}

export interface ITaskAdditionProps {
  groupId: number
  onConfirm?: (data: ConfirmData, reset: (reopen?: boolean) => void, fromShortcut: boolean) => void
}

export interface ITaskAdditionState {
  editing: boolean
  content: string
}

const defaultState: ITaskAdditionState = {
  editing: false,
  content: '',
}

class OriginalTaskAddition extends React.Component<ITaskAdditionProps & ITaskAdditionContext, ITaskAdditionState> {

  public state: ITaskAdditionState = {
    editing: false,
    content: '',
  }

  public open = () => {
    this.setState({ editing: true })
  }

  public reset = (editing: boolean = false) => {
    this.setState({ ...defaultState, editing })
  }

  private onContentChange = (content: string) => {
    this.setState({ content })
  }

  private onToggle = () => {
    this.setState({ ...defaultState, editing: !this.state.editing })
  }

  private onConfirm = () => {
    const { groupId, onConfirm } = this.props
    let content = this.state.content.trim()

    if (content && onConfirm) {
      onConfirm({ groupId, content }, this.reset, false)
    }
  }

  private onKeyUp = (e: React.KeyboardEvent<any>) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      const { groupId, onConfirm } = this.props
      let content = this.state.content.trim()

      if (content && onConfirm) {
        onConfirm({ groupId, content }, this.reset, true)
      }
    }
  }

  public render () {
    const { editing, content } = this.state

    if (!editing) {
      return (
        <Button full onClick={this.onToggle}>Add Task</Button>
      )
    }

    return (
      <StyledCard>
        <Textarea
          autoFocus
          rows={3}
          limit={1000}
          value={content}
          placeholder='Task Content'
          onChange={this.onContentChange}
          onKeyUp={this.onKeyUp}
        />
        <Actions>
          <Button size='small' icon='Check' onClick={this.onConfirm}/>
          <Button size='small' icon='X' onClick={this.onToggle}/>
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

}

export default function TaskAddition (props: ITaskAdditionProps) {
  return (
    <TagContext.Consumer>
      {(context) => (
        <OriginalTaskAddition {...context} {...props}/>
      )}
    </TagContext.Consumer>
  )
}

const StyledCard = styled(Card)(() => ({
  marginBottom: '10px',
  marginLeft: '10px',
  marginRight: '10px',
}))

const Actions = styled.div(() => ({
  marginTop: '5px',
  display: 'flex',
  alignItems: 'center',
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
