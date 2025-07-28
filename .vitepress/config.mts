import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "makecoin",
  description: "learn to make a token",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Dev', link: '/dev' },
      { text: 'Guide', link: '/guide'}
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'intro', link: '/guide/index'}
        ]
      },
      {
        text: 'Develop',
        items: [
          { text: 'developing', link: '/dev' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
