import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs'
import { tag } from 'rxjs-spy/operators/tag'
import { DragDropContext, Draggable, DraggableLocation, DragStart, Droppable, DropResult } from 'react-beautiful-dnd'

import Button from '../components/Button'
import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import ScrollArea from '../components/ScrollArea'
import TagContext from '../components/TagContext'
import TaskAddition from '../components/TaskAddition'
import TaskCard from '../components/TaskCard'
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

  private reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
  
    return result
  }

  private onDragStart = (initial: DragStart) => { 
    // todo: auto height
  }

  private onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const source: DraggableLocation = result.source
    const destination: DraggableLocation = result.destination

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    if (result.type === 'GROUP') {
      groupService.moveGroup(+result.draggableId, source.index, destination.index)
    } else if (result.type === 'TASK') {
      groupService.moveTask(+result.draggableId, +source.droppableId,
        +destination.droppableId, source.index, destination.index)
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
            <DragDropContext
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}
            >
            <ScrollArea direction='horizontal'>
              <Droppable
                droppableId='board'
                type='GROUP'
                direction='horizontal'
              >
              {(provided, snapshot) => (
                  <Container
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {
                      groups.map((group, index) => (
                        <Draggable
                          key={group.id}
                          draggableId={group.id + ''}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Group
                                {...provided.dragHandleProps}
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
                                <Droppable
                                  droppableId={group.id + ''}
                                  type='TASK'
                                >
                                  {(dropProvided, dropSnapshot) => (
                                    <div
                                      ref={dropProvided.innerRef}
                                      {...dropProvided.droppableProps}
                                    >
                                      {group.tasks.map((task, index) => (
                                        <Draggable
                                          key={task.id}
                                          index={index}
                                          draggableId={task.id + ''}
                                        >
                                          {(dropProvided, dropSnapshot) => (
                                            <TaskCardWrapper
                                              isDragging={dropSnapshot.isDragging}
                                              innerRef={dropProvided.innerRef}
                                              {...dropProvided.draggableProps}
                                              {...dropProvided.dragHandleProps}
                                            >
                                              <TaskCard key={task.id} task={task} />
                                            </TaskCardWrapper>
                                          )}
                                        </Draggable>
                                      ))}
                                      {dropProvided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </Group>
                            </div>
                          )}
                        </Draggable>
                      ))
                    }
                    <AdditionWrapper>
                      <GroupAddition onConfirm={this.onAddGroup} />
                    </AdditionWrapper>
                  </Container>
                )}
              </Droppable>
              </ScrollArea>
            </DragDropContext>
        </Wrapper>
      </TagContext.Provider>
    )
  }

}

const Wrapper = styled.div(() => ({
  position: 'relative',
  height: '100%',
}))

const AdditionWrapper = styled.div(({ theme }) => ({
  width: '300px',
  height: '42px',
  background: theme.bg,
  boxShadow: theme.boxShadow,
}))

const Header = styled.div()
const TaskCardWrapper = styled.div<{ isDragging: boolean }>(({ isDragging }) => ({
  background: '#eee',
  marginBottom: '10px',
}))

const Container = styled.div(() => ({
  padding: '20px 20px 50px',
  height: '100%',
  display: 'flex',
  whiteSpace: 'nowrap',

  '& > div': {
    whiteSpace: 'normal',
  },
}))
