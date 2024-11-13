import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import rootReducer from './redux-reducer';


const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export default store;

declare global {
    interface Window {
        reduxStore: any
    }
}

window.reduxStore = store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>