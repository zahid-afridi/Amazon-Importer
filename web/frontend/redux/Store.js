import { configureStore } from "@reduxjs/toolkit";
import StoreSlice from './UserStoreSlice.js'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
    // // Specify the reducers you want to persist
    // whitelist: ['Auth'] // Assuming 'user' is the slice to persist
};
const persistedReducer = persistReducer(persistConfig, StoreSlice);
export const store = configureStore({
    reducer: {
        StoreInfo: persistedReducer // Correctly setting the persisted reducer under its slice name
    }

});
export const persistor = persistStore(store);
