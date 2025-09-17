/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#DBEAFE',
        },
        // Text Colors
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        // Background Colors
        background: {
          page: '#F9FAFB',
          content: '#FFFFFF',
          hover: '#F3F4F6',
          active: '#E5E7EB',
        },
        // Border Colors
        border: {
          light: '#E5E7EB',
          medium: '#D1D5DB',
          dark: '#9CA3AF',
        },
        // Status Colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          'system-ui',
        ],
      },
      fontSize: {
        // App-specific typography scale
        'app-title-desktop': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '400' }],
        'app-title-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '400' }],
        
        // Task content typography
        'task-text': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        
        // Input typography
        'input-text-desktop': ['18px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'input-text-mobile': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        
        // Button typography
        'button-text': ['14px', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '500' }],
        
        // Counter and labels
        'counter-text': ['14px', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '500' }],
        
        // Placeholder text
        'placeholder-text': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        
        // Error and validation
        'error-text': ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        
        // Empty state
        'empty-primary': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'empty-secondary': ['14px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        
        // Modal/Dialog
        'dialog-title': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'dialog-text': ['14px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
      },
      spacing: {
        // Additional spacing tokens based on design specifications
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '30': '7.5rem', // 120px
        '34': '8.5rem', // 136px
        
        // Component-specific spacing
        'input-y-desktop': '16px',
        'input-y-mobile': '12px',
        'input-x-desktop': '20px',
        'input-x-mobile': '16px',
        
        'button-y': '8px',
        'button-x': '16px',
        'button-y-sm': '6px',
        'button-x-sm': '12px',
        
        'header-desktop': '32px',
        'header-mobile': '24px',
        'header-bottom-desktop': '24px',
        'header-bottom-mobile': '20px',
        
        'container-mobile': '16px',
        'container-tablet': '24px',
        'container-desktop': '32px',
        
        'task-y': '12px',
        'task-x': '16px',
        'task-gap': '12px',
        
        'dialog-padding': '24px',
        'dialog-gap': '12px',
        
        'footer-padding': '16px',
        'footer-height': '60px',
        
        'empty-y': '48px',
        'empty-x': '16px',
      },
      maxWidth: {
        'container': '800px',
      },
      borderRadius: {
        // Design system border radius scale
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
        
        // Component-specific radius
        'input': '6px',
        'button': '6px',
        'card': '8px',
        'dialog': '12px',
        'checkbox': '4px',
      },
      boxShadow: {
        // Input shadows
        'input': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        
        // Button shadows
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button-hover': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        
        // Dialog/Modal shadows
        'dialog': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'overlay': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Component shadows
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        
        // Focus indicators
        'focus-primary': '0 0 0 3px rgba(59, 130, 246, 0.1)',
        'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'focus-success': '0 0 0 3px rgba(16, 185, 129, 0.1)',
      },
      transitionDuration: {
        // Animation timing tokens
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        // Easing functions from design specifications
        'ease-out-custom': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-custom': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out-custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'task-in': 'taskIn 250ms ease-out',
        'task-out': 'taskOut 250ms ease-in',
        'checkbox': 'checkbox 150ms ease-out',
        'filter': 'filter 250ms ease-in-out',
      },
      keyframes: {
        taskIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        taskOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        checkbox: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        filter: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
