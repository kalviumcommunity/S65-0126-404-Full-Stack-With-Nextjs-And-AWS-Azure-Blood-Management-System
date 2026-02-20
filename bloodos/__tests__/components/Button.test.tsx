

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {

  it('renders the label correctly', () => {
    // Arrange & Act (Rendering the DOM)
    render(<Button label="Submit Action" />);

    // Assert (using Jest-DOM custom matchers extended in setup.ts)
    const buttonElement = screen.getByRole('button', { name: /Submit Action/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the correct primary variant default styling', () => {
    render(<Button label="Primary" />);
    const buttonElement = screen.getByRole('button');

    // Asserting the style property ensures the variants spread correctly
    expect(buttonElement).toHaveStyle('background: #dc2626');
    expect(buttonElement).toHaveStyle('color: #fff');
  });

  it('triggers onClick handler exactly once when clicked', async () => {
    // Creating a Jest mock function to track executions
    const mockOnClick = jest.fn();

    render(<Button label="Click Me" onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');

    // Simulate user behavior using high-fidelity userEvent API
    await userEvent.click(buttonElement);

    // Assert behavioral tracking
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays a loading spinner and disables interaction when isLoading is true', () => {
    const mockOnClick = jest.fn();

    render(<Button label="Processing" isLoading={true} onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');

    // Expected ARIA properties for accessibility bounds
    expect(buttonElement).toHaveAttribute('aria-busy', 'true');
    expect(buttonElement).toHaveAttribute('aria-disabled', 'true');
    expect(buttonElement).toBeDisabled();

    // The text 'Processing' must still exist but there should be a spinner symbol
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

});
