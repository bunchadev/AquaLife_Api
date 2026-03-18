let whitelistDomains = []
if (process.env.BUILD_MODE === 'dev') {
  whitelistDomains = ['localhost:5173']
} else {
  whitelistDomains = ['https://aqua-life-web-seven.vercel.app']
}

export const WHITELIST_DOMAINS = whitelistDomains