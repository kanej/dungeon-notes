/* eslint-disable import/no-unused-modules */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum RepoState {
  UNINITIALISED = 'UNINITIALISED',
  EMPTY = 'EMPTY',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

type RepoSlice = {
  state: RepoState
  adventureName: null | string
}

const initialState: RepoSlice = {
  state: RepoState.UNINITIALISED,
  adventureName: null,
}

export const repoSlice = createSlice({
  name: 'repo',
  initialState: initialState as RepoSlice,
  reducers: {
    initialise: (state: RepoSlice, action: PayloadAction<RepoState>) => {
      state.state = action.payload
    },
    setup: (state: RepoSlice, action: PayloadAction<{ name: string }>) => {
      state.state = RepoState.VALID
      state.adventureName = action.payload.name
    },
  },
})

export const { initialise, setup } = repoSlice.actions

export default repoSlice.reducer
