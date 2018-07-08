import * as React from 'react'

import styled from '../styles/theme'

export interface ICheckboxProps {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export interface ICheckboxState {}

export default class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {

  public onChange = () => {
    const { checked = false, onChange } = this.props

    if (onChange) {
      onChange(!checked)
    }
  }

  public render () {
    const { className, children, checked = false } = this.props

    return (
      <Wrapper className={className}>
        <OriginalCheckbox checked={checked} type='checkbox' onChange={this.onChange}/>
        <Content>{children}</Content>
      </Wrapper>
    )
  }

}

const Wrapper = styled.label(({ theme }) => ({
  verticalAlign: 'middle',
  userSelect: 'none',
  cursor: 'pointer',
}))

const OriginalCheckbox = styled.input(() => ({
  display: 'none',
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
    borderRadius: theme.borderRadius,
  },
  '&::after': {
    position: 'absolute',
    top: '1',
    display: 'block',
    width: '16px',
    height: '8px',
    content: '""',
    borderLeft: theme.borderDark,
    borderBottom: theme.borderDark,
    borderWidth: '2px',
    opacity: 0,
    transform: 'rotate(-45deg)',
  },
  'input:checked + &': {
    '&::after': {
      opacity: 1,
    },
  },
}))
