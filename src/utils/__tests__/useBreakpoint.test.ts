/// <reference types="vitest" />
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from '../useBreakpoint';


describe('useBreakpoint', () => {
  const setWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  };

  it('identifies mobile screens', () => {
    setWidth(500);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('identifies tablet screens', () => {
    setWidth(800);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('identifies desktop screens', () => {
    setWidth(1200);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('updates on resize event', () => {
    setWidth(500);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    act(() => {
      setWidth(1200);
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isDesktop).toBe(true);
  });
});
