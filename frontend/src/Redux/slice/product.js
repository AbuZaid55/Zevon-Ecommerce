import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: "Product",
    initialState: {
        allProduct: [],
        category:[],
        maxPrice:0
    },
    reducers: {
        setProduct(state, action) {
            state.allProduct = action.payload
            let cat = []
            let maxPrice=0
            action.payload.map((item) => {
                const isExist = cat.includes(item.category)
                if (!isExist) {
                    cat.push(item.category)
                }
                if(item.sellprice>maxPrice){
                    maxPrice = item.sellprice
                }
            })
            state.category = cat
            state.maxPrice = maxPrice
            return state
        }
    }
})

export default productSlice;
export const { setProduct } = productSlice.actions