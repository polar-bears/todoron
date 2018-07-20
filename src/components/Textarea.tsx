import * as React from 'react'

import styled from '../styles/theme'

export interface ITextAreaProps {
  className?: string
  value?: string
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  limit?: number
  rows?: number
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export interface ITextAreaState {}

export default class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {

  private refTextArea = React.createRef<HTMLTextAreaElement>()

  public componentDidMount () {
    if (this.props.autoFocus) {
      this.focus()
    }
  }

  public focus () {
    const $textarea = this.refTextArea.current

    if ($textarea) {
      $textarea.focus()
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { disabled, limit, onChange } = this.props
    const value = e.target.value

    if (!disabled && onChange && (limit === undefined || value.length <= limit)) {
      onChange(value, e)
    }
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { disabled, onKeyUp } = this.props

    if (disabled) {
      return
    }

    if (onKeyUp) {
      onKeyUp(e)
    }
  }

  public render () {
    const { className, value = '', placeholder, limit, rows, disabled = false } = this.props

    return (
      <Wrapper>
        <OriginalTextArea
          className={className}
          innerRef={this.refTextArea}
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        {limit !== undefined && <Count>{value.length} / {limit}</Count>}
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(() => ({
  position: 'relative',
}))

const OriginalTextArea = styled.textarea<{
  disabled: boolean,
}>(({ theme, disabled }) => ({
  padding: '8px',
  display: 'block',
  width: '100%',
  border: 'none',
  outline: 'none',
  color: theme.fg,
  background: 'transparent',
  borderRadius: theme.borderRadius,
  resize: 'none',
  transition: 'background 0.3s',
  '&:focus': {
    background: theme.bg,
  },
}))

const Count = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: '5px',
  right: '5px',
  fontSize: '12px',
  color: theme.fgLight,
}))
