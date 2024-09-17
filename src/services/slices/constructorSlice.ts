import { TConstructorIngredient, TIngredient } from '@utils-types';
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
export type TConstructorState = {
  formulaBurger: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};
export const initialState: TConstructorState = {
  formulaBurger: {
    bun: null,
    ingredients: []
  }
};
export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        switch (action.payload.type) {
          case 'bun':
            state.formulaBurger.bun = action.payload;
            break;
          case 'main':
          case 'sauce':
            state.formulaBurger.ingredients.push(action.payload);
            break;
          default:
            break;
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    deleteIngredient: (state, action) => {
      state.formulaBurger.ingredients = state.formulaBurger.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: string }>
    ) => {
      const { direction, id } = action.payload;
      const index = state.formulaBurger.ingredients.findIndex(
        (idx) => idx.id === id
      );
      if (index > -1) {
        const ingredients = state.formulaBurger.ingredients;
        const ingredientMove = ingredients[index];
        if (direction === 'up' && index > 0) {
          ingredients[index] = ingredients[index - 1];
          ingredients[index - 1] = ingredientMove;
        } else if (direction === 'down' && index < ingredients.length - 1) {
          ingredients[index] = ingredients[index + 1];
          ingredients[index + 1] = ingredientMove;
        }
      }
    },
    resetConstructor: (state: TConstructorState) => {
      state.formulaBurger.bun = null;
      state.formulaBurger.ingredients = [];
    }
  },
  selectors: {
    getConstructorState: (state) => state
  }
});
export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
export const { getConstructorState } = constructorSlice.selectors;
