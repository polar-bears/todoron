import * as React from 'react'

import styled from '../styles/styled-components'
import Icon from './Icon'

export interface ITagProps {
  className?: string
  color: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export interface ITagState {}

export default class Tag extends React.Component<ITagProps, ITagState> {

  public onClick = () => {
    const { checked, onChange } = this.props

    if (checked !== undefined && onChange) {
      onChange(!checked)
    }
  }

  public render () {
    const { className, color, checked, children } = this.props

    return (
      <Wrapper
        className={className}
        color={color}
        checkable={checked !== undefined}
        onClick={this.onClick}
      >
        {checked === true && <StyledIcon name='Check'/>}
        {children}
      </Wrapper>
    )
  }

}

const Wrapper = styled.div<{
  checkable: boolean,
  color: string,
}>(({ checkable, color, theme }) => ({
  display: 'inline-block',
  paddingRight: '4px',
  paddingLeft: checkable ? '22px' : '4px',
  height: '20px',
  lineHeight: '20px',
  minWidth: '20px',
  maxWidth: '100px',
  borderRadius: theme.borderRadius,
  fontSize: '12px',
  color: 'white',
  background: color,
  verticalAlign: 'middle',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  userSelect: 'none',
}))

const StyledIcon = styled(Icon)(() => ({
  color: 'white',
}))
