import * as React from 'react'
import styled from '../styles/theme'

export interface ILogoProps {
  className?: string
}

export interface ILogoState {}

export default class Logo extends React.Component<ILogoProps, ILogoState> {

  public render () {
    const { className } = this.props

    return (
      <Wrapper className={className}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'>
          <g>
            <g>
              {/* tslint:disable:max-line-length */}
              <path d='M140.37,13.66l24.69,24.69a8,8,0,0,1,0,11.31l-59.4,59.4a8,8,0,0,1-11.31,0l-59.4-59.4a8,8,0,0,1,0-11.31L59.63,13.66A8,8,0,0,0,54,0H8A8,8,0,0,0,0,8V92a8,8,0,0,0,8,8H42a8,8,0,0,1,8,8v34a8,8,0,0,0,8,8h84a8,8,0,0,0,8-8V108a8,8,0,0,1,8-8h34a8,8,0,0,0,8-8V8a8,8,0,0,0-8-8H146A8,8,0,0,0,140.37,13.66Z'/>
              <path d='M90.82,81a7,7,0,0,1-4.95-2.05L64.05,57.13a7,7,0,0,1,9.9-9.9L90.82,64.1l35-35.05a7,7,0,1,1,9.9,9.9l-40,40A7,7,0,0,1,90.82,81Z'/>
              {/* tslint:enable:max-line-length */}
            </g>
          </g>
        </svg>
      </Wrapper>
    )
  }

}

const Wrapper = styled.span(({ theme }) => ({
  fill: theme.bgDarker,
  svg: {
    width: '48px',
  },
}))
