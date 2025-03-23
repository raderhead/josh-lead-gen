
/// <reference types="vite/client" />

// Add interface for Google Maps API on the global window object
interface Window {
  google?: any;
  gm_authFailure?: () => void;
}
