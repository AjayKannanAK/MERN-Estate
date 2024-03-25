import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';  //export default userSlice.reducer; -> this line we have added in userSlice.js
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore} from 'redux-persist';

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {  //localstorage details
    key: "root",
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ //we are adding this one to prevent getting any errors in browsers for not serialising our variables
    serializableCheck: false
  })
});

export const persistor = persistStore(store);