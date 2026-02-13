import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';
import { apiExecutor } from '../../services/apiExecutor';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue, signal }) =>
    apiExecutor(
      (reqSignal) => GET(ENDPOINT.PUBLIC.PRODUCTS, { limit: 5 }, reqSignal),
      rejectWithValue,
      signal
    ),
  {
    condition: (_, { getState }) => {
      const { status } = getState().products;
      return status !== 'loading' && status !== 'succeeded';
    },
  }
);
