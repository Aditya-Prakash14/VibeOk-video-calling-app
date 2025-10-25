import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Initial state
const initialState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        dispatch({
          type: actionTypes.SET_USER,
          payload: {
            user: currentUser,
            profile: currentUser, // Use user data as profile for demo
          },
        });
      } else {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message,
      });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const result = await AuthService.login(email, password);
      if (result.success) {
        dispatch({
          type: actionTypes.SET_USER,
          payload: {
            user: result.user,
            profile: result.user, // Use user data as profile for demo
          },
        });
        return { success: true };
      } else {
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: result.error,
        });
        throw new Error(result.error);
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message,
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const result = await AuthService.register(userData);
      if (result.success) {
        dispatch({
          type: actionTypes.SET_USER,
          payload: {
            user: result.user,
            profile: result.profile,
          },
        });
        return { success: true };
      } else {
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: actionTypes.LOGOUT });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const result = await AuthService.updateProfile(state.user.id, updateData);
      if (result.success) {
        dispatch({
          type: actionTypes.UPDATE_PROFILE,
          payload: result.profile,
        });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: null,
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
