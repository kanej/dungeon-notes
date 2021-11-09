import { Link } from 'gatsby'
import * as React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from '../theme'
import Logo from './icons/logo'

const Layout = ({
  location,
  title,
  children,
}: {
  location: { pathname: string }
  title: string
  children: JSX.Element[]
}): JSX.Element => {
  // @ts-expect-error using a gatsby  global here
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div data-is-root-path={isRootPath}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Page>
          <Wrap>
            <Header>
              <Branding to="/">
                <Logo />
                <h1>{title}</h1>
              </Branding>
              <div />
              {/* <Link to="/tools">tools</Link> */}
              <Link to="/blog">blog</Link>
              <Link to="https://discord.gg/Hejq6K99CQ">discord</Link>
              <Link to="https://github.com/kanej/dungeon-notes">source</Link>
            </Header>
            <Main>{children}</Main>
            <Footer>
              <FooterWrap>
                <div>
                  © {new Date().getFullYear()} Molendinar Solutions Limited
                </div>
                <SocialBar>
                  <div />
                  <Link to="/blog">blog</Link>
                  <Link to="https://discord.gg/Hejq6K99CQ">discord</Link>
                  <Link to="https://github.com/kanej/dungeon-notes">
                    source
                  </Link>
                </SocialBar>
              </FooterWrap>
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
  grid-template-columns: auto 1fr auto auto auto;
  grid-column-gap: 1rem;
  align-items: center;

  margin: 0 auto;
  max-width: ${({ theme }) => theme.spacing.maxWidth};
  padding: 1rem 0 0 1.2rem;
`

const Branding = styled(Link)`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;

  h1 {
    margin: 0;

    font-family: 'Alte Schwabacher';
    text-decoration: none;
  }
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
  background-color: ${({ theme }) => theme.footer.color};
  width: 100%;
  text-align: center;
  color: darkgrey;
  padding: 1rem;

  a {
    color: darkgrey;

    &:hover {
      color: #838181;
    }
  }
`

const FooterWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.spacing.maxWidth};
`

const SocialBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  grid-column-gap: 1rem;
`

export default Layout
