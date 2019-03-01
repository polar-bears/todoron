import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import styled from '../styles/styled-components'
import ScrollArea from './ScrollArea'

export interface IGroupProps {
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  groupId?: string | number
  type?: string
  children?: React.ReactNode
}

export interface IGroupState {
  height: string | number
}

function Group(props: IGroupProps) {
  const { className, header, children, footer, groupId, type } = props

  const [height, setHeight] = useState('auto')

  let observer: MutationObserver
  let $wrapper: HTMLDivElement

  const refWrapper: React.RefObject<HTMLDivElement> = useRef(null)
  const refContainer: React.RefObject<HTMLDivElement> = useRef(null)
  const refScrollArea: React.RefObject<ScrollArea> = useRef(null)

  const updateStyles = () => {
    const $parent = $wrapper.parentElement!
    const $header = $wrapper.childNodes[0] as HTMLDivElement
    const $footer = $wrapper.childNodes[2] as HTMLDivElement

    let { paddingTop, paddingBottom } = getComputedStyle($parent)

    const maxHeight =
      $parent.offsetHeight -
      $header.offsetHeight -
      ($footer ? $footer.offsetHeight : 0) -
      parseInt(paddingTop || '0') -
      parseInt(paddingBottom || '0')
    const height = refScrollArea.current!.$container.scrollHeight

    setHeight(JSON.stringify(height > maxHeight ? maxHeight : 'auto'))
    refScrollArea.current!.updateStyles()
  }

  useEffect(() => {
    $wrapper = refWrapper.current!

    observer = new MutationObserver(() => {
      updateStyles()
    })
    observer.observe($wrapper, { childList: true, subtree: true })

    window.addEventListener('resize', () => {
      updateStyles()
    })

    updateStyles()

    return () => {
      observer.disconnect()

      window.removeEventListener('resize', () => {
        updateStyles()
      })
    }
  })

  return (
    <Wrapper
      data-gid={groupId}
      data-type={type}
      className={className}
      ref={refWrapper}
    >
      {header && <Header>{header}</Header>}
      <Container ref={refContainer}>
        <ScrollArea ref={refScrollArea} style={{ height }}>
          {children}
        </ScrollArea>
      </Container>
      {footer && <Footer>{footer}</Footer>}
    </Wrapper>
  )
}

export default Group

const Wrapper = styled.div(({ theme }) => ({
  marginRight: '10px',
  display: 'inline-flex',
  flexDirection: 'column',
  width: '300px',
  maxHeight: '100%',
  verticalAlign: 'top',
  background: theme.bg,
  boxShadow: theme.boxShadow
}))

const Header = styled.div({})

const Container = styled.div(() => ({
  flex: '1',
  minHeight: 'auto'
}))

const Footer = styled.div({})
