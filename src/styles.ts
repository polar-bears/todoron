import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  interface DefaultTheme {}
}

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
  }
`
