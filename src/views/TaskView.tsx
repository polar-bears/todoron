import * as React from 'react'
import Markdown from 'react-markdown'
import createTimeAgo from 'timeago.js'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import CodeBlock from '../components/CodeBlock'
import Textarea from '../components/Textarea'
import styled from '../styles/styled-components'
import { default as TaskStore } from '../stores/TaskStore'

const timeAgo = createTimeAgo()

export interface Props
  extends RouteComponentProps<{ boardId: string; taskId: string }> {}

export default observer(function TaskView (props: Props) {
  const taskStore = React.useContext(TaskStore)
  const { selectedTask: task } = taskStore

  const [editable, setEditable] = React.useState(false)
  const [content, setContent] = React.useState('')

  const wrapper: React.RefObject<HTMLDivElement> = React.useRef(null)

  const taskId = Number(props.match.params.taskId)

  React.useEffect(() => {
    taskStore.selectTask(taskId)
    if (taskStore.selectedTask) {
      setContent(taskStore.selectedTask!.content)
    }
  }, [taskId])

  const onClose = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== wrapper.current) return

    taskStore.selectTask(null)
    props.history.push(`/boards/${props.match.params.boardId}`)
  }, [])

  const onCheckboxChange = React.useCallback(
    (finished: boolean) => {
      taskStore.updateTask(task!.id, { finished })
    },
    [taskId]
  )

  const onContentChange = React.useCallback(
    (newContent: string) => {
      setContent(newContent)
    },
    [content]
  )

  const onEditable = React.useCallback(() => {
    setEditable(true)
  }, [editable])

  const onTaskSave = React.useCallback(async () => {
    if (!content || content === taskStore.selectedTask!.content) {
      setEditable(false)
      return
    }

    await taskStore.updateTask(task!.id, { content })
    setEditable(false)
  }, [editable, content])

  if (!task) return null

  return (
    <Wrapper>
      <Mask onClick={onClose} ref={wrapper} />
      <Container editable={editable}>
        <Header>
          <Title>
            <Checkbox checked={task.finished} onChange={onCheckboxChange} />
            <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
          </Title>
          {editable && <Button size='small' icon='Save' onClick={onTaskSave} />}
          {!editable && (
            <Button size='small' icon='Edit' onClick={onEditable} />
          )}
        </Header>
        <Content>
          {editable && <EditArea onChange={onContentChange} value={content} />}
          {!editable && (
            <Markdown
              source={task.content}
              className='markdown-body'
              allowNode={() => true}
              escapeHtml={false}
              skipHtml={false}
              renderers={{ code: CodeBlock }}
            />
          )}
        </Content>
        <Footer>
          {/* <DueTime overdue>
            <DueTimeIcon size='small' name='Clock' />
            <DueTimeDetail>
              {timeAgo.format(task.DueAt)}
            </DueTimeDetail>
          </DueTime> */}
        </Footer>
      </Container>
    </Wrapper>
  )
})

const Wrapper = styled.div(() => ({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  width: '100%',
  height: '100%',
  background: 'rgba(238, 236, 232, .8)',
  overflowY: 'auto'
}))

const Mask = styled.div(() => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  transition: 'all .3s'
}))

const Container = styled.div<{ editable: boolean }>(({ editable }) => ({
  margin: '40px 100px',
  padding: '10px',
  background: '#fff',
  minHeight: '520px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: !editable ? 'auto' : 'calc(100% - 80px)'
}))

const Content = styled.div(() => ({
  overflow: 'hidden',
  height: '100%',
  '& .markdown-body': {
    minHeight: '440px',
    marginRight: '10px'
  }
}))

const EditArea = styled(Textarea)(({ theme }) => ({
  width: '100%',
  height: '100%',
  lineHeight: '1.5em',
  minHeight: '440px',
  border: `${theme.border}`,
  resize: 'none'
}))

const Header = styled.div(() => ({
  marginBottom: '8px',
  display: 'flex'
}))

const DateInfo = styled.span(({ theme }) => ({
  fontSize: '12px',
  color: theme.fgLight,
  verticalAlign: 'text-bottom',
  userSelect: 'none'
}))

const Title = styled.div(() => ({
  flex: 1,
  alignItems: 'middle'
}))

const Footer = styled.div(() => ({
  position: 'relative',
  bottom: '10px',
  paddingTop: '20px'
}))

// const DueTime = styled.span<{ overdue: boolean }>(({ theme, overdue }) => ({
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
