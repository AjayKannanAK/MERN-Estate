import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';  //export default userSlice.reducer; -> this line we have added in userSlice.js

export const store = configureStore({
  reducer: {user: userReducer},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ //we are adding this one to prevent getting any errors in browsers for not serialising our variables
    serializableCheck: false
  })
});