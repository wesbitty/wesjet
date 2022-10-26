// @ts-check
const { withWesjet } = require('wesjet-nextjs-plugin')

module.exports = withWesjet({
  images: {
    domains: ['pbs.twimg.com', 'avatars.githubusercontent.com', 'i.imgur.com'],
  },
  headers: async () => [{
    source: '/:path*',
    headers: [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'same-origin' },
    ],
  }],
})
