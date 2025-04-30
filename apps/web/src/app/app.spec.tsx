import { render } from '@testing-library/react';
import React from 'react';
import { App } from './app';
import { test, expect } from '@jest/globals';

test('should render successfully', () => {
  const { container } = render(<App />);
  const heading = container.querySelector('h1');
  expect(heading).not.toBeNull();
});

test('should have the platform name as the title', () => {
  const { container } = render(<App />);
  const heading = container.querySelector('h1');
  expect(heading?.textContent?.toLowerCase().includes('финансовая')).toBe(true);
});
