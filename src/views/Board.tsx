import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react'

import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import ScrollArea from '../components/ScrollArea'
import Sortable from '../components/Sortable'
import TagContext from '../components/TagContext'
import TaskGroup from '../components/TaskGroup'
import styled from '../styles/styled-components'
import { boardStore, taskStore } from '../stores'
import { IGroup, ISortable, ITask } from '../models'

export interface IProps extends RouteComponentProps<{ boardId: string }> { }

export interface IState {
  loading: boolean
}

@observer
export default class Board extends React.Component<IProps, IState> {
  public state: IState = {
    loading: true,
  }

  public componentDidMount () {
    const boardId = Number(this.props.match.params.boardId)

    this.load(boardId)
  }

  public componentDidUpdate (prevProps: IProps, prevState: IState) {
    const boardId = Number(this.props.match.params.boardId)
    const prevBoardId = Number(prevProps.match.params.boardId)

    if (boardId !== prevBoardId) {
      this.load(boardId)
    }
  }

  public componentWillUnmount () {
    boardStore.selectBoard(null)
  }

  private load (boardId: number) {
    boardStore.selectBoard(boardId)

    if (boardStore.selectedBoard) {
      this.setState({ loading: true })

      taskStore.listGroup(boardId)

      this.setState({ loading: false })
    } else {
      this.props.history.push('/')
    }
  }

  private onAddGroup = async (title: string, reset: () => void) => {
    await taskStore.addGroup(boardStore.selectedId!, title)

    reset()
  }

  private onRemoveGroup = async (group: IGroup) => {
    await taskStore.removeGroup(group.id)
  }

  private onEditGroup = async (group: IGroup, title: string) => {
    await taskStore.updateGroup(group.id, { title })
  }

  private onAddTask = async (
    { groupId, content }: any,
    reset: (reopen: boolean) => void, fromShortcut: boolean,
  ) => {
    await taskStore.addTask(groupId, content, '', -1, [])
    reset(fromShortcut)
  }

  private onClickTask = (task: ITask) => {
    this.props.history.push(`/boards/${task.boardId}/task/${task.id}`)
  }

  private onFinishedChange = async (task: ITask) => {
    await taskStore.updateTask(task.id, { finished: !task.finished })
  }

  private async onChangeEnd ({ evt, remoteSortable, sortable }: ISortable) {
    const canMoveGroup = !!evt.item.dataset && evt.item.dataset.hasOwnProperty('type')

    if (!!remoteSortable && remoteSortable.toArray()) {
      await taskStore.moveTask(
        Number(evt.from.dataset.gid),
        Number(evt.to.dataset.gid),
        Number(evt.oldIndex),
        Number(evt.newIndex),
      )
    } else if (evt.from === evt.to) {
      if (canMoveGroup) {
        await taskStore.moveGroup(
          Number(boardStore.selectedId!),
          Number(evt.oldIndex),
          Number(evt.newIndex),
        )
        return
      }
      if (!!evt.item.dataset) {
        await taskStore.moveTask(
          Number(evt.from.dataset.gid),
          Number(evt.to.dataset.gid),
          Number(evt.oldIndex),
          Number(evt.newIndex),
        )
      }
    }

  }

  public renderGroups = ({ groups }: {groups: IGroup[]}) => {

    return (
      <React.Fragment>
        {groups.map((group) =>
          (
            <TaskGroup
              key={group.id}
              group={group}
              onAddTask={this.onAddTask}
              onClickTask={this.onClickTask}
              onFinishedChange={this.onFinishedChange}
              onRemoveGroup={this.onRemoveGroup}
              onEditGroup={this.onEditGroup}
              onSort={this.onChangeEnd}
            />
          ))}
      </React.Fragment>
    )
  }

  public render () {
    const { loading } = this.state
    const { groups } = taskStore

    if (loading) return null

    const GroupsComponent = this.renderGroups

    return (
      <TagContext.Provider value={{ tags: [] }}>
        <ScrollArea direction='horizontal'>
          <Container>
            <Sortable
              options={{ group: 'groups', animation: 150, }}
              onChange={this.onChangeEnd}
              tag={Groups}
            >
              <GroupsComponent groups={groups} />
            </Sortable>
            <Group header={<GroupAddition onConfirm={this.onAddGroup} />} />
          </Container>
        </ScrollArea>
      </TagContext.Provider>
    )
  }
}

const Container = styled.div(() => ({
  padding: '20px 10px 20px 20px',
  height: '100%',
  verticalAlign: 'top',
  flexWrap: 'nowrap',
  display: 'inline-flex',
}))

const Groups = styled.div(() => ({
  display: 'inline-flex',
  alignItems: 'flex-start',
  '& + div': {
    height: '42px',
  },
}))
