import * as hljs from 'highlight.js'
import React, { useEffect, useRef } from 'react'

interface IProps {
  value: string
  language: string
}

const CodeBlock: React.SFC<IProps> = ({ language, value }) => {
  const refCode: React.RefObject<HTMLElement> = useRef(null)

  useEffect(() => {
    if (refCode.current) {
      hljs.highlightBlock(refCode.current)
    }
  })

  return (
    <pre>
      <code ref={refCode} className={`language-${language}`}>
        {value}
      </code>
    </pre>
  )
}

export default CodeBlock
