import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

let listeners: Array<() => void> = [];

function setScreenWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe('useIsMobile', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event, cb) => {
          if (event === 'change') listeners.push(cb);
        }),
        removeEventListener: jest.fn((event, cb) => {
          if (event === 'change') listeners = listeners.filter(fn => fn !== cb);
        }),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    listeners = [];
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns false for desktop screens', () => {
    setScreenWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile screens', () => {
    setScreenWidth(767);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('updates when screen size changes', async () => {
    setScreenWidth(1024);
    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    await act(async () => {
      setScreenWidth(767);
      listeners.forEach(fn => fn()); // dispara o evento 'change' do matchMedia
      rerender();
    });
    expect(result.current).toBe(true);
  });
}); 