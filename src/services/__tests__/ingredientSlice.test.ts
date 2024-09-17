import {
  ingredientReducer,
  initialState,
  getIngredients
} from '../slices/ingredientSlice';
import { TIngredient } from '@utils-types';

const expectedResult: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  },
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'main',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  }
];

describe('проверка обработки редьюсером экшенов при выполнении асинхронного запроса', () => {
  it('проверка статуса pending', () => {
    const state = ingredientReducer(initialState, {
      type: getIngredients.pending.type
    });
    expect(state.isIngLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('проверка статуса fulfilled', () => {
    const state = ingredientReducer(initialState, {
      type: getIngredients.fulfilled.type,
      payload: expectedResult
    });
    expect(state.isIngLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.ingredients).toEqual(expectedResult);
  });

  it('проверка статуса rejected', () => {
    const error = { message: 'Request rejected' };
    const state = ingredientReducer(initialState, {
      type: getIngredients.rejected.type,
      error: error
    });
    expect(state.isIngLoading).toBe(false);
    expect(state.error).toEqual('Request rejected');
    expect(state.ingredients).toEqual([]);
  });
});
