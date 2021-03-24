/* eslint-disable import/no-unused-modules */
import { createSlice } from '@reduxjs/toolkit'

export enum LoadingStates {
  'LOADING' = 'LOADING',
  'COMPLETE' = 'COMPLETE',
}

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
