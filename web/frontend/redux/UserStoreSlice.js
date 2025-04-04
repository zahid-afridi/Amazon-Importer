import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    StoreDetail: null, // Corrected the typo here
    amzProduct:0,
    csvProduct:0,
};

export const StoreSlice = createSlice({
    name: 'product',
    initialState: initialState,
    reducers: {
        UpdateStoreDetail: (state, action) => { // Corrected the typo here
            state.StoreDetail = action.payload; // Corrected the typo here
        },
        updateAmzProduct:(state,action)=>{
            state.amzProduct=action.payload
        },
        updateCsvProduct:(state,action)=>{
            state.csvProduct=action.payload
        }
    },
});

export const { UpdateStoreDetail ,updateAmzProduct,updateCsvProduct} = StoreSlice.actions; // Corrected the export statement
export default StoreSlice.reducer;
