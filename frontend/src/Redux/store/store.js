import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slice/user'
import productSlice from '../slice/product';
import settingSlice from '../slice/setting';
import locationSlice from '../slice/location';

const store = configureStore({
    reducer:{
        user:userSlice.reducer,
        product:productSlice.reducer,
        setting:settingSlice.reducer,
        location:locationSlice.reducer
    },
    devTools:process.env.NODE_ENV !== "production",
})

export default store;