import {createSlice} from '@reduxjs/toolkit'

const locationSlice = createSlice({
    name:"Location",
    initialState:'',
    reducers:{
        setLocation(state,action){
            state = action.payload
            return state
        }
    }
})

export default locationSlice;
export const { setLocation } = locationSlice.actions