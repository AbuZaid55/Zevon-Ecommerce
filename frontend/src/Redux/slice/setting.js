import {createSlice} from '@reduxjs/toolkit'

const settingSlice = createSlice({
    name:"Setting",
    initialState:{banner:{}},
    reducers:{
        setSetting(state,action){
            state = action.payload
            return state
        }
    }
})

export default settingSlice;
export const { setSetting } = settingSlice.actions