import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwapCoin from '../components/SwapCoin';
import assetsData from '../utils/assets.json';



describe('SwapCoin Component', () => {
  
  // Helper to calculate expected rate
  const calculateRate = (fromId: string, toId: string) => {
    const fromAsset = assetsData.find(a => a.id === fromId) || assetsData[0];
    const toAsset = assetsData.find(a => a.id === toId) || assetsData[5];
    const rate = parseFloat(fromAsset.usdValue) / parseFloat(toAsset.usdValue);
    return { fromAsset, toAsset, rate };
  };

  test('1. Renders correctly with default state (WBTC -> USD)', () => {
    render(<SwapCoin />);
    
    // Default From is WBTC (id: 1, implicitly or explicitly)
    // Default To is USD (id: 6)
    const { fromAsset, toAsset } = calculateRate('1', '6');

    // Check if symbols are displayed
    const fromSymbolElements = screen.getAllByText(fromAsset.symbol);
    const toSymbolElements = screen.getAllByText(toAsset.symbol);
    
    expect(fromSymbolElements.length).toBeGreaterThan(0);
    expect(toSymbolElements.length).toBeGreaterThan(0);

    // Check Preview button is initially disabled (Incorrect Order or just disabled)
    // Logic: isValidInput is false initially because preSwapAmount is ''
    const previewBtn = screen.getByRole('button', { name: /Incorrect Order|Preview/i });
    expect(previewBtn).toBeDisabled();
    expect(previewBtn).toHaveTextContent('Incorrect Order');
  });

  test('2. Displays the correct swap rate based on usdValue', () => {
    render(<SwapCoin />);
    
    // Get expected rate for default WBTC -> USD
    const { fromAsset, toAsset, rate } = calculateRate('1', '6');
    
    // Expected format: "1 WBTC : {formattedRate} USD"
    // formatOutput uses toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
    const formattedRate = rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    
    // Use a regex to find the text roughly matching this pattern
    // Because exact whitespace might vary, we check for the rate number presence
    const rateRegex = new RegExp(`1\\s*${fromAsset.symbol}\\s*:\\s*${formattedRate.replace(/\./g, '\\.')}\\s*${toAsset.symbol}`);
    
    // We look for the element containing this text
    const rateElement = screen.getByText((content) => rateRegex.test(content));
    expect(rateElement).toBeInTheDocument();
  });

  test('3. Validates user input and enables Preview button', () => {
    render(<SwapCoin />);
    
    const fromInput = screen.getByPlaceholderText('0');
    const previewBtn = screen.getByRole('button', { name: /Incorrect Order/i });

    // Initially disabled
    expect(previewBtn).toBeDisabled();

    // Simulate typing a valid number
    fireEvent.change(fromInput, { target: { value: '0.1' } });

    // Button should now be enabled and say "Preview"
    const enabledPreviewBtn = screen.getByRole('button', { name: /Preview/i });
    expect(enabledPreviewBtn).toBeEnabled();
    expect(enabledPreviewBtn).toHaveClass('bg-actived');
  });

  test('4. "MAX" button sets input to full balance', () => {
    render(<SwapCoin />);
    
    const { fromAsset } = calculateRate('1', '6');
    const maxButton = screen.getByText('MAX');
    const fromInput = screen.getByPlaceholderText('0') as HTMLInputElement;

    // Click MAX
    // Note: The component uses onTouchStart for the button in the code provided.
    // We need to simulate touchStart or modify the component to handle onClick as well for better accessibility/testing.
    // However, assuming standard React testing library fireEvent works for touchStart if we target it specifically.
    fireEvent.touchStart(maxButton);

    // Check if input value matches the balance
    expect(fromInput.value).toBe(fromAsset.balance);
  });

  test('5. Switch button toggles source and target tokens', () => {
    render(<SwapCoin />);
    
    // Initial: WBTC -> USD
    const { fromAsset: initialFrom, toAsset: initialTo } = calculateRate('1', '6');
    
    // Find Switch button (it has an image with alt="switch")
    const switchImg = screen.getByAltText('switch');
    const switchButton = switchImg.closest('button');
    
    expect(switchButton).toBeInTheDocument();

    // Click Switch
    // Again, component uses onTouchStart
    if (switchButton) {
        fireEvent.touchStart(switchButton);
    }

    // Expect: USD -> WBTC
    // Check if the symbols flipped locations
    // The "From" section is the first one. We can verify by checking the "Balance:" text associated with the "From" section
    // Or simpler: Check the rate text which should now display "1 USD : ... WBTC"
    
    const { rate: newRate } = calculateRate(initialTo.id, initialFrom.id); // Reverse IDs
    const formattedNewRate = newRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    
    const newRateRegex = new RegExp(`1\\s*${initialTo.symbol}\\s*:\\s*${formattedNewRate.replace(/\./g, '\\.')}\\s*${initialFrom.symbol}`);
    
    expect(screen.getByText((content) => newRateRegex.test(content))).toBeInTheDocument();
  });

  test('6. Auto-calculates target amount when source amount changes', () => {
    render(<SwapCoin />);
    
    const { rate, fromAsset } = calculateRate('1', '6');
    // Ensure input amount is less than balance (0.005) to avoid auto-cap to max balance
    const inputAmount = parseFloat(fromAsset.balance) / 2; 
    const expectedOutput = (inputAmount * rate).toFixed(5); 
    
    const fromInput = screen.getByPlaceholderText('0');
    const toInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;

    // Type safe amount
    fireEvent.change(fromInput, { target: { value: inputAmount.toString() } });

    // Check To Input value
    expect(parseFloat(toInput.value)).toBeCloseTo(parseFloat(expectedOutput), 5);
  });
});

