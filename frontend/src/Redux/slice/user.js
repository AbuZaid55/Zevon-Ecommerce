import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:"User",
    initialState:{},
    reducers:{
        setUser(state,action){
            state = action.payload
            return state
        }
    }
})

export default userSlice;
export const { setUser } = userSlice.actions