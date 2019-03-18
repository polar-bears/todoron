import * as React from 'react'

import styled from '../styles/styled-components'
import noop from './../libs/noop'

export interface Props {
  className?: string
  checked?: boolean
  stacked?: boolean
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export default function Card (props: Props) {
  const { className, children, stacked = false, onClick = noop } = props

  const onCardClick = React.useCallback((e: React.MouseEvent) => {
    if (e.defaultPrevented) return

    onClick(e)
  }, [stacked])

  return (
    <Wrapper className={className} stacked={stacked} onClick={onCardClick}>
      <Inner>{children}</Inner>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ stacked: boolean }>(({ theme, stacked }) => ({
  '&::before': stacked
    ? {
      position: 'absolute',
      bottom: '-4px',
      left: '5px',
      right: '5px',
      height: '6px',
      content: '""',
      background: theme.bgLighter,
      boxShadow: theme.boxShadowLight,
      borderRadius: theme.borderRadius
    }
    : '',
  '&:not(:last-child)': {
    marginBottom: '10px'
  }
}))

const Inner = styled.div(({ theme }) => ({
  position: 'relative',
  fontSize: '14px',
  color: theme.fgDark,
  background: theme.bgLighter,
  boxShadow: theme.boxShadowLight,
  borderRadius: theme.borderRadius
}))
