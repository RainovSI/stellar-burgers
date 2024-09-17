import { createOrder, initialState, orderReducer } from '../slices/orderSlice';

describe('Проверка обработки экшенов редьюсером слайса отправки заказа', () => {
  it('проверка статуса pending', () => {
    const state = orderReducer(initialState, {
      type: createOrder.pending.type
    });
    expect(state.orderRequest).toBe(true);
  });

  it('проверка статуса fulfilled', () => {
    const expectedResponse = {
      order: {
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093d'
        ],
        _id: '66e44d09119d45001b506b2b',
        status: 'done',
        name: 'Флюоресцентный метеоритный бургер',
        number: 52925
      }
    };

    const state = orderReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: expectedResponse
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderState).toEqual(expectedResponse.order);
  });

  it('проверка статуса rejected', () => {
    const state = orderReducer(initialState, {
      type: createOrder.rejected.type
    });
    expect(state.orderRequest).toBe(false);
  });
});
