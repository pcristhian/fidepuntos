'use client'

import { useState } from 'react'
import { useMostrarClientes } from '../hooks/useMostrarClientes'
import { motion, AnimatePresence } from 'framer-motion'
import ModalNuevoCliente from './ModalNuevoCliente'

export default function MostrarClientes() {
  const { clientes, loading, error, estadisticas, refetch } = useMostrarClientes()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar clientes por nombre, carnet o apellidos
  const clientesFiltrados = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase()
    return (
      cliente.nombre_completo.toLowerCase().includes(searchLower) ||
      cliente.carnet.toLowerCase().includes(searchLower) ||
      cliente.nombre.toLowerCase().includes(searchLower) ||
      cliente.apellido_paterno.toLowerCase().includes(searchLower) ||
      (cliente.apellido_materno && cliente.apellido_materno.toLowerCase().includes(searchLower))
    )
  })

  const isSearchActive = searchTerm.length > 0

  const handleClienteCreado = () => {
    refetch() // Recargar la lista de clientes
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No hay clientes registrados
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1"></div>
          <div className="font-bold text-3xl text-gray-800">
            Lista de Clientes
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar por nombre, carnet o apellido..."
              className="w-full px-4 py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              {clientesFiltrados.length} de {clientes.length} clientes encontrados
            </p>
          )}
        </div>
      </div>

      {/* Estadísticas - se ocultan cuando hay búsqueda activa */}
      <AnimatePresence>
        {!isSearchActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Total Clientes</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Puntos Totales</p>
                <p className="text-2xl font-bold">{estadisticas.totalPuntos.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Puntos Acumulados</p>
                <p className="text-2xl font-bold">{estadisticas.totalPuntosAcumulados.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Promedio Puntos</p>
                <p className="text-2xl font-bold">{estadisticas.promedioPuntos.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de clientes filtrados */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No se encontraron clientes con el término "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesFiltrados.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              {/* Imagen del cliente */}
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                {cliente.url_imagen ? (
                  <img
                    src={cliente.url_imagen}
                    alt={cliente.nombre_completo}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">👤</span>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {cliente.nombre_completo}
                </h3>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Carnet:</span> {cliente.carnet}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Sexo:</span> {cliente.sexo}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">Fecha Nac.:</span>
                    {new Date(cliente.fecha_nacimiento).toLocaleDateString('es-ES')}
                  </p>

                  {/* Puntos */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Puntos Actuales</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {cliente.puntos_actual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Acumulados: {cliente.puntos_acumulados_totales.toLocaleString()}</span>
                      <span>Canjeados: {cliente.puntos_canjeados_totales.toLocaleString()}</span>
                    </div>
                  </div>

                  {cliente.descripcion_puntos && (
                    <p className="text-xs text-gray-400 italic mt-2">
                      {cliente.descripcion_puntos}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Nuevo Cliente */}
      <ModalNuevoCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClienteCreado={handleClienteCreado}
      />
    </div>
  )
}