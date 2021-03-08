import { createSlice } from '@reduxjs/toolkit'
import { LoadingStates } from '../../domain'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    state: LoadingStates.LOADING,
  },
  reducers: {
    complete: (state) => {
      state.state = LoadingStates.COMPLETE
    },
  },
})

export const { complete } = loadingSlice.actions

export default loadingSlice.reducer
