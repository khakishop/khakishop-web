/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://khakishop.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/private/*'
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/curtain'),
    await config.transform(config, '/blind'),
    await config.transform(config, '/motorized'),
    await config.transform(config, '/products'),
    await config.transform(config, '/project'),
    await config.transform(config, '/collection'),
    await config.transform(config, '/references'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact')
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://khakishop.kr/sitemap.xml',
    ],
  },
} 