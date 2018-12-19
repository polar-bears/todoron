import * as React from 'react'
import Markdown from 'react-markdown'
import createTimeAgo from 'timeago.js'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react'

import Checkbox from '../components/Checkbox'
import CodeBlock from '../components/CodeBlock'
import ScrollArea from '../components/ScrollArea'
import styled from '../styles/styled-components'
import { taskStore } from '../stores'

const timeAgo = createTimeAgo()

export interface IProps extends RouteComponentProps<{ boardId: string, taskId: string }> { }

export interface IState {
  editable: boolean
}

@observer
export default class TaskView extends React.Component<IProps, IState> {

  public state: IState = {
    editable: false,
  }

  public componentDidMount () {
    const boardId = this.props.match.params.boardId
    const taskId = Number(this.props.match.params.taskId)

    taskStore.selectTask(taskId)

    if (!taskStore.selectedTask) {
      this.props.history.push('/boards/' + boardId)
    }
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

  public onClose = () => {
    const boardId = this.props.match.params.boardId
    this.props.history.push(`/boards/${boardId}`)
  }

  private onBlur = async (e: React.ChangeEvent<any>) => {
    const taskId = Number(this.props.match.params.taskId)
    const content = e.target.innerText

    await taskStore.updateTask(taskId, { content })

    this.setState({ editable: false })
  }

  private onClick = (e: React.ChangeEvent<any>) => {
    this.setState({ editable: true })
  }

  private onCheckboxChange = async (finished: boolean) => {
    const taskId = Number(this.props.match.params.taskId)

    await taskStore.updateTask(taskId, { finished })
  }

  public render () {
    const { editable, } = this.state
    const { selectedTask: task } = taskStore

    if (!task) return null

    return (
      <Wrapper onClick={this.onClose}>
        <Container>
          <Header>
            <Title>
              <Checkbox checked={task.finished} onChange={this.onCheckboxChange}/>
              <DateInfo>Created at {timeAgo.format(new Date())}</DateInfo>
            </Title>
          </Header>
          <Content onDoubleClick={this.onClick}>
            <ScrollArea>
              {editable ? (
                <EditDiv
                  onBlur={this.onBlur}
                  contentEditable={editable}
                >
                  {task.content}
                </EditDiv>
              ) : (
                <Markdown
                  source={task.content}
                  className='markdown-body'
                  allowNode={() => true}
                  escapeHtml={false}
                  skipHtml={false}
                  renderers={{ code: CodeBlock }}
                />
              )}
            </ScrollArea>
          </Content>
          <Footer>
            {/* <DueTime overdue>
              <DueTimeIcon size='small' name='Clock' />
              <DueTimeDetail>
                Today at 10:00 am
              </DueTimeDetail>
            </DueTime> */}
          </Footer>
        </Container>
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

const Container = styled.div(() => ({
  margin: '150px auto auto',
  padding: '10px',
  background: '#fff',
  width: '520px',
  minHeight: '520px',
}))

const Content = styled.div(() => ({
  position: 'absolute',
  top: '40px',
  bottom: '34px',
  left: '10px',
  right: '10px',
  overflow: 'hidden',
}))

const EditDiv = styled.pre(() => ({
  height: '100%',
  lineHeight: '1.5em',
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
  position: 'absolute',
  bottom: '10px',
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
