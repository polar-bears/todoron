import * as React from 'react'

import styled from '../styles/styled-components'
import Icon from './Icon'

export interface ITagProps {
  className?: string
  color: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Tag: React.SFC<ITagProps> = ({
  checked,
  onChange,
  className,
  color,
  children
}) => {
  return (
    <Wrapper
      className={className}
      color={color}
      checkable={checked !== undefined}
      onClick={() => checked !== undefined && onChange && onChange(!checked)}
    >
      {checked === true && <StyledIcon name='Check' />}
      {children}
    </Wrapper>
  )
}

export default Tag

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
