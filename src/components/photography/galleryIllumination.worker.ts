import { calculateIllumination, type IlluminationInput } from './galleryIllumination'

const workerScope = self as unknown as {
  onmessage: (event: MessageEvent<IlluminationInput>) => void
  postMessage: (message: unknown, transfer: Transferable[]) => void
}

workerScope.onmessage = ({ data }) => {
  const pixels = calculateIllumination(data)
  workerScope.postMessage({ pixels, width: data.width, height: data.height }, [pixels.buffer])
}
