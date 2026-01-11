/// <reference types="vitest/globals" />

import { vi } from 'vitest';

// Compatibility layer: jasmine-like API using Vitest
(globalThis as any).jasmine = {
  createSpyObj: <T>(baseName: string, methodNames: string[]): any => {
    const obj: any = {};
    methodNames.forEach((method) => {
      obj[method] = vi.fn();
    });
    return obj;
  },
  SpyObj: {} as any,
};

// Export for TypeScript
declare global {
  namespace jasmine {
    type SpyObj<T> = {
      [K in keyof T]: T[K] extends (...args: any[]) => any
        ? ReturnType<typeof vi.fn<T[K]>>
        : T[K];
    };

    function createSpyObj<T>(
      baseName: string,
      methodNames: (keyof T)[]
    ): SpyObj<T>;
  }
}
