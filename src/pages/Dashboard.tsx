import * as React from 'react'

import styled from '../styles/theme'
import Group from '../components/Group'
import Button from '../components/Button'
import TaskCard from '../components/TaskCard'
import TagContext from '../components/TagContext'

export interface IDashboardProps {}

export interface IDashboardState {}

export default class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  public constructor (props: IDashboardProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const task = {
      id: '',
      boardId: '',
      groupId: '',
      content: 'Asset support for functional components',
      finished: false,
      finishedAt: '',
      createdAt: '',
      DueAt: '',
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
