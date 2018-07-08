import _styled, { CreateStyled } from 'react-emotion'

const colors = {
  gray1: '#FAFCFF',
  gray2: '#F2F6F8',
  gray3: '#E6E8Ea',
  gray4: '#C2C6C8',
  gray5: '#929698',
  gray6: '#626668',
  black: '#333333',
  white: '#FFFFFF',
  blue: '#2189F1',
  red: '#FF5050',
  green: '#82C788',
  yellow: '#F29B25',
}

export const lightTheme = {
  colors,
  bgLighter: colors.white,
  bgLight: colors.gray1,
  bg: colors.gray2,
  bgDark: colors.gray3,
  bgDarker: colors.gray4,
  fgLight: colors.gray5,
  fg: colors.gray6,
  fgDark: colors.black,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
  boxShadowLight: '0 2px 4px rgba(0, 0, 0, 0.08)',
  borderRadius: '2px',
  border: `1px solid ${colors.gray3}`,
  borderDark: `1.5px solid ${colors.gray5}`,
  borderDarker: `1.5px solid ${colors.gray6}`,
}

const styled = _styled as CreateStyled<typeof lightTheme> 

export default styled
