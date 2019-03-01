import { useEffect, useRef } from 'react'

import styled from '../styles/styled-components'

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

const TextArea = (props: ITextAreaProps) => {
  const {
    className,
    value = '',
    placeholder,
    limit,
    rows,
    disabled = false,
    autoFocus,
    onChange,
    onKeyUp
  } = props
  const refTextArea: React.RefObject<HTMLTextAreaElement> = useRef(null)

  if (autoFocus && refTextArea.current) {
    refTextArea.current.focus()
  }

  return (
    <Wrapper>
      <OriginalTextArea
        className={className}
        ref={refTextArea}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value
          if (
            !disabled &&
            onChange &&
            (limit === undefined || value.length <= limit)
          ) {
            onChange(value, e)
          }
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (disabled) return
          if (onKeyUp) onKeyUp(e)
        }}
      />
      {limit !== undefined && (
        <Count>
          {value.length} / {limit}
        </Count>
      )}
    </Wrapper>
  )
}

export default TextArea

const Wrapper = styled.div(() => ({
  position: 'relative'
}))

const OriginalTextArea = styled.textarea<{
  disabled: boolean
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
    background: theme.bg
  }
}))

const Count = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: '5px',
  right: '5px',
  fontSize: '12px',
  color: theme.fgLight
}))
