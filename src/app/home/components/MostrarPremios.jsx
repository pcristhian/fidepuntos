'use client'

import { useMostrarPremios } from '../hooks/useMostrarPremios'
import { motion } from 'framer-motion'

export default function MostrarPremios() {
  const { premios, loading, error } = useMostrarPremios()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando premios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold mb-2">Error al cargar los premios</h3>
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (premios.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-bold mb-2">No hay premios disponibles</h3>
        <p className="text-yellow-600 text-sm">
          Pronto agregaremos nuevos premios.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Catálogo de Premios
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Canjea tus puntos por estos increíbles premios
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {premios.map((premio, index) => (
          <motion.div
            key={premio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Imagen del premio */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              {premio.url_imagen ? (
            // Modo 2: Recorte inteligente (enfoca en el sujeto principal)
              <img
                src={premio.url_imagen?.replace('/upload/', '/upload/w_400,h_300,c_pad,b_white/')}
                alt={premio.nombre}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen'
                }}
              />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Badge de stock */}
              {premio.stock !== null && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                  premio.stock > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {premio.stock > 0 ? `Stock: ${premio.stock}` : 'Agotado'}
                </div>
              )}
            </div>
            
            {/* Información del premio */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">
                  {premio.nombre}
                </h3>
              </div>
              
              {premio.categoria && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                  {premio.categoria}
                </span>
              )}
              
              {premio.descripcion && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {premio.descripcion}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                    {premio.puntos_equivalentes.toLocaleString('es-ES')} pts
                  </div>
                </div>
                
                <button
                  disabled={premio.stock === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    premio.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => alert(`Funcionalidad de canje en desarrollo`)}
                >
                  Canjear
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Resumen */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        Total de premios disponibles: {premios.length}
      </div>
    </div>
  )
}