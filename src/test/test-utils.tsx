import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data for tests
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  avatar: 'https://example.com/avatar.jpg'
};

export const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
};

// Mock API responses
export const mockApiResponses = {
  success: { success: true, data: {} },
  error: { success: false, error: 'Test error' },
  empty: { success: true, data: [] },
};

// Test constants
export const TEST_IDS = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  BUTTON: 'button',
  INPUT: 'input',
  MODAL: 'modal',
  SEARCH: 'search',
} as const; 