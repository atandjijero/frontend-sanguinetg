/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
  	extend: {
  		colors: {
  			'error-container': '#ffdad6',
  			'surface-alt': '#F2F2F8',
  			'on-primary-container': '#ffdada',
  			'primary-fixed-dim': '#ffb3b4',
  			'on-secondary': '#ffffff',
  			'on-tertiary-fixed': '#002115',
  			'inverse-on-surface': '#f1f1ef',
  			surface: '#faf9f7',
  			'crimson-deep': '#760200',
  			'surface-container-highest': '#e3e2e0',
  			'on-secondary-fixed': '#121c2a',
  			'surface-variant': '#e3e2e0',
  			'tertiary-container': '#007353',
  			'surface-tint': '#ba1434',
  			'secondary-container': '#d6e0f3',
  			'warning-amber': '#F59E0B',
  			'on-surface-variant': '#5b4040',
  			'on-primary': '#ffffff',
  			'primary-container': '#c41e3a',
  			'on-error': '#ffffff',
  			'on-surface': '#1a1c1b',
  			'on-background': '#1a1c1b',
  			'tertiary-fixed': '#86f8c8',
  			secondary: '#555f6f',
  			'surface-container-low': '#f4f3f1',
  			'surface-dim': '#dadad8',
  			'primary-fixed': '#ffdad9',
  			'on-secondary-fixed-variant': '#3d4756',
  			'success-mint': '#3EB489',
  			outline: '#8f6f6f',
  			'outline-variant': '#e5dcdc',
  			'tertiary-fixed-dim': '#69dbad',
  			background: '#faf9f7',
  			'on-error-container': '#93000a',
  			'inverse-surface': '#2f3130',
  			tertiary: '#00583e',
  			'surface-container-high': '#e9e8e6',
  			'secondary-fixed': '#d9e3f6',
  			'surface-container': '#efeeec',
  			'on-tertiary-container': '#86f8c8',
  			'surface-container-lowest': '#ffffff',
  			'on-primary-fixed-variant': '#920023',
  			'surface-bright': '#faf9f7',
  			'secondary-fixed-dim': '#bdc7d9',
  			error: '#ba1a1a',
  			'on-primary-fixed': '#40000a',
  			'on-tertiary': '#ffffff',
  			primary: '#9e0027',
  			'inverse-primary': '#ffb3b4',
  			foreground: '#1a1c1b',
  			card: '#ffffff',
  			'card-foreground': '#1a1c1b',
  			popover: '#ffffff',
  			'popover-foreground': '#1a1c1b',
  			'primary-foreground': '#ffffff',
  			'secondary-foreground': '#ffffff',
  			muted: '#f4f3f1',
  			'muted-foreground': '#5b4040',
  			accent: '#efeeec',
  			'accent-foreground': '#1a1c1b',
  			destructive: '#ba1a1a',
  			'destructive-foreground': '#ffffff',
  			border: '#e5dcdc',
  			input: '#e5dcdc',
  			ring: '#9e0027',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			'chart-1': '#9e0027',
  			'chart-2': '#00583e',
  			'chart-3': '#555f6f',
  			'chart-4': '#F59E0B',
  			'chart-5': '#3EB489'
  		},
  		borderRadius: {
  			DEFAULT: '0.25rem',
  			lg: '0.5rem',
  			xl: '0.75rem',
  			full: '9999px'
  		},
  		spacing: {
  			'margin-mobile': '16px',
  			base: '8px',
  			'margin-desktop': '40px',
  			gutter: '24px',
  			'container-max': '1280px',
  			'touch-target-min': '48px'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			],
  			'body-md': [
  				'Inter'
  			],
  			'headline-md': [
  				'Outfit'
  			],
  			'label-md': [
  				'Inter'
  			],
  			caption: [
  				'Inter'
  			],
  			'headline-lg': [
  				'Outfit'
  			],
  			'headline-lg-mobile': [
  				'Outfit'
  			],
  			'display-lg': [
  				'Outfit'
  			],
  			'body-lg': [
  				'Inter'
  			]
  		},
  		fontSize: {
  			'body-md': [
  				'16px',
  				{
  					lineHeight: '24px',
  					fontWeight: '400'
  				}
  			],
  			'headline-md': [
  				'24px',
  				{
  					lineHeight: '32px',
  					fontWeight: '600'
  				}
  			],
  			'label-md': [
  				'14px',
  				{
  					lineHeight: '20px',
  					letterSpacing: '0.01em',
  					fontWeight: '600'
  				}
  			],
  			caption: [
  				'12px',
  				{
  					lineHeight: '16px',
  					fontWeight: '500'
  				}
  			],
  			'headline-lg': [
  				'32px',
  				{
  					lineHeight: '40px',
  					fontWeight: '700'
  				}
  			],
  			'headline-lg-mobile': [
  				'28px',
  				{
  					lineHeight: '36px',
  					fontWeight: '700'
  				}
  			],
  			'display-lg': [
  				'48px',
  				{
  					lineHeight: '56px',
  					letterSpacing: '-0.02em',
  					fontWeight: '800'
  				}
  			],
  			'body-lg': [
  				'18px',
  				{
  					lineHeight: '28px',
  					fontWeight: '400'
  				}
  			]
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
