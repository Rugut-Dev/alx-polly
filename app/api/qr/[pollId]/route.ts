import { generatePollQRCode, generateQRCodeSVG } from '@/lib/qr-code'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'png'
    const width = parseInt(searchParams.get('width') || '300')
    const margin = parseInt(searchParams.get('margin') || '2')

    const options = {
      width,
      margin,
      color: {
        dark: searchParams.get('dark') || '#000000',
        light: searchParams.get('light') || '#FFFFFF',
      },
    }

    if (format === 'svg') {
      const svg = await generateQRCodeSVG(params.pollId, options)
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } else {
      const dataURL = await generatePollQRCode(params.pollId, options)
      
      // Convert data URL to buffer
      const base64Data = dataURL.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}