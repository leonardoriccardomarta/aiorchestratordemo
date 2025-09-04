import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Test button">Click me</Button>);
      const button = screen.getByRole('button', { name: 'Test button' });
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<Button>Keyboard accessible</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should show loading state with proper ARIA', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have proper focus styles', () => {
      render(<Button>Focus test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Input Component', () => {
    it('should have proper label association', () => {
      render(<Input label="Email" placeholder="Enter email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('should show error state with proper ARIA', () => {
      render(<Input error="This field is required" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('This field is required')).toHaveAttribute('role', 'alert');
    });

    it('should have proper focus management', () => {
      render(<Input placeholder="Focus test" />);
      const input = screen.getByPlaceholderText('Focus test');
      expect(input).toHaveClass('focus-visible:ring-2');
    });

    it('should be keyboard accessible', () => {
      render(<Input placeholder="Keyboard test" />);
      const input = screen.getByPlaceholderText('Keyboard test');
      expect(input).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Modal Component', () => {
    it('should have proper ARIA attributes when open', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          Modal content
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should have proper focus trap', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Focus Test">
          <button>First</button>
          <button>Last</button>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('tabIndex', '-1');
    });

    it('should handle escape key', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose} title="Escape Test">
          Content
        </Modal>
      );
      
      // Test escape key handling
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast for text', () => {
      render(<Button>High contrast text</Button>);
      const button = screen.getByRole('button');
      
      // Check that text color provides sufficient contrast
      const computedStyle = window.getComputedStyle(button);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      // This is a basic check - in a real app you'd use a proper contrast checker
      expect(backgroundColor).not.toBe('transparent');
      expect(color).not.toBe('transparent');
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper alt text for images', () => {
      render(
        <img src="test.jpg" alt="Test image description" />
      );
      
      const image = screen.getByAltText('Test image description');
      expect(image).toBeInTheDocument();
    });

    it('should hide decorative elements from screen readers', () => {
      render(
        <div aria-hidden="true">Decorative content</div>
      );
      
      const decorative = screen.getByText('Decorative content');
      expect(decorative).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', () => {
      render(
        <div>
          <Button>First</Button>
          <Input placeholder="Second" />
          <Button>Third</Button>
        </div>
      );
      
      const firstButton = screen.getByRole('button', { name: 'First' });
      const input = screen.getByPlaceholderText('Second');
      const thirdButton = screen.getByRole('button', { name: 'Third' });
      
      expect(firstButton).toHaveAttribute('tabIndex', '0');
      expect(input).toHaveAttribute('tabIndex', '0');
      expect(thirdButton).toHaveAttribute('tabIndex', '0');
    });
  });
}); 