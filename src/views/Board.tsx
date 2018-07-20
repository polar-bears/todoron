import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs'
import { tag } from 'rxjs-spy/operators/tag'

import Button from '../components/Button'
import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import TagContext from '../components/TagContext'
import TaskAddition from '../components/TaskAddition'
import TaskCard from '../components/TaskCard'
import boardService from '../services/boardService'
import groupService from '../services/groupService'
import styled from '../styles/theme'
import { IBoard, IGroup, ITag } from '../models'

export interface IBoardProps extends RouteComponentProps<{boardId: string}> {}

export interface IBoardState {
  loading: boolean
  board: IBoard | null
  groups: IGroup[]
  tags: ITag[]
}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  public static getDerivedStateFromProps (nextProps: IBoardProps) {
    const boardId = Number(nextProps.match.params.boardId)
    
    // todo: selected an old id
    boardService.selectBoard(boardId)

    return null
  }

  private board$!: Subscription

  private groups$!: Subscription

  private tag$!: Subscription

  public state: IBoardState = {
    board: null,
    loading: true,
    groups: [],
    tags: [],
  }

  public componentDidMount () {
    this.board$ = boardService.board$
      .subscribe((board) => this.setState({ board }))

    this.groups$ = groupService.groups$
      .pipe(tag('groups$'))
      .subscribe((groups) => this.setState({ groups, loading: false }))
  }

  public componentWillUnmount () {
    this.groups$.unsubscribe()
  }

  private onAddGroup = (title: string, reset: () => void) => {
    const boardId = this.state.board!.id

    groupService.addGroup(boardId, title, '')

    reset()
  }

  private onAddTask = ({ groupId, content }: any, reset: (reopen: boolean) => void, fromShortcut: boolean) => {
    groupService.addTask(groupId, content, '', -1, [])

    reset(fromShortcut)
  }

  public render () {
    const { loading, groups } = this.state

    if (loading) {
      return null
    }

    return (
      <TagContext.Provider value={{ tags: [] }}>
        <Wrapper>
          <Header/>
          <Container>
            {groups.map((group) => (
              <Group
                key={group.id}
                title={`${group.title} (${group.tasks.length})`}
                actions={(
                  <React.Fragment>
                    <Button size='small' icon='MoreVertical'/>
                  </React.Fragment>
                )}
                footer={(
                  <TaskAddition groupId={group.id} onConfirm={this.onAddTask}/>
                )}
              >
              {group.tasks.map((task) => (
                <TaskCard key={task.id} task={task}/>
              ))}
              </Group>
            ))}
            <Group header={<GroupAddition onConfirm={this.onAddGroup}/>}/>
          </Container>
        </Wrapper>
      </TagContext.Provider>
    )
  }

}

const Wrapper = styled.div(() => ({
  position: 'relative',
  height: '100%',
}))

const Header = styled.div()

const Container = styled.div(() => ({
  padding: '20px 20px 50px',
  height: '100%',
  overflowX: 'scroll',
  whiteSpace: 'nowrap',
  '& > div': {
    whiteSpace: 'normal',
  },
}))
