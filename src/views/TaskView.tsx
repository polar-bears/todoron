import * as React from 'react'
import Markdown from 'react-markdown'
import createTimeAgo from 'timeago.js'
import { RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs'

import Checkbox from '../components/Checkbox'
import ScrollArea from '../components/ScrollArea'
import CodeBlock from '../libs/codeBlock'
import styled from '../styles/theme'
import { ITask } from '../models'
import { boardViewService, taskViewService } from '../services'
import { SelectTaskAction, UpdateTaskAction } from '../services/actions'

const timeAgo = createTimeAgo()

export interface ITaskViewProps extends RouteComponentProps<{ taskId: string }> { }

export interface ITaskViewState {
  task: ITask | null
  editable: boolean
}

export default class TaskView extends React.Component<ITaskViewProps, ITaskViewState> {

  private task$$!: Subscription

  private updateTask$$!: Subscription

  public state: ITaskViewState = {
    task: null,
    editable: false,
  }

  public componentDidMount () {
    const taskId = Number(this.props.match.params.taskId)

    this.task$$ = taskViewService.selectTask$.subscribe((task) => {
      this.setState({ task })
    })

    taskViewService.dispatch(new SelectTaskAction({ taskId }))
  }

  public componentWillUnmount () {
    this.task$$.unsubscribe()
    if (this.updateTask$$) this.updateTask$$.unsubscribe()
  }

  public onClose = () => {
    const { task } = this.state
    if (task) this.props.history.push(`/boards/${task.boardId}`)
  }

  private onBlur = (e: React.ChangeEvent<any>) => {
    const content = e.target.innerText
    this.setState({ editable: false })

    if (this.state.task && this.state.task.content === content) return

    const taskId = Number(this.props.match.params.taskId)
    this.updateTask$$ = taskViewService.updateTask$.subscribe((task) => this.setState({ task }))
    taskViewService.dispatch(new UpdateTaskAction({ taskId, taskAttrs: { content } }))

    boardViewService.dispatch(new UpdateTaskAction({ taskId, taskAttrs: { content } }))
  }

  private onClick = (e: React.ChangeEvent<any>) => {
    this.setState({ editable: true })
  }

  private onCheckboxChange = (checked: boolean) => {
    const taskId = Number(this.props.match.params.taskId)

    this.updateTask$$ = taskViewService.updateTask$.subscribe((task) => this.setState({ task }))

    taskViewService.dispatch(new UpdateTaskAction({ taskId, taskAttrs: { finished: checked } }))
    boardViewService.dispatch(new UpdateTaskAction({ taskId, taskAttrs: { finished: checked } }))
  }

  public render () {
    const { task, editable, } = this.state

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
