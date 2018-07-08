import { injectGlobal } from 'react-emotion'

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  html, body, div, span,
  h1, h2, h3, h4, h5, h6, p, pre,
  a, code, i, dl, dt, dd, ol, ul, li,
  form, label, input, button,
  table, tbody, tfoot, thead, tr, th, td,
  canvas, footer, header, menu, nav, section, summary
  {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
  }

  #root {
    height: 100%;
  }
`
