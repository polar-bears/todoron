import * as React from 'react'
import Markdown from 'react-markdown'
import createTimeAgo from 'timeago.js'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react'

import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import CodeBlock from '../components/CodeBlock'
import ScrollArea from '../components/ScrollArea'
import styled from '../styles/styled-components'
import { taskStore } from '../stores'

// import Icon from '../components/Icon'
const timeAgo = createTimeAgo()

export interface IProps extends RouteComponentProps<{ boardId: string, taskId: string }> { }

export interface IState {
  editable: boolean
  content: string | null
}

@observer
export default class TaskView extends React.Component<IProps, IState> {

  public state: IState = {
    editable: false,
    content: '',
  }

  private wrapper: React.RefObject<HTMLDivElement> = React.createRef()

  public componentDidMount () {
    const boardId = this.props.match.params.boardId
    const taskId = Number(this.props.match.params.taskId)

    taskStore.selectTask(taskId)

    if (!taskStore.selectedTask) {
      this.props.history.push('/boards/' + boardId)
    }

    const { selectedTask: task } = taskStore

    this.setState({ content: task!.content })
  }

  public componentDidUpdate (prevProps: IProps, prevState: IState) {
    const boardId = this.props.match.params.boardId
    const taskId = Number(this.props.match.params.taskId)
    const prevTaskId = Number(prevProps.match.params.taskId)

    if (taskId !== prevTaskId) {
      taskStore.selectTask(taskId)

      if (!taskStore.selectedTask) {
        this.props.history.push(`/boards/${boardId}`)
      }
    }
  }

  public componentWillUnmount () {
    taskStore.selectTask(null)
  }

  public onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== this.wrapper.current) return

    const boardId = this.props.match.params.boardId
    this.props.history.push(`/boards/${boardId}`)
  }

  private onSave = async () => {
    const taskId = Number(this.props.match.params.taskId)
    const { content } = this.state

    if (!content) return

    await taskStore.updateTask(taskId, { content })

    this.setState({ editable: false })
  }

  private setEdit = () => {
    this.setState({ editable: true })
  }

  private onContentChange = (e: React.ChangeEvent<any>) => {
    this.setState({ content: e.currentTarget.value })
  }

  private onCheckboxChange = async (finished: boolean) => {
    const taskId = Number(this.props.match.params.taskId)

    await taskStore.updateTask(taskId, { finished })
  }

  public renderEditArea = ({ content }: {content: string}) => {
    return (
      <React.Fragment>
        <EditArea
          onChange={this.onContentChange}
          defaultValue={content}
        />
        <SaveButton onClick={this.onSave}>save</SaveButton>
      </React.Fragment>
    )
  }

  public render () {
    const { editable, } = this.state
    const { selectedTask: task } = taskStore

    const EditAreaComponent = this.renderEditArea

    if (!task) return null

    return (
      <Wrapper>
        <ScrollArea>
          <Mask onClick={this.onClose} ref={this.wrapper} />
          <Container editable={editable}>
            <Header>
              <Title>
                <Checkbox checked={task.finished} onChange={this.onCheckboxChange} />
                <DateInfo>Created at {timeAgo.format(task.createdAt)}</DateInfo>
              </Title>
            </Header>
            <Content>
              {editable ? <EditAreaComponent content={task.content} /> : (
                <React.Fragment>
                  <Markdown
                    source={task.content}
                    className='markdown-body'
                    allowNode={() => true}
                    escapeHtml={false}
                    skipHtml={false}
                    renderers={{ code: CodeBlock }}
                  />
                  <EditButton onClick={this.setEdit}>edit</EditButton>
                </React.Fragment>
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
        </ScrollArea>
      </Wrapper>
    )
  }
}

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
  overflowY: 'auto',
}))

const Mask = styled.div(() => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  transition: 'all .3s',
}))

const SaveButton = styled(Button)(() => ({
  position: 'absolute',
  bottom: '50px',
  right: '20px',
  zIndex: 20,
}))

const EditButton = styled(Button)(() => ({
  position: 'absolute',
  bottom: '20px',
  right: '10px',
  zIndex: 20,
}))

const Container = styled.div<{ editable: boolean }>(({ editable }) => ({
  margin: '40px 100px',
  padding: '10px',
  background: '#fff',
  minHeight: '520px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: !editable ? 'auto' : 'calc(100% - 80px)',
}))

const Content = styled.div(() => ({
  overflow: 'hidden',
  height: '100%',
  '& .markdown-body': {
    minHeight: '440px',
    marginRight: '10px',
  },
}))

const EditArea = styled.textarea(({ theme }) => ({
  width: '100%',
  height: '100%',
  lineHeight: '1.5em',
  minHeight: '440px',
  border: `${theme.border}`,
  resize: 'none',
}))

const Header = styled.div(() => ({
  marginBottom: '8px',
  display: 'flex',
}))

const DateInfo = styled.span(({ theme }) => ({
  fontSize: '12px',
  color: theme.fgLight,
  verticalAlign: 'text-bottom',
  userSelect: 'none',
}))

const Title = styled.div(() => ({
  flex: 1,
  alignItems: 'middle',
}))

const Footer = styled.div(() => ({
  position: 'relative',
  bottom: '10px',
  paddingTop: '20px',
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
