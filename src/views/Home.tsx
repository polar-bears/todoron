import * as React from 'react'
import { Route, RouteComponentProps, Redirect, Switch } from 'react-router'
import { create } from 'rxjs-spy'
import { tag } from 'rxjs-spy/operators/tag'

import styled from '../styles/theme'
import Board from './Board'
import TopBar from '../components/TopBar'
import Logo from '../components/Logo'
import Button from '../components/Button'
import SidePanel from '../components/SidePanel'
import BoardItem from '../components/BoardItem'
import { IBoard } from '../models'
import boardService from '../services/boardService'
import Input from '../components/Input'
import Icon from '../components/Icon'
import { Subscription } from 'rxjs'

const spy = create()

spy.log('boards$')
spy.log('board$')

export interface IHomeProps extends RouteComponentProps<{}> {}

export interface IHomeState {
  loading: boolean
  expanded: boolean
  additionVisible: boolean
  additionContent: string
  boards: IBoard[]
  board: IBoard | null
}

export default class Home extends React.Component<IHomeProps, IHomeState> {

  public refAdditionInput = React.createRef<Input>()

  public boards$!: Subscription

  public board$!: Subscription

  public state: IHomeState = {
    loading: true,
    expanded: false,
    additionVisible: false,
    additionContent: '',
    boards: [],
    board: null,
  }

  public componentDidMount () {
    this.boards$ = boardService.boards$
      .pipe(tag('boards$'))
      .subscribe((boards) => this.setState({ loading: false, boards }))

    this.board$ = boardService.board$
      .pipe(tag('board$'))
      .subscribe((board) => this.setState({ board }))

    boardService.loadBoards()
    
  }

  public componentWillUnmount () {
    this.boards$.unsubscribe()
    this.board$.unsubscribe()
  }

  public onToggleSidePanel = () => {
    this.setState({ expanded: !this.state.expanded, additionVisible: false })
  }

  public onToggleAddition = () => {
    const visible = !this.state.additionVisible
    const $input = this.refAdditionInput.current
    
    this.setState({ additionVisible: visible, additionContent: '' })

    if (visible && $input) {
      $input.focus()
    }
  }

  public onAdditionContentChange = (value: string) => {
    this.setState({ additionContent: value })
  }

  public onAdditionConfirm = async () => {
    const title = this.state.additionContent.trim()

    await boardService.addBoard(title)
    this.setState({ additionVisible: false, additionContent: '' })
  }

  public onBoardClick = (board: IBoard) => {
    this.props.history.push(`/boards/${board.id}`)
  }

  public render () {
    const { loading, expanded, additionVisible, additionContent, boards, board } = this.state

    if (loading) {
      return null
    }

    return (
      <Wrapper>
        <TopBar
          header={(
            <React.Fragment>
              <Button
                size='large'
                icon={expanded ? 'ArrowLeft' : 'Menu'}
                onClick={this.onToggleSidePanel}
              />
            </React.Fragment>
          )}
        >
          <Logo/>
        </TopBar>
        <Container expanded={expanded}>
          <SidePanel
            expanded={expanded}
            header={(
              <React.Fragment>
                <SidePanelTitle>Boards ({boards.length})</SidePanelTitle>
                <Button
                  size='large'
                  icon={additionVisible ? 'Minus' : 'Plus'}
                  onClick={this.onToggleAddition}
                />
              </React.Fragment>
            )}
            headerExtra={(
              <Addition visible={additionVisible}>
                <Icon name='Inbox'/>
                <Input
                  full
                  ref={this.refAdditionInput}
                  size='small'
                  value={additionContent}
                  onChange={this.onAdditionContentChange}
                  onEnter={this.onAdditionConfirm}
                />
                <Button
                  size='small'
                  icon='Check'
                  disabled={!additionContent.trim()}
                  onClick={this.onAdditionConfirm}
                />
              </Addition>
            )}
          >
            {boards.map((b) => (
              <BoardItem
                key={b.id}
                board={b}
                active={!!board && board.id === b.id}
                onClick={this.onBoardClick}
              />
            ))}
          </SidePanel>
          <Switch>
            <Route path='/boards/:boardId' component={Board}/>
            <Redirect to={`/boards/${boards[0].id}`}/>
          </Switch>
        </Container>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingTop: '60px',
  height: '100%',
  color: theme.fg,
  background: theme.bgLight,
}))

const Container = styled.div<{expanded: boolean}>(({ expanded }) => ({
  paddingLeft: expanded ? '300px' : 0,
  position: 'relative',
  height: '100%',
  transition: 'padding-left 0.3s ease',
}))

const SidePanelTitle = styled.div(() => ({
  flex: 1,
}))

const Addition = styled.div<{visible: boolean}>(({ theme, visible }) => ({
  marginTop: visible ? 0 : '-1px',
  padding: '0 15px',
  display: 'flex',
  alignItems: 'center',
  height: visible ? '36px' : 0,
  borderBottom: theme.border,
  overflow: visible ? 'visible' : 'hidden',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease, height 0.3s ease',
  'input': {
    margin: '0 10px',
    flex: 1,
  },
}))
