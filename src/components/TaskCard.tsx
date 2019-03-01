import * as React from 'react'
import createTimeAgo from 'timeago.js'
import ReactMarkdown, { MarkdownAbstractSyntaxTree } from 'react-markdown'

import styled from '../styles/styled-components'
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

function OriginalTaskCard(props: ITaskCardProps & ITaskCardContext) {
  const { tags, task, onClick, onFinishedChange } = props

  const newTags = tags.filter((tag) => ~task.tagIds.indexOf(tag.id))

  const taskId = 'task' + task.id

  return (
    <Wrapper key={taskId}>
      <Card data-id={task.id}>
        <Header>
          <Title>
            <Checkbox
              checked={task.finished}
              onChange={() => onFinishedChange && onFinishedChange(task)}
            />
            <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
          </Title>
          {newTags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.title}
            </Tag>
          ))}
        </Header>
        <Container onClick={() => onClick && onClick(task)}>
          <ReactMarkdown
            source={(task && task.content) || ''}
            className='markdown-body'
            allowNode={(node: MarkdownAbstractSyntaxTree) => true}
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

export default function TaskCard(props: ITaskCardProps) {
  return (
    <TagContext.Consumer>
      {(context) => <OriginalTaskCard {...context} {...props} />}
    </TagContext.Consumer>
  )
}

const Wrapper = styled.div(() => ({
  margin: '0 0 10px'
}))

const Header = styled.div(() => ({
  marginBottom: '8px',
  display: 'flex'
}))

const Title = styled.div(() => ({
  flex: 1,
  alignItems: 'middle'
}))

const DateInfo = styled.span(({ theme }) => ({
  fontSize: '12px',
  color: theme.fgLight,
  verticalAlign: 'text-bottom',
  userSelect: 'none'
}))

const Container = styled.div(() => ({
  fontSize: '13px',
  overflow: 'hidden',
  maxHeight: '400px'
}))

const Footer = styled.div(() => ({
  marginTop: '8px'
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
