import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'

export interface Props {
  className?: string
  checked?: boolean
  children?: React.ReactNode
  onChange?: (checked: boolean) => void
}

export default function Checkbox (props: Props) {
  const { className, children, checked = false, onChange = noop } = props

  const onCheckbox = () => onChange(!checked)

  return (
    <Wrapper className={className}>
      <OriginalCheckbox
        type='checkbox'
        checked={checked}
        onChange={onCheckbox}
      />
      <Content>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled.label(() => ({
  verticalAlign: 'middle',
  userSelect: 'none',
  cursor: 'pointer'
}))

const OriginalCheckbox = styled.input(() => ({
  display: 'none'
}))

const Content = styled.span(({ theme }) => ({
  position: 'relative',
  '&::before': {
    marginRight: '8px',
    display: 'inline-block',
    width: '13px',
    height: '13px',
    content: '""',
    verticalAlign: 'text-bottom',
    border: theme.borderDark,
    borderRadius: theme.borderRadius
  },
  '&::after': {
    position: 'absolute',
    top: '1px',
    display: 'block',
    width: '16px',
    height: '8px',
    content: '""',
    borderLeft: theme.borderDark,
    borderBottom: theme.borderDark,
    borderWidth: '2px',
    opacity: 0,
    transform: 'rotate(-45deg)'
  },
  'input:checked + &': {
    '&::after': {
      opacity: 1
    }
  }
}))
