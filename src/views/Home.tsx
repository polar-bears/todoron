import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { Subscription } from 'rxjs'
import { tag } from 'rxjs-spy/operators'

import BoardItem from '../components/BoardItem'
import Button from '../components/Button'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Logo from '../components/Logo'
import SidePanel from '../components/SidePanel'
import TopBar from '../components/TopBar'
import styled from '../styles/theme'
import Board from './Board'
import { IBoard } from '../models'
import { boardViewService, homeViewService } from '../services'

export interface IHomeProps extends RouteComponentProps<{}> {}

export interface IHomeState {
  loading: boolean
  expanded: boolean
  adding: boolean
  addingTitle: string
  boards: IBoard[]
  board?: IBoard
}

export default class Home extends React.Component<IHomeProps, IHomeState> {

  private refAddingInput = React.createRef<Input>()

  private boards$!: Subscription

  private board$!: Subscription

  public state: IHomeState = {
    loading: true,
    expanded: false,
    adding: false,
    addingTitle: '',
    boards: [],
  }

  public componentDidMount () {
    this.boards$ = homeViewService.boards$
      .pipe(tag('boards$'))
      .subscribe((boards) => this.setState({ boards, loading: false }))

    this.board$ = boardViewService.board$
      .pipe(tag('board$'))
      .subscribe((board) => this.setState({ board }))

    homeViewService.listBoards()
  }

  public componentWillUnmount () {
    this.boards$.unsubscribe()
    this.board$.unsubscribe()
  }

  private onToggleSidePanel = () => {
    this.setState({ expanded: !this.state.expanded, adding: false })
  }

  private onToggleAdding = () => {
    const visible = !this.state.adding
    const $input = this.refAddingInput.current
    
    this.setState({ adding: visible, addingTitle: '' })

    if (visible && $input) {
      $input.focus()
    }
  }

  private onAddingTitleChange = (value: string) => {
    this.setState({ addingTitle: value })
  }

  private onAddingConfirm = async () => {
    const title = this.state.addingTitle.trim()

    await homeViewService.addBoard(title)
    this.setState({ adding: false, addingTitle: '' })
  }

  private onBoardClick = (board: IBoard) => {
    this.props.history.push(`/boards/${board.id}`)
  }

  public render () {
    const { loading, expanded, adding, addingTitle, boards, board } = this.state

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
                  icon={adding ? 'Minus' : 'Plus'}
                  onClick={this.onToggleAdding}
                />
              </React.Fragment>
            )}
            headerExtra={(
              <Addition visible={adding}>
                <Icon name='Inbox'/>
                <Input
                  full
                  ref={this.refAddingInput}
                  size='small'
                  value={addingTitle}
                  onChange={this.onAddingTitleChange}
                  onEnter={this.onAddingConfirm}
                />
                <Button
                  size='small'
                  icon='Check'
                  disabled={!addingTitle.trim()}
                  onClick={this.onAddingConfirm}
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
