import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientReducer } from '../slices/ingredientSlice';
import { constructorReducer } from '../slices/constructorSlice';
import { orderReducer } from '../slices/orderSlice';
import { ordersReducer } from '../slices/ordersListSlice';
import { authReducer } from '../slices/authorizationSlice';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  constructorBurger: constructorReducer,
  orders: ordersReducer,
  order: orderReducer,
  auth: authReducer
});

describe('тест корневого редьюсера', () => {
  it('проверяет правильную настройку и работу rootReducer', () => {
    const store = configureStore({ reducer: rootReducer });

    expect(store.getState()).toEqual(
      rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
  });
});
