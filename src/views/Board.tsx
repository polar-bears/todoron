import * as React from 'react'

import styled from '../styles/theme'
import Group from '../components/Group'
import Button from '../components/Button'
import TaskCard from '../components/TaskCard'
import TagContext from '../components/TagContext'
import boardService from '../services/boardService'
import { RouteComponentProps } from 'react-router'

export interface IBoardProps extends RouteComponentProps<{boardId: string}> {}

export interface IBoardState {}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  public static getDerivedStateFromProps (nextProps: IBoardProps) {
    const boardId = Number(nextProps.match.params.boardId)

    boardService.selectBoard(boardId)
    return null
  }

  public constructor (props: IBoardProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const task = {
      id: 0,
      boardId: 0,
      groupId: 0,
      content: 'Asset support for functional components',
      contentHtml: '',
      finished: false,
      finishedAt: 0,
      createdAt: 0,
      DueAt: 0,
      tagIds: [],
    }

    const tags: any[] = []

    return (
      <TagContext.Provider value={{ tags }}>
        <Wrapper>
          <Header/>
          <Container>
            <Group
              title='Issues (3)'
              actions={(
                <React.Fragment>
                  <Button size='small' icon='MoreVertical'/>
                </React.Fragment>
              )}
            >
            <TaskCard task={task}/>
            <TaskCard task={task}/>
            <TaskCard task={task}/>
            <TaskCard task={task}/>
            </Group>
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
}))
