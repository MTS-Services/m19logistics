import { createAsyncThunk } from '@reduxjs/toolkit';
import { POST, GET, PUT, DELETE } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';
import { apiExecutor } from '../../services/apiExecutor';

export const createPricingTier = createAsyncThunk(
  'pricing/createTier',
  async (payload, { rejectWithValue, signal }) =>
    apiExecutor((reqSignal) => POST(ENDPOINT.API.PRICING.CREATE, payload, reqSignal), rejectWithValue, signal)
);

export const fetchPricingTiers = createAsyncThunk(
  'pricing/fetchAll',
  async (_, { rejectWithValue, signal }) =>
    apiExecutor((reqSignal) => GET(ENDPOINT.API.PRICING.GET_ALL, null, reqSignal), rejectWithValue, signal)
);

export const updatePricingTier = createAsyncThunk(
  'pricing/updateTier',
  async ({ id, data }, { rejectWithValue, signal }) =>
    apiExecutor((reqSignal) => PUT(ENDPOINT.API.PRICING.UPDATE(id), data, reqSignal), rejectWithValue, signal)
);

export const deletePricingTier = createAsyncThunk(
  'pricing/deleteTier',
  async (id, { rejectWithValue, signal }) =>
    apiExecutor((reqSignal) => DELETE(ENDPOINT.API.PRICING.DELETE(id), reqSignal), rejectWithValue, signal)
);

export default {};
