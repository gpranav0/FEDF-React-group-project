import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExpenseForm } from '../../components/expenses/ExpenseForm';

describe('ExpenseForm Validation', () => {
  it('shows error if required fields are empty on submit', () => {
    const mockSubmit = vi.fn();
    render(<ExpenseForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByText('Save Expense'));
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when valid', () => {
    const mockSubmit = vi.fn();
    const { container } = render(<ExpenseForm onSubmit={mockSubmit} />);
    
    fireEvent.change(container.querySelector('input[name="title"]'), { target: { value: 'Groceries' } });
    fireEvent.change(container.querySelector('input[name="amount"]'), { target: { value: '150' } });
    fireEvent.change(container.querySelector('input[name="date"]'), { target: { value: '2020-01-01' } });
    fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: 'Food' } });
    fireEvent.change(container.querySelector('select[name="paymentMethod"]'), { target: { value: 'Credit Card' } });
    
    fireEvent.click(screen.getByText('Save Expense'));
    
    console.log(container.innerHTML);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Groceries',
      amount: 150,
      date: '2020-01-01',
      category: 'Food',
      paymentMethod: 'Credit Card'
    }));
  });
});
