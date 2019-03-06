import * as React from 'react'
import { Route, RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Switch } from 'react-router-dom'

import Groups from '../components/Groups'
import ScrollArea from '../components/ScrollArea'
import TagContext from '../components/TagContext'
import styled from '../styles/styled-components'
import TaskView from './TaskView'
import { default as BoardStore } from '../stores/BoardStore'
import { default as TaskStore } from '../stores/TaskStore'

export interface Props extends RouteComponentProps<{ boardId: string }> {}

export default observer(function BoardView (props: Props) {
  const boardStore = React.useContext(BoardStore)
  const taskStore = React.useContext(TaskStore)

  const boardId = Number(props.match.params.boardId)

  React.useEffect(() => {
    if (boardStore.selectedBoard) {
      taskStore.listGroup(boardId)
    } else {
      props.history.push('/')
    }

    return () => {
      // boardStore.selectBoard(null)
    }
  }, [boardId])

  return (
    <TagContext.Provider value={{ tags: [] }}>
      <ScrollArea direction='horizontal'>
        <Container>
          <Groups />
        </Container>
      </ScrollArea>
      {/* <Switch>
        <Route
          path='/boards/:boardId/task/:taskId'
          component={(routeProps: any) => <TaskView {...routeProps} />}
        />
      </Switch> */}
    </TagContext.Provider>
  )
})

const Container = styled.div(() => ({
  padding: '20px 10px 20px 20px',
  verticalAlign: 'top',
  flexWrap: 'nowrap',
  display: 'inline-flex'
}))
