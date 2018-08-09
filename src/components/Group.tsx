import * as React from 'react'

import styled from '../styles/theme'
import ScrollArea from './ScrollArea'

export interface IGroupProps {
  className?: string
  header?: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
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
    const { className, header, title, actions, children, footer, ...others } = this.props
    const { height } = this.state

    return (
      <Wrapper
        className={className}
        innerRef={this.refWrapper}
      >
        <Header
          {...others}
        >
          {header || (
            <React.Fragment>
              <Title>{title}</Title>
              <Actions>{actions}</Actions>
            </React.Fragment>
          )}
        </Header>
        <Container innerRef={this.refContainer}>
          <ScrollArea ref={this.refScrollArea} style={{ height }}>
            <Inner>{children}</Inner>
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
  background: theme.bg,
  boxShadow: theme.boxShadow,
}))

const Header = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
}))

const Title = styled.div(({ theme }) => ({
  marginLeft: '10px',
  flex: 1,
  color: theme.fg,
  fontSize: '14px',
}))

const Actions = styled.div(() => ({
  marginRight: '10px',
}))

const Container = styled.div(() => ({
  flex: '1',
  minHeight: 0,
}))

const Inner = styled.div(() => ({
  '&:not(:empty)': {
    padding: '10px',
  },
}))

const Footer = styled.div()
