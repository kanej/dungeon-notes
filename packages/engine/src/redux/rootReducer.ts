import { combineReducers } from '@reduxjs/toolkit'

import adventureReducer from './slices/adventureSlice'
import repoReducer from './slices/repoSlice'

const rootReducer = combineReducers({
  repo: repoReducer,
  adventure: adventureReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
