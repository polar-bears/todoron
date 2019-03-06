import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'

export type InputSize = 'small' | 'medium' | 'large'

export interface Props {
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

export default function Input (props: Props) {
  const {
    className,
    value,
    placeholder,
    full = true,
    disabled = false,
    autoFocus = false,
    size = 'medium',
    onChange = noop,
    onBlur = noop,
    onKeyUp = noop,
    onEnter = noop
  } = props

  const refInput: React.RefObject<HTMLInputElement> = React.useRef(null)

  React.useEffect(() => {
    if (autoFocus && refInput.current) {
      refInput.current.focus()
    }
  }, [autoFocus])

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()

    onChange(e.target.value, e)
  }

  const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()

    onBlur(e.target.value, e)
  }

  const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    if (e.keyCode === 13) {
      onEnter(e)
    } else {
      onKeyUp(e)
    }
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
      onChange={onInputValueChange}
      onBlur={onInputBlur}
      onKeyUp={onInputKeyUp}
    />
  )
}

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
