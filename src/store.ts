import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import rootReducer from './redux-reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export const persistor = persistStore(store);

export default store;

declare global {
    interface Window {
        reduxStore: any
    }
}

window.reduxStore = store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>