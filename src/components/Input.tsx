import React, { useEffect, useRef } from 'react'

import styled from '../styles/styled-components'

export type InputSize = 'small' | 'medium' | 'large'

export interface IInputProps {
  className?: string
  value?: string
  size?: InputSize
  full?: boolean
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input = (props: IInputProps) => {
  const {
    className,
    value,
    placeholder,
    disabled = false,
    full = false,
    size = 'medium',
    autoFocus,
    onChange,
    onBlur,
    onKeyUp,
    onEnter
  } = props
  const refInput: React.RefObject<HTMLInputElement> = useRef(null)

  if (autoFocus && refInput.current) {
    refInput.current.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (onKeyUp) onKeyUp(e)

    if (onEnter && e.keyCode === 13) onEnter(e)
  }

  return (
    <OriginalInput
      className={className}
      ref={refInput}
      full={full}
      cSize={size}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        !disabled && onChange && onChange(e.target.value, e)
      }
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
        !disabled && onBlur && onBlur(e.target.value, e)
      }
      onKeyDown={onKeyDown}
    />
  )
}

export default Input

const sizes = {
  small: {
    padding: '0 6px',
    fontSize: '12px',
    height: '26px',
    minWidth: '26px'
  },
  medium: {
    padding: '0 10px',
    fontSize: '14px',
    height: '36px',
    minWidth: '36px'
  },
  large: {
    padding: '0 10px',
    fontSize: '16px',
    height: '42px',
    minWidth: '42px'
  }
}

const OriginalInput = styled.input<{
  full: boolean
  disabled: boolean
  cSize: InputSize
}>(({ theme, full, cSize, disabled }) => ({
  ...sizes[cSize],
  width: full ? '100%' : 'auto',
  border: 'none',
  outline: 'none',
  color: theme.fg,
  background: 'transparent',
  borderRadius: theme.borderRadius,
  transition: 'background 0.3s',
  '&:focus': {
    background: theme.bg
  }
}))
