import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'

export interface Props {
  className?: string
  defaultValue?: string
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  limit?: number
  rows?: number
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyUp?: (value: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export default function TextArea (props: Props) {
  const {
    className,
    defaultValue = '',
    placeholder,
    limit,
    rows,
    disabled = false,
    autoFocus = false,
    onChange = noop,
    onKeyUp = noop
  } = props

  const refTextArea: React.RefObject<HTMLTextAreaElement> = React.useRef(null)

  const [value, setValue] = React.useState('')

  if (autoFocus && refTextArea.current) {
    refTextArea.current.focus()
  }

  const onValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newVal = e.target.value
    if (limit !== undefined) newVal = value.substring(0, limit)

    setValue(newVal)

    onChange(newVal, e)
  }

  const onTextAreaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyUp(e.currentTarget.value, e)
  }

  return (
    <Wrapper>
      <OriginalTextArea
        className={className}
        ref={refTextArea}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onValueChange}
        onKeyUp={onTextAreaKeyUp}
      />
      {limit !== undefined && (
        <Count>
          {value.length} / {limit}
        </Count>
      )}
    </Wrapper>
  )
}

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
