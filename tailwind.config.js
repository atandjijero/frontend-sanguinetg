/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
  	extend: {
  		colors: {
  			'error-container': 'var(--error-container)',
  			'surface-alt': 'var(--surface-alt)',
  			'on-primary-container': 'var(--on-primary-container)',
  			'primary-fixed-dim': 'var(--primary-fixed-dim)',
  			'on-secondary': 'var(--on-secondary)',
  			'on-tertiary-fixed': 'var(--on-tertiary-fixed)',
  			'inverse-on-surface': 'var(--inverse-on-surface)',
  			surface: 'var(--surface)',
  			'crimson-deep': 'var(--crimson-deep)',
  			'surface-container-highest': 'var(--surface-container-highest)',
  			'on-secondary-fixed': 'var(--on-secondary-fixed)',
  			'surface-variant': 'var(--surface-variant)',
  			'tertiary-container': 'var(--tertiary-container)',
  			'surface-tint': 'var(--surface-tint)',
  			'secondary-container': 'var(--secondary-container)',
  			'warning-amber': 'var(--warning-amber)',
  			'on-surface-variant': 'var(--on-surface-variant)',
  			'on-primary': 'var(--on-primary)',
  			'primary-container': 'var(--primary-container)',
  			'on-error': 'var(--on-error)',
  			'on-surface': 'var(--on-surface)',
  			'on-background': 'var(--on-background)',
  			'tertiary-fixed': 'var(--tertiary-fixed)',
  			secondary: 'var(--secondary)',
  			'surface-container-low': 'var(--surface-container-low)',
  			'surface-dim': 'var(--surface-dim)',
  			'primary-fixed': 'var(--primary-fixed)',
  			'on-secondary-fixed-variant': 'var(--on-secondary-fixed-variant)',
  			'success-mint': 'var(--success-mint)',
  			outline: 'var(--outline)',
  			'outline-variant': 'var(--outline-variant)',
  			'tertiary-fixed-dim': 'var(--tertiary-fixed-dim)',
  			background: 'var(--background)',
  			'on-error-container': 'var(--on-error-container)',
  			'inverse-surface': 'var(--inverse-surface)',
  			tertiary: 'var(--tertiary)',
  			'surface-container-high': 'var(--surface-container-high)',
  			'secondary-fixed': 'var(--secondary-fixed)',
  			'surface-container': 'var(--surface-container)',
  			'on-tertiary-container': 'var(--on-tertiary-container)',
  			'surface-container-lowest': 'var(--surface-container-lowest)',
  			'on-primary-fixed-variant': 'var(--on-primary-fixed-variant)',
  			'surface-bright': 'var(--surface-bright)',
  			'secondary-fixed-dim': 'var(--secondary-fixed-dim)',
  			error: 'var(--error)',
  			'on-primary-fixed': 'var(--on-primary-fixed)',
  			'on-tertiary': 'var(--on-tertiary)',
  			primary: 'var(--primary)',
  			'inverse-primary': 'var(--inverse-primary)',
  			foreground: 'var(--foreground)',
  			card: 'var(--card)',
  			'card-foreground': 'var(--card-foreground)',
  			popover: 'var(--popover)',
  			'popover-foreground': 'var(--popover-foreground)',
  			'primary-foreground': 'var(--primary-foreground)',
  			'secondary-foreground': 'var(--secondary-foreground)',
  			muted: 'var(--muted)',
  			'muted-foreground': 'var(--muted-foreground)',
  			accent: 'var(--accent)',
  			'accent-foreground': 'var(--accent-foreground)',
  			destructive: 'var(--destructive)',
  			'destructive-foreground': 'var(--destructive-foreground)',
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
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
