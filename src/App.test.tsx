import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Sanguine TG landing page', () => {
  render(<App />);

  expect(screen.getAllByText(/Sanguine TG/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: /Chaque seconde compte/i })).toBeInTheDocument();
});
