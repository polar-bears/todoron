import * as React from 'react'
import * as hljs from 'highlight.js'

interface IProps {
  value: string
  language: string
}

interface IState { }

export default class CodeBlock extends React.Component<IProps, IState> {

  private refCode = React.createRef<HTMLElement>()

  public componentDidMount () {
    const el = this.refCode.current!
    hljs.highlightBlock(el)
  }

  public componentDidUpdate () {
    const el = this.refCode.current!
    hljs.highlightBlock(el)
  }

  public render () {
    const { language, value } = this.props

    return (
      <pre>
        <code
          ref={this.refCode}
          className={`language-${language}`}
        >
          {value}
        </code>
      </pre>
    )
  }
}
