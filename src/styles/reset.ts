import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  interface DefaultTheme {}
}

export const GlobalStyles = createGlobalStyle`
  html, body, div, span,
  h1, h2, h3, h4, h5, h6, p, pre,
  a, code, i, dl, dt, dd, ol, ul, li,
  form, label, input, button, textarea,
  table, tbody, tfoot, thead, tr, th, td,
  canvas, footer, header, menu, nav, section, summary
  {
    box-sizing: border-box;
  }

  /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after, q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  html, body, #root {
    height: 100%;
  }

  .markdown-body {
    padding-bottom: 4px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      background-color: #F2F6F8;
  }

  ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      -webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.15);
      background-color: #E6E8EA;
  }
`
