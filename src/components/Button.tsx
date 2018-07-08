import * as React from 'react'

import styled from '../styles/theme'
import Icon from './Icon'

export type ButtonSize = 'small' | 'medium' | 'large'

export interface IButtonProps {
  size?: ButtonSize
  icon?: string
}

export interface IButtonState {}

export default class Button extends React.Component<IButtonProps, IButtonState> {

  public render () {
    const { icon, size = 'medium', children } = this.props

    return (
      <Wrapper size={size}>
        <Icon name={icon} size={size}/>
        {children && <Content>{children}</Content>}
      </Wrapper>
    )
  }

}

const sizes = {
  small: { padding: '10px', fontSize: '12px', height: '26px', minWidth: '26px' },
  medium: { padding: '10px', fontSize: '14px', height: '36px', minWidth: '36px' },
  large: { padding: '10px', fontSize: '16px', height: '42px', minWidth: '42px' },
}

const Wrapper = styled.button<{size: ButtonSize}>(({ size, theme }) => ({
  ...sizes[size],
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  outline: 'none',
  color: theme.fgLight,
  background: 'transparent',
  textAlign: 'center',
  transition: 'background 0.3s, colo 0.3s',
  borderRadius: theme.borderRadius,
  '&:hover': {
    color: theme.fg,
    background: theme.bgDark
  },
  '&:active': {
    color: theme.fgDark,
    background: theme.bgDarker
  }
}))

const Content = styled.span(() => ({
  '&:not(:first-child)': {
    marginLeft: '6px'
  }
}))
