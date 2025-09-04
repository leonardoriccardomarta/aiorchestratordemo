import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Search } from '../../components/ui/Search';

describe('Performance Tests', () => {
  describe('Component Rendering Performance', () => {
    it('should render Button component quickly', () => {
      const startTime = performance.now();
      
      render(<Button>Test Button</Button>);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(10); // Should render in less than 10ms
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render Input component quickly', () => {
      const startTime = performance.now();
      
      render(<Input placeholder="Test input" />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(10);
      expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
    });

    it('should render multiple components efficiently', () => {
      const startTime = performance.now();
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Button key={i}>Button {i}</Button>
          ))}
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(100); // Should render 100 buttons in less than 100ms
      expect(screen.getAllByRole('button')).toHaveLength(100);
    });
  });

  describe('Search Component Performance', () => {
    it('should debounce search input efficiently', async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} debounceMs={300} />);
      
      const input = screen.getByPlaceholderText('Cerca...');
      
      // Type quickly
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });
      
      // Should not call onSearch immediately
      expect(onSearch).not.toHaveBeenCalled();
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Should only call once with final value
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('abc');
    });
  });

  describe('Modal Performance', () => {
    it('should render modal efficiently', () => {
      const startTime = performance.now();
      
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(20);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      const startTime = performance.now();
      
      render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(5);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory on component unmount', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      const { unmount } = render(
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <Button key={i}>Button {i}</Button>
          ))}
        </div>
      );
      
      unmount();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(1000000); // Less than 1MB increase
    });
  });

  describe('Event Handler Performance', () => {
    it('should handle rapid clicks efficiently', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      const endTime = performance.now();
      const clickTime = endTime - startTime;
      
      expect(clickTime).toBeLessThan(50); // Should handle 10 clicks in less than 50ms
      expect(handleClick).toHaveBeenCalledTimes(10);
    });

    it('should handle input changes efficiently', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} placeholder="Test" />);
      
      const input = screen.getByPlaceholderText('Test');
      const startTime = performance.now();
      
      // Simulate rapid typing
      for (let i = 0; i < 20; i++) {
        fireEvent.change(input, { target: { value: `text${i}` } });
      }
      
      const endTime = performance.now();
      const changeTime = endTime - startTime;
      
      expect(changeTime).toBeLessThan(100); // Should handle 20 changes in less than 100ms
      expect(handleChange).toHaveBeenCalledTimes(20);
    });
  });

  describe('Bundle Size Impact', () => {
    it('should have reasonable component sizes', () => {
      // This is a basic check - in a real app you'd use bundle analyzer
      const ButtonCode = Button.toString();
      const InputCode = Input.toString();
      const ModalCode = Modal.toString();
      
      expect(ButtonCode.length).toBeLessThan(5000); // Button component should be under 5KB
      expect(InputCode.length).toBeLessThan(8000); // Input component should be under 8KB
      expect(ModalCode.length).toBeLessThan(10000); // Modal component should be under 10KB
    });
  });
}); 