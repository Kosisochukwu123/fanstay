import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    city: '',
    event: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    minRating: '',
    checkIn: '',
    checkOut: '',
  },
  reducers: {
    setSearchParams: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetSearch: () => ({
      city: '',
      event: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      minRating: '',
      checkIn: '',
      checkOut: '',
    }),
  },
});

export const { setSearchParams, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
