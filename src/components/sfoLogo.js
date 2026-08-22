/**
 * Sahasraartha Family Office LLP - Official Logo Component
 * Renders the exact uploaded Sahasraartha Family Office emblem & brand mark without modification.
 */

export function renderSFOEmblem({ size = 48, className = '', id = 'sfo-emblem', style = '' } = {}) {
  return `
    <img 
      src="./sahasrartha-logo.jpg" 
      alt="Sahasrartha Family Office Emblem" 
      class="${className}" 
      id="${id}"
      style="width: ${size}px; height: ${size}px; object-fit: cover; border-radius: 50%; filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.45)); border: 2px solid rgba(212, 175, 55, 0.7); display: inline-block; ${style}" 
    />
  `;
}

export function renderSFOLogo({ width = 140, className = '', id = 'sfo-logo', style = '' } = {}) {
  return `
    <div class="sfo-exact-logo-wrapper ${className}" id="${id}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; ${style}">
      <div style="position: relative; width: ${width}px; height: ${width}px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #FFF0C2 0%, #D4AF37 50%, #8A6218 100%); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55), 0 0 24px rgba(212, 175, 55, 0.45); display: flex; align-items: center; justify-content: center;">
        <img 
          src="./sahasrartha-logo.jpg" 
          alt="Sahasrartha Family Office Logo" 
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 1.5px solid rgba(0, 0, 0, 0.35); display: block;" 
        />
      </div>
    </div>
  `;
}
