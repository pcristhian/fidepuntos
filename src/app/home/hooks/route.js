import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    console.log('Cloudinary config check:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '✓ configurado' : '✗ faltante',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ configurado' : '✗ faltante'
    })

    // Intentar obtener imágenes de la carpeta 'premios'
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'premios/',
      max_results: 50,
      resource_type: 'image'
    })

    console.log('Imágenes encontradas:', result.resources?.length || 0)
    
    if (!result.resources || result.resources.length === 0) {
      return NextResponse.json({ 
        resources: [],
        message: 'No se encontraron imágenes en la carpeta premios'
      })
    }

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error detallado:', error)
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Verifica que la carpeta "premios" exista en Cloudinary'
      },
      { status: 500 }
    )
  }
}