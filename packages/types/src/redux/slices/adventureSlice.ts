import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Adventure, Chapter, GUID } from '../../domain'
import { toSlug } from '../../utils/toSlug'

export interface AdventureSliceState extends Adventure {
  chapterMap: { [key: string]: Chapter }
}

const adventureSlice = createSlice({
  name: 'adventure',
  initialState: {
    name: '',
    version: '0.1',
    edition: 5,
    levels: '1-10',
    description: '',
    chapters: [],
    chapterMap: {},
  } as AdventureSliceState,
  reducers: {
    setAdventure: (
      state,
      {
        payload: { adventure, chapters },
      }: PayloadAction<{ adventure: Adventure; chapters: Array<Chapter> }>,
    ) => {
      state.name = adventure.name
      state.edition = adventure.edition
      state.levels = adventure.levels
      state.description = adventure.description

      state.chapters = chapters.map(({ id }) => id)
      state.chapterMap = chapters.reduce((acc, chapter) => {
        return {
          ...acc,
          [chapter.id]: chapter,
        }
      }, {})
    },
    updateAdventureName: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name
    },
    updateAdventureLevels: (
      state,
      {
        payload: { startingLevel, endingLevel },
      }: PayloadAction<{ startingLevel: number; endingLevel: number }>,
    ) => {
      state.levels = `${startingLevel}-${endingLevel}`
    },
    updateAdventureDescription: (
      state,
      action: PayloadAction<{ description: string }>,
    ) => {
      if (!action.payload.description) {
        return
      }

      state.description = action.payload.description
    },
    addChapter: (
      state,
      { payload: { id, name } }: PayloadAction<{ id: GUID; name: string }>,
    ) => {
      const newChapter: Chapter = {
        id,
        name,
        slug: toSlug(name),
        body: 'And so our adventurers where in the pub when ...',
      }

      state.chapters = [...state.chapters, id]
      state.chapterMap[id] = newChapter
    },
    updateChapterName: (
      state,
      { payload: { id, name } }: PayloadAction<{ id: GUID; name: string }>,
    ) => {
      state.chapterMap[id].name = name
      state.chapterMap[id].slug = toSlug(name)
    },
    updateChapterBody: (
      state,
      { payload: { id, body } }: PayloadAction<{ id: GUID; body: string }>,
    ) => {
      state.chapterMap[id].body = body
    },
  },
})

// eslint-disable-next-line import/no-unused-modules
export const {
  setAdventure,
  updateAdventureName,
  updateAdventureLevels,
  updateAdventureDescription,
  addChapter,
  updateChapterName,
  updateChapterBody,
} = adventureSlice.actions

export const adventureSliceReducer = adventureSlice.reducer
