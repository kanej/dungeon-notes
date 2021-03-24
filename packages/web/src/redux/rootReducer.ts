import { adventureSliceReducer } from '@dungeon-notes/types'
import { combineReducers } from '@reduxjs/toolkit'
import loadingReducer from './slices/loadingSlice'

const rootReducer = combineReducers({
  loading: loadingReducer,
  adventure: adventureSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
