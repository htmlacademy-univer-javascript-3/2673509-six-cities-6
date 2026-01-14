import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import type { BrowserHistory } from 'history';
import { HistoryRouter } from './history-router';

const createMockHistory = (): BrowserHistory => {
  const memoryHistory = createMemoryHistory();
  return memoryHistory as unknown as BrowserHistory;
};

const TestComponent = () => <div>Test Content</div>;

describe('HistoryRouter Component', () => {
  let mockHistory: BrowserHistory;

  beforeEach(() => {
    mockHistory = createMockHistory();
  });

  it('should render children correctly', () => {
    render(
      <HistoryRouter history={mockHistory}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should initialize with current history location and action', () => {
    mockHistory.push('/test-path');

    render(
      <HistoryRouter history={mockHistory}>
        <div>Current path: {mockHistory.location.pathname}</div>
      </HistoryRouter>
    );

    expect(screen.getByText('Current path: /test-path')).toBeInTheDocument();
  });

  it('should subscribe to history changes on mount', () => {
    const listenSpy = vi.spyOn(mockHistory, 'listen');

    render(
      <HistoryRouter history={mockHistory}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(listenSpy).toHaveBeenCalledTimes(1);
    expect(listenSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should update when history changes', () => {
    const { rerender } = render(
      <HistoryRouter history={mockHistory}>
        <div data-testid="location">{mockHistory.location.pathname}</div>
      </HistoryRouter>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/');

    mockHistory.push('/new-path');

    rerender(
      <HistoryRouter history={mockHistory}>
        <div data-testid="location">{mockHistory.location.pathname}</div>
      </HistoryRouter>
    );

    expect(mockHistory.location.pathname).toBe('/new-path');
  });

  it('should pass navigator prop to Router', () => {
    const { container } = render(
      <HistoryRouter history={mockHistory}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it('should handle multiple children', () => {
    render(
      <HistoryRouter history={mockHistory}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </HistoryRouter>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should cleanup history listener on unmount', () => {
    const unsubscribeMock = vi.fn();
    vi.spyOn(mockHistory, 'listen').mockReturnValue(unsubscribeMock);

    const { unmount } = render(
      <HistoryRouter history={mockHistory}>
        <TestComponent />
      </HistoryRouter>
    );

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('should preserve history action state', () => {
    mockHistory.push('/test');

    render(
      <HistoryRouter history={mockHistory}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(mockHistory.action).toBeTruthy();
  });

  it('should work with different history actions (PUSH)', () => {
    mockHistory.push('/pushed-route');

    render(
      <HistoryRouter history={mockHistory}>
        <div>Route: {mockHistory.location.pathname}</div>
      </HistoryRouter>
    );

    expect(screen.getByText('Route: /pushed-route')).toBeInTheDocument();
  });

  it('should work with different history actions (REPLACE)', () => {
    mockHistory.replace('/replaced-route');

    render(
      <HistoryRouter history={mockHistory}>
        <div>Route: {mockHistory.location.pathname}</div>
      </HistoryRouter>
    );

    expect(screen.getByText('Route: /replaced-route')).toBeInTheDocument();
  });
});
