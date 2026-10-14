export type IlluminationInput = {
  width: number
  height: number
  viewportWidth: number
  seconds: number
  reduced: boolean
  density: number
  wallDistance: number
  exposure: number
  rgb: number[]
}

export function calculateIllumination(input: IlluminationInput) {
  const { width, height, viewportWidth, seconds, reduced, density, wallDistance, exposure, rgb } = input
  const positions = [{ x: 10, drop: 46 }, { x: 23, drop: 82 }, { x: 36, drop: 54 }, { x: 50, drop: 98 }, { x: 64, drop: 42 }, { x: 77, drop: 76 }, { x: 90, drop: 52 }]
  const sources = positions.flatMap(({ x, drop }, index) => {
    if (viewportWidth <= 560 && ![1, 3, 5].includes(index)) return []
    const t = x / 100
    const angle = reduced ? 0 : Math.sin(seconds / (5 + index * 0.35) + index * 0.8) * 1.2 * Math.PI / 180
    const length = drop + 52
    return [{ x: viewportWidth * t + Math.sin(angle) * length, y: 12 + 176 * t * (1 - t) + Math.cos(angle) * length, power: 2200 * (reduced ? 1 : 0.9 + 0.1 * Math.sin(seconds / (4 + index * 0.5) + index * 0.8)) }]
  })
  const pixels = new Uint8ClampedArray(width * height * 4)
  // Adjust wall reflectance with distance to compare spread at the same peak brightness.
  const wallReflectance = (wallDistance / 90) ** 2
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const px = (x + 0.5) * viewportWidth / width
    const py = (y + 0.5) * 1400 / height - 400
    let energy = 0
    for (const source of sources) {
      const radiusSquared = (px - source.x) ** 2 + (py - source.y) ** 2
      const distanceSquared = radiusSquared + wallDistance ** 2
      const radius = Math.sqrt(radiusSquared + 16)
      energy += source.power * wallReflectance * wallDistance / distanceSquared ** 1.5
      energy += density * source.power * (Math.atan(100 / radius) + Math.atan(90 / radius)) / radius / (4 * Math.PI) * Math.exp(-density * 95)
    }
    const offset = (y * width + x) * 4
    pixels[offset] = rgb[0]
    pixels[offset + 1] = rgb[1]
    pixels[offset + 2] = rgb[2]
    pixels[offset + 3] = Math.round(255 * (1 - Math.exp(-energy * exposure)))
  }
  return pixels
}
