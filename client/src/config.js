import packageJson from '../package.json';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Frontend version (from package.json)
export const CLIENT_VERSION = packageJson.version; 