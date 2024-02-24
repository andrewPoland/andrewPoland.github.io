import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { remarkReadingTime } from './src/utils/readTime.ts';

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: 'https://andrew-poland.github.io/',
  // Write here your website url
  markdown: {
    remarkPlugins: [remarkReadingTime],
    drafts: true
  },
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: {
      experimentalThemes: {
        light: 'dracula',
        dark: 'material-theme-palenight'
      },
      wrap: true
    },
    drafts: true
  }), sitemap(), tailwind(), markdoc({ ignoreIndentation: true})]
});