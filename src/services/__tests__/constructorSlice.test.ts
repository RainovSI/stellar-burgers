import { TConstructorIngredient } from '@utils-types';
import {
  constructorReducer,
  initialState,
  TConstructorState
} from '../slices/constructorSlice';

const ConstructorItemsMoc = {
  bun: {
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
    id: '1'
  },
  ingredients: [
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
      id: '2'
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
      id: '3'
    }
  ]
};

const addIngredient = (
  state: TConstructorState,
  ingredient: TConstructorIngredient
): TConstructorState =>
  constructorReducer(state, {
    payload: ingredient,
    type: 'constructorBurger/addIngredient'
  });

const deleteIngredient = (
  state: TConstructorState,
  id: string
): TConstructorState =>
  constructorReducer(state, {
    payload: id,
    type: 'constructorBurger/deleteIngredient'
  });

const moveIngredient = (
  state: TConstructorState,
  id: string,
  direction: 'up' | 'down'
): TConstructorState =>
  constructorReducer(state, {
    payload: { id, direction },
    type: 'constructorBurger/moveIngredient'
  });

describe('Проверка работы редьюсера конструктора бургера', () => {
  it('добавление ингредиента', () => {
    let newState = addIngredient(initialState, ConstructorItemsMoc.bun);
    expect(newState.formulaBurger.bun).toEqual(ConstructorItemsMoc.bun);

    newState = addIngredient(initialState, ConstructorItemsMoc.ingredients[0]);
    expect(newState.formulaBurger.ingredients).toEqual([
      ConstructorItemsMoc.ingredients[0]
    ]);
    expect(newState.formulaBurger.ingredients).toHaveLength(1);
  });

  it('удаление ингредиента', () => {
    let newState = addIngredient(
      initialState,
      ConstructorItemsMoc.ingredients[1]
    );
    newState = deleteIngredient(newState, '3');
    expect(newState).toEqual(initialState);
    expect(newState.formulaBurger.ingredients).toHaveLength(0);
  });

  it('изменение порядка ингредиентов', () => {
    let newState = addIngredient(
      initialState,
      ConstructorItemsMoc.ingredients[0]
    );
    newState = addIngredient(newState, ConstructorItemsMoc.ingredients[1]);

    newState = moveIngredient(newState, '3', 'up');
    expect(newState.formulaBurger.ingredients).toEqual([
      ConstructorItemsMoc.ingredients[1],
      ConstructorItemsMoc.ingredients[0]
    ]);

    newState = moveIngredient(newState, '3', 'down');
    expect(newState.formulaBurger.ingredients).toEqual([
      ConstructorItemsMoc.ingredients[0],
      ConstructorItemsMoc.ingredients[1]
    ]);
  });
});
