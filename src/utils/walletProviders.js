/**
 * Stellar Multi-Wallet Providers & Supported Connectors (StellarWalletsKit)
 */
export const WALLET_OPTIONS = [
  {
    id: 'freighter',
    name: 'Freighter Wallet',
    tagline: 'Recommended for Stellar & Soroban dApps',
    badge: 'Installed / Extension',
    badgeVariant: 'primary',
    type: 'extension',
    iconUrl: 'https://images.ctfassets.net/bd50u5nvbe40/73V2v2p1p9YlJ4xN8qDqW/7c50a04bbabdfb38b1373510e19a9a3b/freighter-logo.svg',
    downloadUrl: 'https://www.freighter.app/',
    isRecommended: true,
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    tagline: 'Multi-platform Stellar wallet for desktop & mobile',
    badge: 'Extension / Web',
    badgeVariant: 'neutral',
    type: 'web_extension',
    iconUrl: 'https://raw.githubusercontent.com/Creit-Tech/xBull-Wallet/master/public/icons/icon-128.png',
    downloadUrl: 'https://xbull.app/',
    isRecommended: false,
  },
  {
    id: 'albedo',
    name: 'Albedo',
    tagline: 'Web-based delegated signing without extensions',
    badge: 'WebAuthn / Browser',
    badgeVariant: 'neutral',
    type: 'browser',
    iconUrl: 'https://albedo.link/apple-touch-icon.png',
    downloadUrl: 'https://albedo.link/',
    isRecommended: false,
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    tagline: 'Mobile & Web3 multi-chain wallet with Stellar support',
    badge: 'Mobile / Extension',
    badgeVariant: 'neutral',
    type: 'mobile_extension',
    iconUrl: 'https://www.hanawallet.io/favicon.ico',
    downloadUrl: 'https://www.hanawallet.io/',
    isRecommended: false,
  },
  {
    id: 'lobstr',
    name: 'LOBSTR Wallet',
    tagline: 'Leading mobile Stellar wallet with WalletConnect',
    badge: 'Mobile App',
    badgeVariant: 'neutral',
    type: 'mobile',
    iconUrl: 'https://lobstr.co/static/images/logo.png',
    downloadUrl: 'https://lobstr.co/',
    isRecommended: false,
  },
  {
    id: 'demo',
    name: 'Developer Demo Wallet',
    tagline: 'Instant 10,000 Testnet XLM pre-funded sandbox account',
    badge: 'Fast Testing / Sandbox',
    badgeVariant: 'success',
    type: 'sandbox',
    iconUrl: null,
    downloadUrl: null,
    isRecommended: false,
  }
];

export const ERROR_CODES = {
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  USER_REJECTED: 'USER_REJECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
};
