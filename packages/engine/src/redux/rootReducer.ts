import { adventureSliceReducer } from '@dungeon-notes/types'
import { combineReducers } from '@reduxjs/toolkit'
import repoReducer from './slices/repoSlice'

const rootReducer = combineReducers({
  repo: repoReducer,
  adventure: adventureSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
