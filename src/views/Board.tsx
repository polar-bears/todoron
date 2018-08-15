import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs'
import { tag } from 'rxjs-spy/operators/tag'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'

import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import ScrollArea from '../components/ScrollArea'
import TagContext from '../components/TagContext'
import TaskGroup from '../components/TaskGroup'
import styled from '../styles/theme'
import { IBoard, IGroup, ITag } from '../models'
import { boardViewService } from '../services'

export interface IBoardProps extends RouteComponentProps<{ boardId: string }> { }

export interface IBoardState {
  loading: boolean
  board?: IBoard
  groups: IGroup[]
  tags: ITag[]
}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  public static getDerivedStateFromProps (nextProps: IBoardProps) {
    const boardId = Number(nextProps.match.params.boardId)

    // todo: selected an old id
    boardViewService.getBoard(boardId)

    return null
  }

  private board$!: Subscription

  private groups$!: Subscription

  // private tag$!: Subscription

  public state: IBoardState = {
    loading: true,
    groups: [],
    tags: [],
  }

  public componentDidMount () {
    this.board$ = boardViewService.board$
      .subscribe((board) => this.setState({ board }))

    this.groups$ = boardViewService.groups$
      .pipe(tag('groups$'))
      .subscribe((groups) => this.setState({ groups, loading: false }))
  }

  public componentWillUnmount () {
    this.board$.unsubscribe()
    this.groups$.unsubscribe()
  }

  private onAddGroup = (title: string, reset: () => void) => {
    const boardId = this.state.board!.id

    boardViewService.addGroup(boardId, title, '')

    reset()
  }

  private onAddTask = ({ groupId, content }: any, reset: (reopen: boolean) => void, fromShortcut: boolean) => {
    boardViewService.addTask(groupId, content, '', -1, [])

    reset(fromShortcut)
  }

  private onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (
      !destination ||
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    if (type === 'GROUPS') {
      const boardId = this.state.board!.id
      boardViewService.moveGroup(boardId, source.index, destination.index)
    } else if (type === 'TASKS') {
      boardViewService.moveTask(
        Number(source.droppableId),
        Number(destination.droppableId),
        source.index,
        destination.index,
      )
    }

  }

  public render () {
    const { loading, groups } = this.state

    if (loading) {
      return null
    }

    return (
      <TagContext.Provider value={{ tags: [] }}>
        <Wrapper>
          <Header />
          <ScrollArea direction='horizontal'>
            <Container>
              <DragDropContext
                onDragEnd={this.onDragEnd}
              >
                <Droppable
                  droppableId='board'
                  type='GROUPS'
                  direction='horizontal'
                >
                  {(provided: DroppableProvided) => (
                    <Inner innerRef={provided.innerRef} {...provided.droppableProps}>
                      {groups.map((group, index) => (
                        <TaskGroup
                          key={group.id}
                          group={group}
                          index={index}
                          onAddTask={this.onAddTask}
                        />
                      ))}
                    </Inner>
                  )}
                </Droppable>
              </DragDropContext>
              <Group header={<GroupAddition onConfirm={this.onAddGroup} />} />
            </Container>
          </ScrollArea>
        </Wrapper>
      </TagContext.Provider>
    )
  }
}

const Wrapper = styled.div(() => ({
  position: 'relative',
  height: '100%',
  padding: '0px',
}))

const Header = styled.div()

const Container = styled.div(() => ({
  padding: '20px 20px 50px',
  height: '100%',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',

  '& > div': {
    whiteSpace: 'normal',
  },
}))

const Inner = styled.div(() => ({
  display: 'inline-flex',
}))
