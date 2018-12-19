import * as React from 'react'

import styled from '../styles/styled-components'
import { getNativeScrollBarSize as getBarSize } from '../libs/dom'

const THUMB_MIN_SIZE = 30

type DirectionType = 'vertical' | 'horizontal'

export interface IScrollAreaProps {
  className?: string
  style?: React.CSSProperties
  direction?: DirectionType
  children?: React.ReactNode
}

export interface IScrollAreaState {
  shadowTopVisible: boolean,
  shadowBottomVisible: boolean,
  trackVerticalVisible: boolean
  thumbVerticalStyle: any
  trackHorizontalVisible: boolean
  thumbHorizontalStyle: any
}

export default class ScrollArea extends React.Component<IScrollAreaProps, IScrollAreaState> {

  private refWrapper = React.createRef<HTMLDivElement>()
  private refContainer = React.createRef<HTMLDivElement>()
  private refTrackVertical = React.createRef<HTMLDivElement>()
  private refThumbVertical = React.createRef<HTMLDivElement>()
  private refTrackHorizontal = React.createRef<HTMLDivElement>()
  private refThumbHorizontal = React.createRef<HTMLDivElement>()

  public $wrapper!: HTMLDivElement
  public $container!: HTMLDivElement
  private $trackVertical!: HTMLDivElement
  private $thumbVertical!: HTMLDivElement
  private $trackHorizontal!: HTMLDivElement
  private $thumbHorizontal!: HTMLDivElement

  private dragDirection: DirectionType = 'vertical'
  private dragPosition: number = 0

  public state: IScrollAreaState = {
    shadowTopVisible: false,
    shadowBottomVisible: false,
    trackVerticalVisible: false,
    thumbVerticalStyle: {},
    trackHorizontalVisible: false,
    thumbHorizontalStyle: {},
  }

  public componentDidMount () {
    this.$wrapper = this.refWrapper.current!
    this.$container = this.refContainer.current!
    this.$trackVertical = this.refTrackVertical.current!
    this.$thumbVertical = this.refThumbVertical.current!
    this.$trackHorizontal = this.refTrackHorizontal.current!
    this.$thumbHorizontal = this.refThumbHorizontal.current!

    window.addEventListener('resize', this.onWindowResize)
    this.$container.addEventListener('scroll', this.onScroll)
    this.$container.addEventListener('mousewheel', this.onMouseWheel)
    this.$thumbVertical.addEventListener('mousedown', this.onThumbVerticalMouseDown)
    this.$thumbHorizontal.addEventListener('mousedown', this.onThumbHorizontalMouseDown)

    this.updateStyles()
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
    this.$container.removeEventListener('scroll', this.onScroll)
  }

  public updateStyles = () => {
    const {
      scrollTop, scrollHeight, clientHeight,
      scrollLeft, scrollWidth, clientWidth,
    } = this.$container

    const top = scrollTop / (scrollHeight - clientHeight)
    const left = scrollLeft / (scrollWidth - clientWidth)

    const trackVerticalVisible = scrollHeight > clientHeight
    const thumbVerticalStyle = trackVerticalVisible
      ? this.getThumbVerticalStyle(top, clientHeight, scrollHeight)
      : {}

    const trackHorizontalVisible = scrollWidth > clientWidth
    const thumbHorizontalStyle = trackHorizontalVisible
      ? this.getThumbHorizontalStyle(left, clientWidth, scrollWidth)
      : {}

    let shadowTopVisible = trackVerticalVisible ? scrollTop > 0 : false
    let shadowBottomVisible = trackVerticalVisible ? Math.ceil(scrollTop) + clientHeight < scrollHeight : false

    this.setState({
      shadowTopVisible,
      shadowBottomVisible,
      trackVerticalVisible,
      thumbVerticalStyle,
      trackHorizontalVisible,
      thumbHorizontalStyle,
    })
  }

  private getThumbVerticalStyle = (top: number, clientHeight: number, scrollHeight: number) => {
    const trackHeight = this.$trackVertical.clientHeight

    const thumbHeight = Math.max(
      Math.ceil(clientHeight / scrollHeight * trackHeight),
      THUMB_MIN_SIZE,
    )

    const thumbY = top * (clientHeight - thumbHeight)

    return {
      height: thumbHeight + 'px',
      transform: `translateY(${thumbY}px)`,
    }
  }

  private getThumbHorizontalStyle = (left: number, clientWidth: number, scrollWidth: number) => {
    const trackWidth = this.$trackHorizontal.clientWidth

    const thumbWidth = Math.max(
      Math.ceil(clientWidth / scrollWidth * trackWidth),
      THUMB_MIN_SIZE,
    )

    const thumbX = left * (clientWidth - thumbWidth)

    return {
      width: thumbWidth + 'px',
      transform: `translateX(${thumbX}px)`,
    }
  }

  private dragStart = () => {
    document.body.addEventListener('mousemove', this.onDrag)
    document.body.addEventListener('mouseup', this.onDragEnd)
  }

  private dragEnd = () => {
    document.body.removeEventListener('mousemove', this.onDrag)
    document.body.removeEventListener('mouseup', this.onDragEnd)
  }

