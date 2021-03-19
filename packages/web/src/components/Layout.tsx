import React from 'react'
import styled from 'styled-components'
import { Chapter } from '../domain'
import useCreateAChapter from '../hooks/useCreateAChapter'

const Layout: React.FC = ({ children }) => {
  const handleCreateAChapter = useCreateAChapter()
  const chapters: Array<Chapter> = []

  return (
    <Page>
      <LeftDrawer>
        <h2>Dungeon Notes</h2>

        <NavPanel>
          <List>
            {chapters.map(({ name, slug }: { name: string; slug: string }) => (
              <li key={slug}>
                <a href={slug}>{name}</a>
              </li>
            ))}
          </List>
          <AddChapterBtnWrap>
            <button type="button" onClick={handleCreateAChapter}>
              Add chapter
            </button>
          </AddChapterBtnWrap>
        </NavPanel>
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

  background-color: #fafaf7;
  // background-image: url(/background.png);
  // background-repeat: repeat;
`

const LeftDrawer = styled.div`
  width: 200px;
  padding: 1rem;
`

const NavPanel = styled.div`
  background-color: white;
  padding: 0.5rem;
`

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
  }
`

const Main = styled.main`
  height: 100vh;
  padding: 2rem;
`

const AddChapterBtnWrap = styled.div`
  margin-top: 2rem;
`

export default Layout
