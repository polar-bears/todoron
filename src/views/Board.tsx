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
import boardService from '../services/boardService'
import groupService from '../services/groupService'
import styled from '../styles/theme'
import { IBoard, IGroup, ITag } from '../models'

export interface IBoardProps extends RouteComponentProps<{ boardId: string }> { }

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

  // private tag$!: Subscription

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
    this.board$.unsubscribe()
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

  private onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (
      !destination ||
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    if (type === 'GROUPS') {
      const boardId = this.state.board!.id
      groupService.moveGroup(boardId, source.index, destination.index)
    } else if (type === 'TASKS') {
      groupService.moveTask(
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
