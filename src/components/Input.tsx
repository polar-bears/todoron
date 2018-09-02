import * as React from 'react'

import styled from '../styles/theme'

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

export interface IInputState {}

export default class Input extends React.Component<IInputProps, IInputState> {

  private refInput = React.createRef<HTMLInputElement>()

  public componentDidMount () {
    if (this.props.autoFocus) {
      this.focus()
    }
  }

  public focus () {
    const $input = this.refInput.current

    if ($input) {
      $input.focus()
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { disabled, onChange } = this.props

    if (!disabled && onChange) {
      onChange(e.target.value, e)
    }
  }

  private onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { disabled, onBlur } = this.props

    if (!disabled && onBlur) {
      onBlur(e.target.value, e)
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { disabled, onKeyUp, onEnter } = this.props

    if (disabled) {
      return
    }

    if (onKeyUp) {
      onKeyUp(e)
    }

    if (onEnter && e.keyCode === 13 ) {
      onEnter(e)
    }
  }

  public render () {
    const { className, value, placeholder, disabled = false, full = false, size = 'medium' } = this.props

    return (
      <OriginalInput
        className={className}
        innerRef={this.refInput}
        full={full}
        cSize={size}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      />
    )
  }

}

const sizes = {
  small: { padding: '0 6px', fontSize: '12px', height: '26px', minWidth: '26px' },
  medium: { padding: '0 10px', fontSize: '14px', height: '36px', minWidth: '36px' },
  large: { padding: '0 10px', fontSize: '16px', height: '42px', minWidth: '42px' },
}

const OriginalInput = styled.input<{
  full: boolean,
  disabled: boolean,
  cSize: InputSize,
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
    background: theme.bg,
  },
}))
