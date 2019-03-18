import * as React from 'react'
import * as icons from 'react-feather'
import noop from '../libs/noop'

export type IconSize = 'small' | 'medium' | 'large'

const sizes = {
  small: '16px',
  medium: '18px',
  large: '22px'
}

export interface Props {
  className?: string
  name?: string
  size?: IconSize
  onClick?: React.MouseEventHandler
}

export default function Icon (props: Props) {
  const { className, name, size = 'medium', onClick = noop } = props

  const IconSvg = name && (icons as any)[name]
  const px = sizes[size]

  return IconSvg ? (
    <IconSvg className={className} size={px} onClick={onClick} />
  ) : null
}
