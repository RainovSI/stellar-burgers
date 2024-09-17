import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TRegisterData,
  TLoginData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
export type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};
export const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};
export const register = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const result = await registerUserApi(userData);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);
export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TLoginData) => {
    const result = await updateUserApi(data);
    return result.user;
  }
);
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch (error) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        dispatch(setAuthChecked(true));
      }
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);
export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state: TAuthState, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state: TAuthState, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getAuthChecked: (state: TAuthState): boolean => state.isAuthChecked,
    getUser: (state: TAuthState): TUser => state.user!
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration rejected';
      })
      .addCase(login.pending, (state: TAuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state: TAuthState, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login rejected';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'UpdateUser rejected';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state: TAuthState) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout rejected';
      });
  }
});
export const { setAuthChecked, setUser, clearError } = authSlice.actions;
export const { getAuthChecked, getUser } = authSlice.selectors;
export const authReducer = authSlice.reducer;
