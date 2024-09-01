import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientReducer } from './slices/ingredientSlice';
import { constructorReducer } from './slices/constructorSlice';
import { ordersReducer } from './slices/ordersListSlice';
import { orderReducer } from './slices/orderSlice';
import { authReducer } from './slices/authorizationSlice';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  constructorBurger: constructorReducer,
  orders: ordersReducer,
  order: orderReducer,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
