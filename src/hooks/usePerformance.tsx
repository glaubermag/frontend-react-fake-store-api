import { useCallback, useRef, useEffect, useState } from 'react';

// Hook para debounce de funções
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Hook para throttle de funções
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        callback(...args);
        lastCall.current = now;
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        lastCallTimer.current = setTimeout(() => {
          callback(...args);
          lastCall.current = Date.now();
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (lastCallTimer.current) {
        clearTimeout(lastCallTimer.current);
      }
    };
  }, []);

  return throttledCallback;
};

// Hook para memoização de objetos grandes
export const useMemoizedObject = <T extends Record<string, any>>(
  obj: T,
  deps: React.DependencyList
): T => {
  const prevObjRef = useRef<T>();
  const memoizedObjRef = useRef<T>();

  const hasChanged = deps.some((dep, index) => {
    const prevDep = prevObjRef.current ? Object.values(prevObjRef.current)[index] : undefined;
    return dep !== prevDep;
  });

  if (hasChanged || !memoizedObjRef.current) {
    memoizedObjRef.current = obj;
    prevObjRef.current = obj;
  }

  return memoizedObjRef.current!;
};

// Hook para lazy loading de imagens
export const useLazyImage = (src: string, placeholder: string = '/placeholder.svg') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      setImageSrc(placeholder);
      setIsLoading(false);
      setError(true);
    };
  }, [src, placeholder]);

  return { imageSrc, isLoading, error };
};

// Hook para intersection observer (lazy loading)
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { observe, unobserve };
};

// Hook de performance para medir tempo de execução e marcas
export function usePerformance() {
  // Mede o tempo de execução de uma função
  const measureTime = (fn: () => any) => {
    const start = window.performance.now();
    const result = fn();
    const end = window.performance.now();
    return end - start;
  };

  // Marca início
  const markStart = (name: string) => {
    window.performance.mark(`${name}-start`);
  };

  // Marca fim
  const markEnd = (name: string) => {
    window.performance.mark(`${name}-end`);
  };

  // Mede entre marcas
  const measure = (name: string) => {
    window.performance.measure(name, `${name}-start`, `${name}-end`);
  };

  return { measureTime, markStart, markEnd, measure };
} 