  private onWindowResize = () => {
    this.updateStyles()
  }

  private onScroll = (e: UIEvent) => {
    this.updateStyles()
  }

  private onMouseWheel = (e: any) => {
    if (this.props.direction === 'horizontal') {
      this.$container.scrollLeft += -e.wheelDelta
    } else {
      e.stopPropagation()
    }
  }

  private onThumbVerticalMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopImmediatePropagation()

    this.dragDirection = 'vertical'
    this.dragPosition = e.clientY
    this.dragStart()
  }

  private onThumbHorizontalMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopImmediatePropagation()

    this.dragDirection = 'horizontal'
    this.dragPosition = e.clientX
    this.dragStart()
  }

  private onDrag = (e: MouseEvent) => {
    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = this.$container
    const curPosition = this.dragDirection === 'vertical' ? e.clientY : e.clientX
    const delta = curPosition - this.dragPosition

    if (this.dragDirection === 'vertical') {
      this.$container.scrollTop += delta / clientHeight * scrollHeight
    } else {
      this.$container.scrollLeft += delta / clientWidth * scrollWidth
    }

    this.dragPosition = curPosition
  }

  private onDragEnd = (e: MouseEvent) => {
    this.dragEnd()
  }

  public render () {
    const { className, style, direction = 'vertical', children } = this.props
    const {
      shadowTopVisible,
      shadowBottomVisible,
      trackVerticalVisible,
      thumbVerticalStyle,
      trackHorizontalVisible,
      thumbHorizontalStyle,
    } = this.state

    return (
      <Wrapper className={className} ref={this.refWrapper} style={style}>
        <Container ref={this.refContainer} direction={direction}>{children}</Container>
        <TrackVertical ref={this.refTrackVertical} visible={trackVerticalVisible}>
          <ThumbVertical ref={this.refThumbVertical} style={thumbVerticalStyle}/>
        </TrackVertical>
        <TrackHorizontal ref={this.refTrackHorizontal} visible={trackHorizontalVisible}>
          <ThumbHorizontal ref={this.refThumbHorizontal} style={thumbHorizontalStyle}/>
        </TrackHorizontal>
        <ShadowTop visible={shadowTopVisible}/>
        <ShadowBottom visible={shadowBottomVisible}/>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  '&:hover': {
    '& > div:nth-child(2)': {
      width: '6px',
    },
    '& > div:nth-child(3)': {
      height: '6px',
    },
  },
}))

const Container = styled.div<{direction: DirectionType}>(({ direction }) => (
  direction === 'vertical' ? {
    height: '100%',
    width: `calc(100% + ${getBarSize()}px)`,
    overflowY: direction === 'vertical' ? 'scroll' : 'hidden',
    overflowX: 'hidden',
    marginRight: direction === 'vertical' ? `-${getBarSize()}px` : 0,
    marginBottom: 0,

    msOverflowStyle: 'none', // IE 10+
    overflow: '-moz-scrollbars-none',  // Firefox
    '&::-webkit-scrollbar': {
      width: '0px',
      background: 'transparent',
    },
  } : {
    height: `calc(100% + ${getBarSize()}px)`,
    width: '100%',
    overflowY: 'hidden',
    overflowX: direction === 'horizontal' ? 'scroll' : 'hidden',
    marginRight: 0,
    marginBottom: direction === 'horizontal' ? `-${getBarSize()}px` : 0,

    msOverflowStyle: 'none', // IE 10+
    overflow: '-moz-scrollbars-none',  // Firefox
    '&::-webkit-scrollbar': {
      width: '0px',
      background: 'transparent',
    },
  }
))

const TrackVertical = styled.div<{visible: boolean}>(({ visible }) => ({
  position: 'absolute',
  zIndex: 1,
  top: 0,
  right: 0,
  height: '100%',
  width: '3px',
  visibility: visible ? 'visible' : 'hidden',
  transition: 'width 0.3s',
}))

const ThumbVertical = styled.div(({ theme }) => ({
  position: 'absolute',
  right: 0,
  width: '100%',
  background: theme.bgDark,
  transition: 'background 0.3s',
  '&:active': {
    background: theme.bgDarker,
  },
}))

const TrackHorizontal = styled.div<{visible: boolean}>(({ visible }) => ({
  position: 'absolute',
  zIndex: 1,
  bottom: 0,
  left: 0,
  height: '3px',
  width: '100%',
  visibility: visible ? 'visible' : 'hidden',
  transition: 'width 0.3s',
}))

const ThumbHorizontal = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: '100%',
  background: theme.bgDark,
  transition: 'background 0.3s',
  '&:active': {
    background: theme.bgDarker,
  },
}))

const ShadowTop = styled.div<{visible: boolean}>(({ visible }) => ({
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '6px',
  background: 'linear-gradient(rgba(0, 0, 0, 0.08), transparent)',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s',
}))

const ShadowBottom = styled.div<{visible: boolean}>(({ visible }) => ({
  userSelect: 'none',
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '6px',
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.08))',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s',
}))
