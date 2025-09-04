import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { AuthProvider } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContextHooks';

// Mock component to test auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? user.name : 'No User'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Authentication Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows not authenticated initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('handles login flow', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Click login button
    fireEvent.click(screen.getByText('Login'));
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('Mario Rossi');
  });

  it('handles logout flow', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Then logout
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('persists authentication state in localStorage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Check localStorage
    expect(localStorage.getItem('authToken')).toBe('mock-token');
  });

  it('restores authentication state from localStorage', () => {
    // Set token in localStorage
    localStorage.setItem('authToken', 'mock-token');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Should be authenticated immediately
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('Mario Rossi');
  });

  it('handles authentication errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Mock a failed login by modifying the context
    const TestComponentWithError = () => {
      const { login } = useAuth();
      
      const handleErrorLogin = async () => {
        try {
          await login('invalid@example.com', 'wrongpassword');
        } catch (error) {
          // Error should be caught
        }
      };
      
      return <button onClick={handleErrorLogin}>Error Login</button>;
    };
    
    render(
      <AuthProvider>
        <TestComponentWithError />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Error Login'));
    
    // Should not throw unhandled errors
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
}); 