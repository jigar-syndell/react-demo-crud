import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';

import { sideBarReducer, userReducer } from './reducers/generalReducer';

const store = configureStore({
    reducer: {
        sidebar: sideBarReducer,
        User : userReducer
    }
})

setupListeners(store.dispatch)
export default store;