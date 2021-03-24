import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Adventure } from '../../domain'

const adventureSlice = createSlice({
  name: 'adventure',
  initialState: {
    name: '',
    version: '0.1',
    edition: 5,
    levels: '1-10',
    description: '',
    chapters: [],
  } as Adventure,
  reducers: {
    setAdventure: (state, action: PayloadAction<Adventure>) => {
      const payload = action.payload
      state.name = payload.name
      state.edition = payload.edition
      state.levels = payload.levels
      state.description = payload.description
      state.chapters = payload.chapters
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
  },
})

// eslint-disable-next-line import/no-unused-modules
export const {
  setAdventure,
  updateAdventureName,
  updateAdventureLevels,
  updateAdventureDescription,
} = adventureSlice.actions

export const adventureSliceReducer = adventureSlice.reducer
