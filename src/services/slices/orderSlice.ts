import {
  TNewOrderResponse,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
export type TOrderState = {
  orderRequest: boolean;
  orderState: TOrder | null;
};
export const initialState: TOrderState = {
  orderRequest: false,
  orderState: null
};
export const getOrderByNumberThunk = createAsyncThunk(
  'order/getOrderNumber',
  (data: number) => getOrderByNumberApi(data)
);
export const createOrder = createAsyncThunk(
  'order/create',
  async (itemsOrder: string[]) => {
    const result = await orderBurgerApi(itemsOrder);
    return result;
  }
);
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder>) => {
      state.orderState = action.payload;
    },
    resetOrderModalData: (state) => {
      state.orderRequest = false;
      state.orderState = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.orderRequest = false;
          state.orderState = action.payload.order;
        }
      )
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});
export const { setOrderRequest, setOrderModalData, resetOrderModalData } =
  orderSlice.actions;
export const getOrderRequest = (state: { order: TOrderState }) =>
  state.order.orderRequest;
export const getOrderModalData = (state: { order: TOrderState }) =>
  state.order.orderState;
export const orderReducer = orderSlice.reducer;
