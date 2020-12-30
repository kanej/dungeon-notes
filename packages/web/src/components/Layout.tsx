import { gql, useQuery } from '@apollo/client'
import React from 'react'
import styled from 'styled-components'

const ADVENTURES_QUERY = gql`
  query GetAdventureList {
    campaign {
      adventures {
        name
        slug
      }
    }
  }
`

const Layout: React.FC = ({ children }) => {
  const { loading, error, data } = useQuery(ADVENTURES_QUERY, {
    pollInterval: 1000,
  })

  if (loading) {
    return <div>loaindg...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const {
    campaign: { adventures },
  } = data

  return (
    <Page>
      <LeftDrawer>
        <h2>Dungeon Notes</h2>

        {loading ? (
          <div>...</div>
        ) : (
          <div>
            <ul>
              {adventures.map(
                ({ name, slug }: { name: string; slug: string }) => (
                  <li key={slug}>
                    <a href={slug}>{name}</a>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </LeftDrawer>
      <Main>{children}</Main>
    </Page>
  )
}

const Page = styled.div`
  display: grid;

  grid-template-columns: auto 1fr;

  width: 100%;
  height: 100vh;
  background: white;
`

const LeftDrawer = styled.div`
  width: 200px;
  padding: 1rem;
`

const Main = styled.main`
  height: 100vh;
  padding: 2rem;
`

export default Layout
