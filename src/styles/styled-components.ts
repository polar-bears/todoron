import * as styledComponents from 'styled-components'
import { ThemedStyledComponentsModule } from 'styled-components'

import { lightTheme } from './theme'

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<typeof lightTheme>

export { css, createGlobalStyle, keyframes, ThemeProvider }
export default styled
