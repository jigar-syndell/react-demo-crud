import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';

import { sideBarReducer } from './reducers/generalReducer';

const store = configureStore({
    reducer: {
        sidebar: sideBarReducer,
    }
})

setupListeners(store.dispatch)
export default store;