// SVG Album Art Generator for high aesthetic fallback covers

const GENRE_PALETTES = {
  "Synth-Pop / New Wave": ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  "Hard Rock / Heavy Metal": ["#ef4444", "#dc2626", "#18181b", "#71717a"],
  "Eurodance / House / Club": ["#10b981", "#06b6d4", "#f59e0b", "#6366f1"],
  "Pop / Disco / Funk": ["#f59e0b", "#ec4899", "#eab308", "#8b5cf6"],
  "Classic Rock / Soft Rock": ["#d97706", "#b45309", "#1e293b", "#334155"],
  "Tango / Folklore / Rock Nacional": ["#fbbf24", "#d97706", "#78350f", "#451a03"],
  "Latino / Cumbia / Cuarteto": ["#f43f5e", "#fb923c", "#facc15", "#10b981"],
  "Blues / Jazz / Soul": ["#3b82f6", "#1d4ed8", "#1e1b4b", "#f59e0b"],
  "Pop / Rock General": ["#6366f1", "#a855f7", "#0ea5e9", "#f59e0b"]
};

export function generateFallbackCoverSVG(artist, title, genre, year) {
  const colors = GENRE_PALETTES[genre] || GENRE_PALETTES["Pop / Rock General"];
  const c1 = colors[0];
  const c2 = colors[1];
  const c3 = colors[2] || "#0f172a";
  
  // Clean text for display
  const displayArtist = (artist || "Unknown Artist").toUpperCase();
  const displayTitle = (title || "Vinyl Album").toUpperCase();
  const displayYear = year && year !== "N/A" ? year : "";

  // Hash string for deterministic geometric shapes
  let hash = 0;
  const str = artist + title;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const shapeType = Math.abs(hash) % 4;

  let shapesSvg = '';
  if (shapeType === 0) {
    // Concentric vinyl circles
    shapesSvg = `
      <circle cx="200" cy="200" r="140" fill="none" stroke="${c2}" stroke-width="6" opacity="0.4"/>
      <circle cx="200" cy="200" r="100" fill="none" stroke="${c1}" stroke-width="12" opacity="0.6"/>
      <circle cx="200" cy="200" r="60" fill="${c2}" opacity="0.8"/>
    `;
  } else if (shapeType === 1) {
    // Retro diagonal stripes
    shapesSvg = `
      <polygon points="0,0 120,0 400,280 400,400" fill="${c1}" opacity="0.3"/>
      <polygon points="0,80 0,200 200,400 320,400" fill="${c2}" opacity="0.5"/>
      <circle cx="300" cy="100" r="70" fill="${c1}" opacity="0.7"/>
    `;
  } else if (shapeType === 2) {
    // Synthwave Grid & Sun
    shapesSvg = `
      <circle cx="200" cy="180" r="80" fill="url(#sunGrad)"/>
      <path d="M0,260 L400,260 M0,290 L400,290 M0,330 L400,330 M0,380 L400,380 M50,240 L0,400 M120,240 L50,400 M200,240 L200,400 M280,240 L350,400 M350,240 L400,400" stroke="${c2}" stroke-width="2" opacity="0.4"/>
    `;
  } else {
    // Abstract geometric polygons
    shapesSvg = `
      <rect x="60" y="60" width="280" height="280" fill="none" stroke="${c1}" stroke-width="8" transform="rotate(15 200 200)" opacity="0.4"/>
      <circle cx="200" cy="200" r="90" fill="${c2}" opacity="0.6"/>
      <rect x="120" y="120" width="160" height="160" fill="${c1}" opacity="0.5"/>
    `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c3}" />
          <stop offset="50%" stop-color="#090a0f" />
          <stop offset="100%" stop-color="${c1}" stop-opacity="0.3" />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="url(#bgGrad)"/>
      
      <!-- Vintage Vinyl Overlay Textures -->
      <circle cx="200" cy="200" r="190" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.05"/>
      <circle cx="200" cy="200" r="160" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.05"/>
      <circle cx="200" cy="200" r="130" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.05"/>

      <!-- Geometric Art -->
      ${shapesSvg}

      <!-- Top Banner / Label -->
      <rect x="20" y="25" width="360" height="4" fill="${c1}"/>
      <text x="380" y="20" font-family="Outfit, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="end" letter-spacing="2">${genre.toUpperCase()}</text>

      <!-- Center Text Section -->
      <rect x="20" y="260" width="360" height="115" fill="rgba(10, 11, 16, 0.85)" rx="8"/>
      <rect x="20" y="260" width="4" height="115" fill="${c1}"/>
      
      <text x="35" y="292" font-family="Outfit, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="0.5">${escapeXml(truncateText(displayArtist, 24))}</text>
      <text x="35" y="322" font-family="Outfit, sans-serif" font-size="16" font-weight="600" fill="${c1}">${escapeXml(truncateText(displayTitle, 28))}</text>
      
      <text x="35" y="354" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">${displayYear ? 'EDICIÓN ' + displayYear : 'VINILO ORIGINAL'}</text>
      <text x="365" y="354" font-family="Outfit, sans-serif" font-size="11" font-weight="800" fill="${c2}" text-anchor="end" letter-spacing="1">STEREO 33⅓ RPM</text>
    </svg>
  `;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svgString);
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function truncateText(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
}
