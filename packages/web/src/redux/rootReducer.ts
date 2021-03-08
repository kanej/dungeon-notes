import { combineReducers } from '@reduxjs/toolkit'

import loadingReducer from './slices/loadingSlice'
import adventureReducer from './slices/adventureSlices'

const rootReducer = combineReducers({
  loading: loadingReducer,
  adventure: adventureReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
