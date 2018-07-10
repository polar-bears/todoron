import * as React from 'react'

import styled from '../styles/theme'
import Card from './Card'
import Tag from './Tag'
import { ITask, ITag } from '../models'
import Checkbox from './Checkbox'
import TagContext from './TagContext'
import Icon from './Icon'

export interface ITaskCardContext {
  tags: ITag[]
}

export interface ITaskCardProps {
  task: ITask
}

export interface ITaskCardState {}

class OriginalTaskCard extends React.Component<ITaskCardProps & ITaskCardContext, ITaskCardState> {

  public render () {
    const { task } = this.props

    return (
      <Card stacked>
        <Header>
          <Title>
            <Checkbox/>
            <DateInfo>Created at 5 minutes ago</DateInfo>
          </Title>
          <Tag color='#82C788'>NORMAL</Tag>
        </Header>
        <Container>{task.content}</Container>
        <Footer>
          <DueTime overdue>
            <DueTimeIcon size='small' name='Clock'/>
            <DueTimeDetail>
              Today at 10:00 am
            </DueTimeDetail>
          </DueTime>
        </Footer>
      </Card>
    )
  }

}

export default function TaskCard (props: ITaskCardProps) {
  return (
    <TagContext.Consumer>
        {(context) => (
          <OriginalTaskCard {...context} {...props}/>
        )}
      </TagContext.Consumer>
  )
}

const Header = styled.div(() => ({
  marginBottom: '8px',
  display: 'flex',
}))

const Title = styled.div(() => ({
  flex: 1,
  alignItems: 'middle',
}))

const DateInfo = styled.span(({ theme }) => ({
  fontSize: '12px',
  color: theme.fgLight,
  verticalAlign: 'text-bottom',
  userSelect: 'none',
}))

const Container = styled.div(() => ({
  fontSize: '13px',
  overflow: 'hidden',
}))

const Footer = styled.div(() => ({
  marginTop: '8px',
}))

const DueTime = styled.span<{overdue: boolean}>(({ theme, overdue }) => ({
  color: overdue ? theme.colors.red : theme.fg,
  userSelect: 'none',
}))

const DueTimeIcon = styled(Icon)(() => ({
  verticalAlign: 'middle',
}))

const DueTimeDetail = styled.span(() => ({
  marginLeft: '5px',
  verticalAlign: 'middle',
  fontSize: '12px',
}))
