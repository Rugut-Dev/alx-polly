import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

export const generatePollQRCode = async (
  pollId: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL}/polls/${pollId}`
  
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    ...options,
  }

  try {
    return await QRCode.toDataURL(pollUrl, defaultOptions)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export const generateQRCodeSVG = async (
  pollId: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL}/polls/${pollId}`
  
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    ...options,
  }

  try {
    return await QRCode.toString(pollUrl, {
      type: 'svg',
      ...defaultOptions,
    })
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

export const downloadQRCode = async (pollId: string, filename?: string) => {
  try {
    const qrCodeDataURL = await generatePollQRCode(pollId)
    
    const link = document.createElement('a')
    link.download = filename || `poll-${pollId}-qr.png`
    link.href = qrCodeDataURL
    link.click()
  } catch (error) {
    console.error('Error downloading QR code:', error)
    throw new Error('Failed to download QR code')
  }
}