import { createSlice } from '@reduxjs/toolkit';
import { createPricingTier, fetchPricingTiers, updatePricingTier, deletePricingTier } from './pricingAPI';

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: null,
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    resetPricingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPricingTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPricingTier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // apiExecutor returns response.data — backend wraps created item in `data`
        const created = action.payload?.data || action.payload;
        if (created) state.list.push(created);
      })
      .addCase(createPricingTier.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || 'Failed to create pricing tier';
      })
      .addCase(fetchPricingTiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingTiers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const payload = action.payload?.data || action.payload || [];
        state.list = payload;
      })
      .addCase(fetchPricingTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to fetch pricing tiers';
      });
    // Update pricing tier
    builder
      .addCase(updatePricingTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePricingTier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.data || action.payload;
        if (updated) {
          const idx = state.list.findIndex((t) => t.id === updated.id);
          if (idx !== -1) state.list[idx] = updated;
        }
      })
      .addCase(updatePricingTier.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || 'Failed to update pricing tier';
      });
    // Delete pricing tier
    builder
      .addCase(deletePricingTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePricingTier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // payload may be { success, data } or just data/id
        const payload = action.payload?.data || action.payload;
        const id = payload?.id || payload;
        if (id) state.list = state.list.filter((t) => t.id !== id);
      })
      .addCase(deletePricingTier.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || 'Failed to delete pricing tier';
      });
  },
});

export const { resetPricingError } = pricingSlice.actions;
export default pricingSlice.reducer;
