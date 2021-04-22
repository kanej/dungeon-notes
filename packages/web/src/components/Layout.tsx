import { Chapter, GUID, updateChapterOrder } from '@dungeon-notes/types'
import React, { useCallback } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useCreateAChapter from '../hooks/useCreateAChapter'
import { RootState } from '../redux/rootReducer'
import { LoadingStates } from '../redux/slices/loadingSlice'
import { AppDispatch } from '../redux/store'

const reorder = (
  list: GUID[],
  startIndex: number,
  endIndex: number,
): GUID[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Layout: React.FC = ({ children }) => {
  const dispatch: AppDispatch = useDispatch()

  const chapters = useSelector<RootState, Chapter[]>((state) =>
    state.loading.state === LoadingStates.COMPLETE
      ? state.adventure.chapters.reduce(
          (acc: Chapter[], item: string) => [
            ...acc,
            state.adventure.chapterMap[item],
          ],
          [],
        )
      : [],
  )
  const handleCreateAChapter = useCreateAChapter()

  const handleDragEnd = useCallback(
    async ({ source, destination }: DropResult) => {
      if (!destination) {
        return
      }

      if (source.index === destination.index) {
        return
      }

      const originalChapterIds = chapters.map(({ id }) => id)

      const updatedChapterIds = reorder(
        originalChapterIds,
        source.index,
        destination.index,
      )

      const command = updateChapterOrder({ chapters: updatedChapterIds })

      await dispatch(command)

      const response = await fetch('http://localhost:9898/api/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (response.status !== 200) {
        return dispatch(updateChapterOrder({ chapters: originalChapterIds }))
      }
    },
    [chapters, dispatch],
  )

  return (
    <Page>
      <LeftDrawer>
        <h2>Dungeon Notes</h2>

        <NavPanel>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {chapters.map(({ id, name, slug }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Link to={`/chapters/${id}/${slug}`}>{name}</Link>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>

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
