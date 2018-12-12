import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import createTimeAgo from 'timeago.js'
import styled from '../styles/theme'
import Card from './Card'
import Checkbox from './Checkbox'
import CodeBlock from './CodeBlock'
import Tag from './Tag'
import TagContext from './TagContext'
import { ITag, ITask } from '../models'

const timeAgo = createTimeAgo()

export interface ITaskCardContext {
  tags: ITag[]
}

export interface ITaskCardProps {
  task: ITask
  index: number
  onClick?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
}

export interface ITaskCardState { }

class OriginalTaskCard extends React.Component<ITaskCardProps & ITaskCardContext, ITaskCardState> {

  private get tags () {
    const { tags, task } = this.props

    return tags.filter((tag) => ~task.tagIds.indexOf(tag.id))
  }

  private onClick = () => {
    const { task, onClick, } = this.props

    if (onClick) onClick(task)
  }

  private onFinishedChange = (checked: boolean) => {
    const { task, onFinishedChange, } = this.props
    if (onFinishedChange) onFinishedChange(task)
  }

  public render () {
    const { task } = this.props

    const { id } = task
    const taskId = 'task' + id

    return (
      <Wrapper key={taskId}>
        <Card data-id={id}>
          <Header>
            <Title>
              <Checkbox checked={task.finished} onChange={this.onFinishedChange} />
              <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
            </Title>
            {this.tags.map((tag) => (
              <Tag key={tag.id} color={tag.color}>{tag.title}</Tag>
            ))}
          </Header>
          <Container onClick={this.onClick}>
            <ReactMarkdown
              source={task && task.content || ''}
              className='markdown-body'
              allowNode={node => true}
              escapeHtml={false}
              skipHtml={false}
              renderers={{ code: CodeBlock }}
            />
          </Container>
          <Footer>
            {/* <DueTime overdue>
                  <DueTimeIcon size='small' name='Clock'/>
                  <DueTimeDetail>
                    Today at 10:00 am
                  </DueTimeDetail>
                </DueTime> */}
          </Footer>
        </Card>
      </Wrapper>
    )
  }

}

export default function TaskCard (props: ITaskCardProps) {
  return (
    <TagContext.Consumer>
      {(context) => (
        <OriginalTaskCard {...context} {...props} />
      )}
    </TagContext.Consumer>
  )
}

const Wrapper = styled.div(() => ({
  margin: '0 0 10px',
}))

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
  maxHeight: '400px',
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
