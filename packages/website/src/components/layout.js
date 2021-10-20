import * as React from 'react'
import { Link } from 'gatsby'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from '../theme'

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div data-is-root-path={isRootPath}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Page>
          <Wrap>
            <Header>
              <Branding>
                <Link to="/">{title}</Link>
              </Branding>
              <div></div>
              {/* <Link to="/tools">tools</Link> */}
              <Link to="/blog">blog</Link>
              <Link to="/blog">discord</Link>
            </Header>
            <Main>{children}</Main>
            <Footer>
              © {new Date().getFullYear()} Molendinar Solutions Limited
            </Footer>
          </Wrap>
        </Page>
      </ThemeProvider>
    </div>
  )
}

const GlobalStyle = createGlobalStyle`
  html {
    line-height: 1.5;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${theme.background.color};
    font-family: ${theme.text.fontFamily};
    color: ${theme.text.body};
  }

  h1 > a {
    color: inherit;
    text-decoration: none;
  }

  h2 > a,
  h3 > a,
  h4 > a,
  h5 > a,
  h6 > a {
    text-decoration: none;
    color: inherit;
  }

  a {
    color: ${theme.text.primary};
  }

  a:hover,
  a:focus {
    text-decoration: none;
  }
`

const Page = styled.div`
  height: 100vh;
  width: 100%;
`

const Header = styled.nav`
  display: grid;
  width: 100%;
  grid-template-columns: auto 1fr auto auto;
  grid-column-gap: 1rem;
  align-items: center;

  margin: 0 auto;
  max-width: ${({ theme }) => theme.spacing.maxWidth};
  padding: 0 0 0 1.2rem;
`

const Branding = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
`

const Wrap = styled.div`
  min-height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 100%;
`

const Main = styled.main`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.spacing.maxWidth};
  padding: 2.5rem 1.2rem;
`

const Footer = styled.footer`
  background: white;
  width: 100%;
  text-align: center;
  color: darkgrey;
  padding: 1rem;
`

export default Layout
