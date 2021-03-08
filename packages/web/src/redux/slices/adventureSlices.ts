import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Adventure } from '../../domain'

export const adventureSlice = createSlice({
  name: 'adventure',
  initialState: {
    name: '',
    edition: '5e',
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
  },
})

// Action creators are generated for each case reducer function
export const { setAdventure } = adventureSlice.actions

export default adventureSlice.reducer
