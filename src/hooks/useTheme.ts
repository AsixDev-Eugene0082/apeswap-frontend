import { useContext, useEffect } from 'react'
import { ThemeContext as StyledThemeCopntext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { useColorMode } from 'theme-ui'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [, setColorMode] = useColorMode()
  useEffect(() => {
    setColorMode(isDark ? 'dark' : 'light')
  }, [isDark, setColorMode])
  const theme = useContext(StyledThemeCopntext)
  return { isDark, toggleTheme, theme }
}

export default useTheme
