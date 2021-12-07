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
              <div />
              <Branding to="/">
                <Logo />
                <h1>{title}</h1>
              </Branding>
              <div />

              <div />
              <Links>
                <Link to="/changelog">changlog</Link>
                <a href="https://discord.gg/Hejq6K99CQ">discord</a>
                <a href="https://github.com/kanej/dungeon-notes">source</a>
              </Links>
              <div />
            </Header>
            <Main>{children}</Main>
            <Footer>
              <FooterWrap>
                <Licensing>
                  <div>
                    © {new Date().getFullYear()} Molendinar Solutions Limited
                  </div>
                  <div>
                    <IconLicense>
                      Icons made by Kier Heyl and Lorc. Available on{' '}
                      <a href="https://game-icons.net">game-icons</a>
                    </IconLicense>
                  </div>
                </Licensing>

                <SocialBar>
                  <div />
                  <Link to="/changelog">changelog</Link>
                  <a href="https://discord.gg/Hejq6K99CQ">discord</a>
                  <a href="https://github.com/kanej/dungeon-notes">source</a>
                  <div />
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
  align-items: center;

  grid-template-columns: 1fr auto 1fr;

  @media (min-width: 576px) {
    grid-template-columns: auto 1fr auto auto 1fr auto;
    grid-column-gap: 1rem;

    margin: 0 auto;
    max-width: ${({ theme }) => theme.spacing.maxWidth};
    padding: 1rem 0 0 1.2rem;
  }
`

const Links = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0.5rem 0;
  text-align: center;
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
  padding: 2.5rem 0rem;

  @media (min-width: 576px) {
    padding: 2.5rem 1.2rem;
  }
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
  display: flex;
  flex-direction: column-reverse;
  row-gap: 1.5rem;

  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    max-width: ${({ theme }) => theme.spacing.maxWidth};
  }
`

const Licensing = styled.div`
  display: grid;

  grid-row-gap: 1rem;
  text-align: center;

  @media (min-width: 576px) {
    text-align: left;
  }
`

const IconLicense = styled.p`
  margin-bottom: 0;
  font-size: 0.7rem;

  @media (min-width: 576px) {
    font-size: 0.8rem;
  }
`

const SocialBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto;

  @media (min-width: 576px) {
    grid-template-columns: 1fr auto auto auto 1fr;
    grid-column-gap: 1rem;
  }
`

export default Layout
