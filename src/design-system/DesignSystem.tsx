
import styled, { css, keyframes } from 'styled-components';

// Color Palette
export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  }
};

// Typography
export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Transitions
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const animations = {
  fadeIn: css`animation: ${fadeIn} 0.3s ease-out;`,
  slideIn: css`animation: ${slideIn} 0.3s ease-out;`,
  pulse: css`animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
};

// Base Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  font-family: ${typography.fontFamily.primary};
  font-weight: ${typography.fontWeight.medium};
  border: none;
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: all ${transitions.normal};
  position: relative;
  overflow: hidden;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${spacing[2]} ${spacing[3]};
          font-size: ${typography.fontSize.sm};
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${spacing[4]} ${spacing[6]};
          font-size: ${typography.fontSize.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${spacing[3]} ${spacing[4]};
          font-size: ${typography.fontSize.base};
          min-height: 40px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${colors.secondary[100]};
          color: ${colors.secondary[700]};
          &:hover:not(:disabled) {
            background-color: ${colors.secondary[200]};
          }
        `;
      case 'success':
        return css`
          background-color: ${colors.success[500]};
          color: ${colors.neutral.white};
          &:hover:not(:disabled) {
            background-color: ${colors.success[600]};
          }
        `;
      case 'warning':
        return css`
          background-color: ${colors.warning[500]};
          color: ${colors.neutral.white};
          &:hover:not(:disabled) {
            background-color: ${colors.warning[600]};
          }
        `;
      case 'error':
        return css`
          background-color: ${colors.error[500]};
          color: ${colors.neutral.white};
          &:hover:not(:disabled) {
            background-color: ${colors.error[600]};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${colors.primary[600]};
          &:hover:not(:disabled) {
            background-color: ${colors.primary[50]};
          }
        `;
      default:
        return css`
          background-color: ${colors.primary[500]};
          color: ${colors.neutral.white};
          &:hover:not(:disabled) {
            background-color: ${colors.primary[600]};
          }
        `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}

  ${({ loading }) =>
    loading &&
    css`
      cursor: wait;
      pointer-events: none;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary[200]};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

// Input Component
interface InputProps {
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  padding: ${spacing[3]} ${spacing[4]};
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.fontSize.base};
  border: 2px solid ${({ error }) => (error ? colors.error[300] : colors.secondary[300])};
  border-radius: ${borderRadius.lg};
  background-color: ${colors.neutral.white};
  color: ${colors.secondary[900]};
  transition: all ${transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? colors.error[500] : colors.primary[500])};
    box-shadow: 0 0 0 3px ${({ error }) => (error ? colors.error[100] : colors.primary[100])};
  }

  &:disabled {
    background-color: ${colors.secondary[100]};
    color: ${colors.secondary[500]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.secondary[400]};
  }
`;

// Card Component
interface CardProps {
  elevation?: 'sm' | 'md' | 'lg';
  padding?: keyof typeof spacing;
}

export const Card = styled.div<CardProps>`
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.xl};
  box-shadow: ${({ elevation = 'md' }) => shadows[elevation]};
  padding: ${({ padding = 6 }) => spacing[padding]};
  transition: all ${transitions.normal};

  &:hover {
    box-shadow: ${({ elevation = 'md' }) => 
      elevation === 'sm' ? shadows.md : 
      elevation === 'md' ? shadows.lg : shadows.xl
    };
  }
`;

// Badge Component
interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${({ size = 'md' }) => size === 'sm' ? `${spacing[1]} ${spacing[2]}` : `${spacing[2]} ${spacing[3]}`};
  font-family: ${typography.fontFamily.primary};
  font-size: ${({ size = 'md' }) => size === 'sm' ? typography.fontSize.xs : typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.full};
  white-space: nowrap;

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'success':
        return css`
          background-color: ${colors.success[100]};
          color: ${colors.success[700]};
        `;
      case 'warning':
        return css`
          background-color: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      case 'error':
        return css`
          background-color: ${colors.error[100]};
          color: ${colors.error[700]};
        `;
      case 'neutral':
        return css`
          background-color: ${colors.secondary[100]};
          color: ${colors.secondary[700]};
        `;
      default:
        return css`
          background-color: ${colors.primary[100]};
          color: ${colors.primary[700]};
        `;
    }
  }}
`;

// Modal Component
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  ${animations.fadeIn}
`;

export const ModalContent = styled.div`
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows['2xl']};
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  ${animations.fadeIn}
`;

// Loading Spinner Component
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 2px solid ${colors.secondary[200]};
  border-top: 2px solid ${colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`width: 16px; height: 16px;`;
      case 'lg':
        return css`width: 32px; height: 32px;`;
      default:
        return css`width: 24px; height: 24px;`;
    }
  }}
`;

