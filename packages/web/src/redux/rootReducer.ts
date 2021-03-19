import { combineReducers } from '@reduxjs/toolkit'

import adventureReducer from './slices/adventureSlices'
import loadingReducer from './slices/loadingSlice'

const rootReducer = combineReducers({
  loading: loadingReducer,
  adventure: adventureReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
