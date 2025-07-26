/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.kristinefung.com',
    generateRobotsTxt: true,
    exclude: [
        '/dashboard/*',
        '/dashboard',
        '/api/*',
        '/login',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/dashboard', '/api/', '/login'],
            },
        ],
    },
    generateIndexSitemap: false,
} 