// Tooltip Component
export const Tooltip = styled.div`
  position: absolute;
  background-color: ${colors.secondary[800]};
  color: ${colors.neutral.white};
  padding: ${spacing[2]} ${spacing[3]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-10px);
  transition: all ${transitions.normal};

  &[data-show] {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Responsive Design Utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
};

// Grid System
export const Grid = styled.div<{ columns?: number; gap?: keyof typeof spacing }>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 1 }) => columns}, 1fr);
  gap: ${({ gap = 4 }) => spacing[gap]};

  ${media.sm} {
    grid-template-columns: repeat(${({ columns = 1 }) => Math.min(columns, 2)}, 1fr);
  }

  ${media.md} {
    grid-template-columns: repeat(${({ columns = 1 }) => Math.min(columns, 3)}, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(${({ columns = 1 }) => Math.min(columns, 4)}, 1fr);
  }
`;

// Flexbox Utilities
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: keyof typeof spacing;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'start' }) => align};
  justify-content: ${({ justify = 'start' }) => justify};
  gap: ${({ gap = 0 }) => spacing[gap]};
`;

// Text Components
export const Text = styled.p<{
  size?: keyof typeof typography.fontSize;
  weight?: keyof typeof typography.fontWeight;
  color?: string;
  align?: 'left' | 'center' | 'right';
}>`
  font-family: ${typography.fontFamily.primary};
  font-size: ${({ size = 'base' }) => typography.fontSize[size]};
  font-weight: ${({ weight = 'normal' }) => typography.fontWeight[weight]};
  color: ${({ color = colors.secondary[900] }) => color};
  text-align: ${({ align = 'left' }) => align};
  margin: 0;
  line-height: ${typography.lineHeight.normal};
`;

export const Heading = styled.h1<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: keyof typeof typography.fontWeight;
  color?: string;
}>`
  font-family: ${typography.fontFamily.primary};
  font-weight: ${({ weight = 'bold' }) => typography.fontWeight[weight]};
  color: ${({ color = colors.secondary[900] }) => color};
  margin: 0;
  line-height: ${typography.lineHeight.tight};

  ${({ level = 1 }) => {
    switch (level) {
      case 1:
        return css`font-size: ${typography.fontSize['5xl']};`;
      case 2:
        return css`font-size: ${typography.fontSize['4xl']};`;
      case 3:
        return css`font-size: ${typography.fontSize['3xl']};`;
      case 4:
        return css`font-size: ${typography.fontSize['2xl']};`;
      case 5:
        return css`font-size: ${typography.fontSize.xl};`;
      case 6:
        return css`font-size: ${typography.fontSize.lg};`;
      default:
        return css`font-size: ${typography.fontSize['5xl']};`;
    }
  }}
`;

// Export all components and utilities
export const DesignSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  animations,
  breakpoints,
  media,
  Button,
  Input,
  Card,
  Badge,
  Modal,
  ModalContent,
  Spinner,
  Tooltip,
  Grid,
  Flex,
  Text,
  Heading,
}; 