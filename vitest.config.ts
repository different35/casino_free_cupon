import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}',
      'backend/**/*.test.{js,mjs}'
    ],
    typecheck: {
      enabled: false,
    },
  },
});
