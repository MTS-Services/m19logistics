import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import pricingReducer from '../features/pricing/pricingSlice';

const store = configureStore({
  reducer: {
    products: productsReducer, // <- key must match useSelector
    pricing: pricingReducer,
  },
});

export default store;
