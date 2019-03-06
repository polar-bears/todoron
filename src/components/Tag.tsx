import * as React from 'react'

import styled from '../styles/styled-components'
import Icon from './Icon'
import noop from './../libs/noop'

export interface Props {
  className?: string
  color: string
  checked?: boolean
  children?: React.ReactNode
  onChange?: (checked: boolean) => void
}

export default function Tag (props: Props) {
  const { checked = true, className, color, children, onChange = noop } = props

  const onTagClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    onChange(!checked)
  }

  return (
    <Wrapper
      className={className}
      color={color}
      checkable={checked}
      onClick={onTagClick}
    >
      {checked === true && <StyledIcon name='Check' />}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  checkable: boolean
  color: string
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
  userSelect: 'none'
}))

const StyledIcon = styled(Icon)(() => ({
  color: 'white'
}))
