import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import BoardItem from '../components/BoardItem'
import Button from '../components/Button'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Logo from '../components/Logo'
import SidePanel from '../components/SidePanel'
import TextArea from '../components/Textarea'
import TopBar from '../components/TopBar'
import styled from '../styles/styled-components'
import { boardStore } from '../stores'

export interface Props extends RouteComponentProps<{}> {}

export default function MainView (props: Props) {
  const [expanded, setExpanded] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [addingTitle, setAddingTitle] = React.useState('')

  const onToggleSidePanel = React.useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const onToggleAdding = React.useCallback(() => {
    setEditing(!editing)
    setFocused(!focused)
    setAddingTitle('')
  }, [editing, focused])

  const onAddingTitleChange = React.useCallback((value: string) => {
    setAddingTitle(value)
  }, [addingTitle])

  const onAddingConfirm = React.useCallback(async () => {
    await boardStore.addBoard(addingTitle.trim())
    setEditing(false)
    setAddingTitle('')
  }, [editing, addingTitle])

  const { boards, selectedBoard: board } = boardStore

  const onBoardClick = React.useCallback(() => {
    props.history.push(`/boards/${board!.id}`)
  }, [board])

  React.useEffect(() => { boardStore.listBoards() }, [boardStore])

  if (!boards) return null

  return (
    <Wrapper>
      <TopBar
        header={
          <Button
            size='large'
            icon={expanded ? 'ArrowLeft' : 'Menu'}
            onClick={onToggleSidePanel}
          />
        }
      >
        <Logo />
      </TopBar>
      <Container expanded={expanded}>
        <SidePanel
          expanded={expanded}
          header={
            <React.Fragment>
              <SidePanelTitle>Boards ({boards.length})</SidePanelTitle>
              <Button
                size='large'
                icon={editing ? 'Minus' : 'Plus'}
                onClick={onToggleAdding}
              />
            </React.Fragment>
          }
          headerExtra={
            <Addition visible={editing}>
              <Icon name='Inbox' />
              <Input
                size='small'
                value={addingTitle}
                autoFocus={focused}
                onEnter={onAddingConfirm}
                onChange={onAddingTitleChange}
              />
              <Button
                size='small'
                icon='Check'
                disabled={!addingTitle.trim()}
                onClick={onAddingConfirm}
              />
            </Addition>}
        >
          {boards.map((b) => (
            <BoardItem
              key={b.id}
              board={b}
              active={!!board && board.id === b.id}
              onClick={onBoardClick}
            />
          ))}
        </SidePanel>
        {/* <Switch>
          <Route path='/boards/:boardId' component={Board} />
          <Redirect to={`/boards/${boards[0].id}`} />
        </Switch> */}
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingTop: '60px',
  height: '100%',
  color: theme.fg,
  background: theme.bgLight
}))

const Container = styled.div<{ expanded: boolean }>(({ expanded }) => ({
  paddingLeft: expanded ? '300px' : 0,
  position: 'relative',
  height: '100%',
  transition: 'padding-left 0.3s ease'
}))

const SidePanelTitle = styled.div(() => ({
  flex: 1
}))

const Addition = styled.div<{ visible: boolean }>(({ theme, visible }) => ({
  marginTop: visible ? 0 : '-1px',
  padding: '0 15px',
  display: 'flex',
  alignItems: 'center',
  height: visible ? '36px' : 0,
  borderBottom: theme.border,
  overflow: visible ? 'visible' : 'hidden',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease, height 0.3s ease',
  input: {
    margin: '0 10px',
    flex: 1
  }
}))
