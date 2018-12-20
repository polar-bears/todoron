import * as React from 'react'

import styled from '../styles/styled-components'
import ScrollArea from './ScrollArea'

export interface IGroupProps {
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  groupId?: string | number
  type?: string
}

export interface IGroupState {
  height: string | number
}

export default class Group extends React.Component<IGroupProps, IGroupState> {

  private refWrapper = React.createRef<HTMLDivElement>()
  private refContainer = React.createRef<HTMLDivElement>()
  private refScrollArea = React.createRef<ScrollArea>()

  private $wrapper!: HTMLDivElement

  private observer!: MutationObserver

  public state: IGroupState = {
    height: 'auto',
  }

  public componentDidMount () {
    this.$wrapper = this.refWrapper.current!

    this.observer = new MutationObserver(this.onDomChange)
    this.observer.observe(this.$wrapper, { childList: true, subtree: true })

    window.addEventListener('resize', this.onWindowResize)

    this.updateStyles()
  }

  public componentWillUnmount () {
    this.observer.disconnect()

    window.removeEventListener('resize', this.onWindowResize)
  }

  private onDomChange = () => {
    this.updateStyles()
  }

  private onWindowResize = () => {
    this.updateStyles()
  }

  private updateStyles = () => {
    const $parent = this.$wrapper.parentElement!
    const $header = this.$wrapper.childNodes[0] as HTMLDivElement
    const $footer = this.$wrapper.childNodes[2] as HTMLDivElement

    let { paddingTop, paddingBottom } = getComputedStyle($parent)

    const maxHeight = $parent.offsetHeight - $header.offsetHeight - ($footer ? $footer.offsetHeight : 0)
      - parseInt(paddingTop || '0') - parseInt(paddingBottom || '0')
    const height = this.refScrollArea.current!.$container.scrollHeight

    this.setState({ height: height > maxHeight ? maxHeight : 'auto' }, () => {
      this.refScrollArea.current!.updateStyles()
    })
  }

  public render () {
    const { className, header, children, footer, groupId, type } = this.props
    const { height } = this.state

    return (
      <Wrapper
        data-gid={groupId}
        data-type={type}
        className={className}
        ref={this.refWrapper}
      >
        {header && (
          <Header>{header}</Header>
        )}
        <Container ref={this.refContainer}>
          <ScrollArea ref={this.refScrollArea} style={{ height }}>
            {children}
          </ScrollArea>
        </Container>
        {footer && (
          <Footer>{footer}</Footer>
        )}
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  marginRight: '10px',
  display: 'inline-flex',
  flexDirection: 'column',
  width: '300px',
  maxHeight: '100%',
  verticalAlign: 'top',
  background: theme.bg,
  boxShadow: theme.boxShadow,
}))

const Header = styled.div({})

const Container = styled.div(() => ({
  flex: '1',
  minHeight: 'auto',
}))

const Footer = styled.div({})
