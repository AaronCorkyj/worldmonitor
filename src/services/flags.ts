/**
 * Cross-platform flag rendering service
 * Uses emoji flags on macOS/Linux, image flags on Windows
 */

// Flag emoji to image URL mapping (using flagcdn.com)
const FLAG_CDN_BASE = 'https://flagcdn.com';

// Detect Windows
const isWindows = typeof navigator !== 'undefined' && 
  /Windows/.test(navigator.userAgent);

/**
 * Get flag HTML for a country code
 * @param code - Two-letter country code (e.g., 'US', 'GH')
 * @param size - Size in pixels (default: 24)
 * @returns HTML string with flag (emoji or image)
 */
export function getFlagHtml(code: string, size: number = 24): string {
  const normalizedCode = code.toUpperCase();
  
  if (isWindows) {
    // Use image flags on Windows
    return `<img src="${FLAG_CDN_BASE}/w${size}/${normalizedCode.toLowerCase()}.png" 
      alt="${normalizedCode}" 
      class="flag-image" 
      style="width:${size}px;height:${size}px;object-fit:cover;border-radius:2px;"
      onerror="this.style.display='none'">`;
  } else {
    // Use emoji flags on macOS/Linux
    return `<span class="flag-emoji" style="font-size:${size}px;">${getFlagEmoji(normalizedCode)}</span>`;
  }
}

/**
 * Get flag emoji for a country code
 * @param code - Two-letter country code
 * @returns Flag emoji string
 */
export function getFlagEmoji(code: string): string {
  try {
    return code
      .toUpperCase()
      .split('')
      .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
      .join('');
  } catch {
    return '🌍';
  }
}

/**
 * Get flag CSS class based on platform
 * @returns CSS class name
 */
export function getFlagClass(): string {
  return isWindows ? 'flag-image' : 'flag-emoji';
}

/**
 * Preload flag images for Windows
 * @param codes - Array of country codes to preload
 */
export function preloadFlags(codes: string[]): void {
  if (!isWindows) return;
  
  codes.forEach(code => {
    const img = new Image();
    img.src = `${FLAG_CDN_BASE}/w40/${code.toLowerCase()}.png`;
  });
}
