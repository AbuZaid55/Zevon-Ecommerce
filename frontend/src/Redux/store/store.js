import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slice/user'

const store = configureStore({
    reducer:{
        user:userSlice.reducer
    },
    devTools:process.env.NODE_ENV !== "production",
})

export default store;