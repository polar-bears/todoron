import * as React from 'react'
import createTimeAgo from 'timeago.js'
import ReactMarkdown, { MarkdownAbstractSyntaxTree } from 'react-markdown'

import noop from '../libs/noop'
import styled from '../styles/styled-components'
import Card from './Card'
import Checkbox from './Checkbox'
import CodeBlock from './CodeBlock'
import Icon from './Icon'
import Tag from './Tag'
import TagContext from './TagContext'
import { ITag, ITask } from '../models'

const timeAgo = createTimeAgo()

export interface ContextProps {
  tags: ITag[]
}

export interface Props {
  task: ITask
  index: number
  onClick?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
}

function OriginalTaskCard (props: Props & ContextProps) {
  const { tags, task, onClick = noop, onFinishedChange = noop, ...rest } = props

  const newTags = tags.filter((tag) => ~task.tagIds.indexOf(tag.id))

  const taskId = 'task' + task.id

  const onCheckboxChange = () => {
    onFinishedChange(task)
  }

  const onCardClick = () => {
    onClick(task)
  }

  return (
    <Wrapper key={taskId}>
      <Card data-id={task.id}>
        <Header>
          <Title {...rest}>
            <Checkbox
              checked={task.finished}
              onChange={onCheckboxChange}
            />
            <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
          </Title>
          {newTags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.title}
            </Tag>
          ))}
        </Header>
        <Container onClick={onCardClick}>
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

export default function TaskCard (props: Props) {
  return (
    <TagContext.Consumer>
      {(context) => <OriginalTaskCard {...context} {...props} />}
    </TagContext.Consumer>
  )
}

const Wrapper = styled.div(() => ({
  margin: '0 10px 0 10px',
  paddingBottom: '10px'
}))

const Header = styled.div(() => ({
  marginBottom: '8px',
  display: 'flex'
}))

const Container = styled.div(() => ({
  fontSize: '13px',
  overflow: 'hidden',
  maxHeight: '200px',
  cursor: 'default'
}))

const Footer = styled.div(() => ({
  marginTop: '8px'
}))

const Title = styled.div(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'middle'
}))

const DateInfo = styled.span(({ theme }) => ({
  fontSize: '12px',
  color: theme.fgLight,
  verticalAlign: 'text-bottom',
  userSelect: 'none',
  flex: 1
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
