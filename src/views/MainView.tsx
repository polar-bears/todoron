import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { observer } from 'mobx-react-lite'

import BoardItem from '../components/BoardItem'
import Button from '../components/Button'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Logo from '../components/Logo'
import SidePanel from '../components/SidePanel'
import TopBar from '../components/TopBar'
import styled from '../styles/styled-components'
import BoardView from './BoardView'
import { default as BoardStore } from '../stores/BoardStore'
import { IBoard } from '../models'

export interface Props extends RouteComponentProps<{}> {}

export default observer(function MainView (props: Props) {
  const store = React.useContext(BoardStore)
  let { boards, selectedBoard: board } = store

  const [expanded, setExpanded] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [boardEditing, setBoardEditing] = React.useState(false)
  const [addingTitle, setAddingTitle] = React.useState('')

  React.useEffect(() => {
    store.listBoards()
    const id = Number(props.location.pathname.substr(8))
    if (!isNaN(id)) {
      store.selectBoard(id)
    }
  }, [])

  const onToggleSidePanel = React.useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const onToggleAdding = React.useCallback(() => {
    setEditing(!editing)
    setFocused(!focused)
    setAddingTitle('')
  }, [editing, focused])

  const onAddingTitleChange = React.useCallback(
    (value: string) => {
      setAddingTitle(value)
    },
    []
  )

  const onAddingConfirm = React.useCallback(async () => {
    if (addingTitle.trim() === '') return

    setEditing(false)
    setFocused(false)
    setAddingTitle('')
    await store.addBoard(addingTitle.trim())
    props.history.push(`/boards/${store.selectedId}`)
  }, [addingTitle])

  const onBoardClick = React.useCallback((selectedBoard: IBoard) => {
    store.selectBoard(selectedBoard.id)
    props.history.push(`/boards/${selectedBoard.id}`)
  }, [])

  const onBoardEdit = React.useCallback(
    (boardId: number, newValue: string) => {
      if (newValue === '') {
        setBoardEditing(!boardEditing)

        return
      }
      setBoardEditing(!boardEditing)
      store.updateBoard(boardId, { title: newValue })
    },
    [boardEditing]
  )

  const onBoardDel = React.useCallback((boardId: number) => {
    if (store.boards.length === 1) return

    const index = store.boards.findIndex((b) => b.id === boardId)
    // console.log('index', index, boardId)
    let id
    if (index === 0) {
      id = store.boards[index + 1].id
      store.selectBoard(id)
      // console.log(store.boards[index + 1].id, 'index === 0')
    } else if (index === (store.boards.length - 1)) {
      id = store.boards[index - 1].id
      store.selectBoard(id)
      // console.log(id, 'index === store.boards.length')
    } else {
      id = store.boards[index + 1].id
      store.selectBoard(id)
      // console.log(id, 'lll')
    }

    store.removeBoard(boardId)
    props.history.push(`/boards/${id}`)
  }, [])

  const onToggleEditBoard = React.useCallback(() => {
    setBoardEditing(!boardEditing)
  }, [boardEditing])

  if ((boards && boards.length <= 0) || !board) {
    return null
  }

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
              active={board!.id === b.id}
              editing={boardEditing && board!.id === b.id}
              onClick={onBoardClick}
              onEdit={onBoardEdit}
              onDelete={onBoardDel}
              onToggleEditBoard={onToggleEditBoard}
            />
          ))}
        </SidePanel>
        <Switch>
          <Route
            path='/boards/:boardId'
            component={(routeProps: any) => <BoardView {...routeProps} />}
          />
          <Redirect to={`/boards/${board!.id}`} />
        </Switch>
      </Container>
    </Wrapper>
  )
})

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
  padding: '0 15px',
  alignItems: 'center',
  marginTop: visible ? 0 : '-1px',
  display: visible ? 'flex' : 'none',
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
