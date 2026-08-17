export const size = { width: 32, height: 32 };
export const contentType = "image/svg+xml";

export default function Icon() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 32 32">
    <rect width="100%" height="100%" rx="7" fill="#0d3b3a" />
    <g transform="translate(6 6) scale(1.3333)" fill="none">
      <path d="M3 12h4l2-7 4 14 2-7h6" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>`;

  return new Response(svg, {
    status: 200,
    headers: { "Content-Type": contentType },
  });
}
