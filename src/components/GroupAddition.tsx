import * as React from 'react'

import styled from '../styles/theme'
import Button from './Button'
import Input from './Input'

export interface IGroupAdditionProps {
  onConfirm?: (value: string, reset: () => void) => void
}

export interface IGroupAdditionState {
  editing: boolean
  value: string
}

export default class GroupAddition extends React.Component<IGroupAdditionProps, IGroupAdditionState> {

  public state: IGroupAdditionState = {
    editing: false,
    value: '',
  }

  public open = () => {
    this.setState({ editing: true })
  }

  public reset = () => {
    this.setState({ editing: false, value: '' })
  }

  private onValueChange = (value: string) => {
    this.setState({ value })
  }

  private onToggle = () => {
    this.setState({ editing: !this.state.editing, value: '' })
  }

  private onConfirm = () => {
    const { onConfirm } = this.props
    let value = this.state.value.trim()

    if (value && onConfirm) {
      onConfirm(value, this.reset)
    }
  }

  public render () {
    const { value, editing } = this.state

    return (
      <Wrapper>
        {editing ? (
          <Container>
            <Input
              autoFocus
              value={value}
              placeholder='Group Name'
              onChange={this.onValueChange}
              onEnter={this.onConfirm}
            />
            <Button icon='Check' onClick={this.onConfirm}/>
            <Button icon='X' onClick={this.onToggle}/>
          </Container>
        ) : (
          <Button full size='large' onClick={this.onToggle}>Add Group</Button>
        )}
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(() => ({
  width: '100%',
}))

const Container = styled.div(() => ({
  display: 'flex',
  'input': {
    flex: 1,
  },
}))
