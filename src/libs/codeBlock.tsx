import * as React from 'react'
import * as hljs from 'highlight.js'

interface IProps {
  value: string
  language: string
}

interface IState { }

export default class CodeBlock extends React.Component<IProps, IState> {

  private codeEl?: React.RefObject<HTMLInputElement>

  public constructor (props: IProps) {
    super(props)
    this.setRef = this.setRef.bind(this)
  }

  private setRef (el: any) {
    this.codeEl = el
  }

  public componentDidMount () {
    if (this.codeEl) hljs.highlightBlock(this.codeEl)
  }

  public componentDidUpdate () {
    if (this.codeEl) hljs.highlightBlock(this.codeEl)
  }

  public render () {

    return (
      <pre>
        <code
          ref={this.setRef}
          className={`language-${this.props.language}`}
        >
          {this.props.value}
        </code>
      </pre>
    )
  }
}