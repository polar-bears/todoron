import * as React from 'react'
import createTimeAgo from 'timeago.js'

import styled from '../styles/theme'
import Card from './Card'
import Checkbox from './Checkbox'
import Tag from './Tag'
import TagContext from './TagContext'
import { ITag, ITask } from '../models'

const timeAgo = createTimeAgo()

export interface ITaskCardContext {
  tags: ITag[]
}

export interface ITaskCardProps {
  task: ITask
}

export interface ITaskCardState {}

class OriginalTaskCard extends React.Component<ITaskCardProps & ITaskCardContext, ITaskCardState> {

  private get tags () {
    const { tags, task } = this.props

    return tags.filter((tag) => ~task.tagIds.indexOf(tag.id))
  }

  public render () {
    const { task } = this.props

    return (
      <Card>
        <Header>
          <Title>
            <Checkbox/>
            <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
          </Title>
          {this.tags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>{tag.title}</Tag>
          ))}
        </Header>
        <Container>{task.content}</Container>
        <Footer>
          {/* <DueTime overdue>
            <DueTimeIcon size='small' name='Clock'/>
            <DueTimeDetail>
              Today at 10:00 am
            </DueTimeDetail>
          </DueTime> */}
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

// const DueTime = styled.span<{overdue: boolean}>(({ theme, overdue }) => ({
//   color: overdue ? theme.colors.red : theme.fg,
//   userSelect: 'none',
// }))

// const DueTimeIcon = styled(Icon)(() => ({
//   verticalAlign: 'middle',
// }))

// const DueTimeDetail = styled.span(() => ({
//   marginLeft: '5px',
//   verticalAlign: 'middle',
//   fontSize: '12px',
// }))
