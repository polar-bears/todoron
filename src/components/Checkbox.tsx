import * as React from 'react'

import styled from '../styles/styled-components'

export interface ICheckboxProps {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Checkbox: React.SFC<ICheckboxProps> = ({
  className,
  checked = false,
  onChange,
  children
}) => {
  return (
    <Wrapper className={className}>
      <OriginalCheckbox
        checked={checked}
        type='checkbox'
        onChange={() => onChange && onChange(!checked)}
      />
      <Content>{children}</Content>
    </Wrapper>
  )
}

export default Checkbox

const Wrapper = styled.label(({ theme }) => ({
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
