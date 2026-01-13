import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Provide a simple localStorage polyfill for tests (jsdom already provides it, but ensure it's present)
if (typeof globalThis.localStorage === 'undefined') {
  const storage: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => {
      storage[key] = String(value);
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((k) => delete storage[k]);
    },
    key: (i: number) => Object.keys(storage)[i] || null,
    length: 0,
  } as unknown as Storage;
}
