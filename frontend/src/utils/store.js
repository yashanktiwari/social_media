import { configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: '25BAD84B77969EA59B669EE76BE6E',
  storage
}

const persistUserReducer = persistReducer(persistConfig, userSlice);

export const store = configureStore({
    reducer: {
        user: persistUserReducer
    }
});

// export default store;

export const persistedStore = persistStore(store);