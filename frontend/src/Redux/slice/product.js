import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: "Product",
    initialState: {
        allProduct: [],
        category:[],
    },
    reducers: {
        setProduct(state, action) {
            state.allProduct = action.payload
            let cat = []
            action.payload.map((item) => {
                const isExist = cat.includes(item.category)
                if (!isExist) {
                    cat.push(item.category)
                }
            })
            state.category = cat
            return state
        }
    }
})

export default productSlice;
export const { setProduct } = productSlice.actions