import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slice/user'
import productSlice from '../slice/product';
import settingSlice from '../slice/setting';

const store = configureStore({
    reducer:{
        user:userSlice.reducer,
        product:productSlice.reducer,
        setting:settingSlice.reducer,
    },
    devTools:process.env.NODE_ENV !== "production",
})

export default store;