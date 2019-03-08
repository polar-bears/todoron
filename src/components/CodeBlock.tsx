import * as hljs from 'highlight.js'
import React, { useEffect, useRef } from 'react'

interface Props {
  value: string
  language: string
}

export default function CodeBlock (props: Props) {
  const { language, value } = props

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
