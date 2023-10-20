import baseConfig from '@haxiom/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  content: [...baseConfig.content, '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    ...baseConfig.theme,
  },
} satisfies Config;
