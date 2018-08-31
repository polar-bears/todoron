import * as React from 'react'

import styled from '../styles/theme'

export interface ICardProps {
  className?: string
  checked?: boolean
  stacked?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface ICardState {}

export default class Card extends React.Component<ICardProps, ICardState> {

  public render () {
    const { className, children, stacked = false, onClick } = this.props

    return (
      <Wrapper
        className={className}
        stacked={stacked}
        onClick={onClick}
      >
        <Inner>
          {children}
        </Inner>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div<{stacked: boolean}>(({ theme, stacked }) => ({
  position: 'relative',
  '&::before': stacked && {
    position: 'absolute',
    bottom: '-4px',
    left: '5px',
    right: '5px',
    height: '6px',
    content: '""',
    background: theme.bgLighter,
    boxShadow: theme.boxShadowLight,
    borderRadius: theme.borderRadius,
  },
  '&:not(:last-child)': {
    marginBottom: '10px',
  },
}))

const Inner = styled.div(({ theme }) => ({
  position: 'relative',
  padding: '8px',
  fontSize: '14px',
  color: theme.fgDark,
  background: theme.bgLighter,
  boxShadow: theme.boxShadowLight,
  borderRadius: theme.borderRadius,
}))
