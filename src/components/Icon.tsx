import * as React from 'react'
import * as icons from 'react-feather'

export type IconSize = 'small' | 'medium' | 'large'

const sizes = {
  small: '16px',
  medium: '18px',
  large: '22px'
}

export interface IIconProps {
  className?: string,
  name?: string
  size?: IconSize
}

export interface IIconState {}

export default class Icon extends React.Component<IIconProps, IIconState> {

  public render () {
    const { className, name, size = 'medium' } = this.props

    const IconSvg = name && (icons as any)[name]
    const px = sizes[size]

    return IconSvg ? <IconSvg className={className} size={px}/> : null
  }

}
