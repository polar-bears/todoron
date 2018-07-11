import * as React from 'react'

import styled from '../styles/theme'
import Icon from './Icon'

export type ButtonSize = 'small' | 'medium' | 'large'

export interface IButtonProps {
  className?: string
  size?: ButtonSize
  full?: boolean
  disabled?: boolean
  icon?: string
  onClick?: React.MouseEventHandler
}

export interface IButtonState {}

export default class Button extends React.Component<IButtonProps, IButtonState> {

  public onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { disabled, onClick } = this.props

    if (!disabled && onClick) {
      onClick(e)
    }
  }

  public render () {
    const { className, icon, disabled = false, full = false, size = 'medium', children } = this.props

    return (
      <Wrapper
        className={className}
        full={full}
        size={size}
        disabled={disabled}
        onClick={this.onClick}
      >
        <Icon name={icon} size={size}/>
        {children && <Content>{children}</Content>}
      </Wrapper>
    )
  }

}

const sizes = {
  small: { padding: '0 6px', fontSize: '12px', height: '26px', minWidth: '26px' },
  medium: { padding: '0 10px', fontSize: '14px', height: '36px', minWidth: '36px' },
  large: { padding: '0 10px', fontSize: '16px', height: '42px', minWidth: '42px' },
}

const Wrapper = styled.button<{
  full: boolean,
  disabled: boolean,
  size: ButtonSize,
}>(({ full, size, disabled, theme }) => ({
  ...sizes[size],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: full ? '100%' : 'auto',
  border: 'none',
  outline: 'none',
  color: theme.fgLight,
  background: 'transparent',
  borderRadius: theme.borderRadius,
  textAlign: 'center',
  transition: 'background 0.3s, color 0.3s',
  '&:hover': !disabled && {
    color: theme.fg,
    background: theme.bgDark,
  },
  '&:active': !disabled && {
    color: theme.fgDark,
    background: theme.bgDarker,
  },
}))

const Content = styled.span(() => ({
  '&:not(:first-child)': {
    marginLeft: '6px',
  },
}))
