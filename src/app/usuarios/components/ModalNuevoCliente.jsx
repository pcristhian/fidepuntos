'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMostrarClientes } from '../hooks/useMostrarClientes'

export default function ModalNuevoCliente({ isOpen, onClose, onClienteCreado }) {
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [localError, setLocalError] = useState('')
    const fileInputRef = useRef(null)
    const { crearCliente, uploading, error: hookError } = useMostrarClientes()

    const [formData, setFormData] = useState({
        carnet: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        sexo_id: '',
        descripcion_puntos: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPreviewImage(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleTakePhoto = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment'
        input.onchange = (e) => handleImageSelect(e)
        input.click()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError('')

        if (!formData.carnet || !formData.nombre || !formData.apellido_paterno ||
            !formData.fecha_nacimiento || !formData.sexo_id) {
            setLocalError('Por favor, completa todos los campos obligatorios')
            return
        }

        const result = await crearCliente(formData, selectedFile)

        if (result.success) {
            setFormData({
                carnet: '',
                nombre: '',
                apellido_paterno: '',
                apellido_materno: '',
                fecha_nacimiento: '',
                sexo_id: '',
                descripcion_puntos: ''
            })
            setPreviewImage(null)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            onClienteCreado()
            onClose()
        } else {
            setLocalError(result.error)
        }
    }

    // Error a mostrar (priorizar error local o del hook)
    const displayError = localError || hookError

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center sticky top-0">
                                <h2 className="text-xl font-bold text-white">Nuevo Cliente</h2>
                                <button onClick={onClose} className="text-white hover:text-gray-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Foto */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Foto del Cliente</label>
                                    <div className="flex flex-col items-center gap-3">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img src={previewImage} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewImage(null)
                                                        setSelectedFile(null)
                                                        if (fileInputRef.current) fileInputRef.current.value = ''
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="flex gap-2 w-full">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                                📁 Seleccionar
                                            </button>
                                            <button type="button" onClick={handleTakePhoto} className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                                📸 Tomar Foto
                                            </button>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                    </div>
                                </div>

                                {/* Carnet */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Carnet *</label>
                                    <input
                                        type="text"
                                        name="carnet"
                                        value={formData.carnet}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: 123456789"
                                    />
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Juan"
                                    />
                                </div>

                                {/* Apellido Paterno */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido Paterno *</label>
                                    <input
                                        type="text"
                                        name="apellido_paterno"
                                        value={formData.apellido_paterno}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Pérez"
                                    />
                                </div>

                                {/* Apellido Materno */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido Materno</label>
                                    <input
                                        type="text"
                                        name="apellido_materno"
                                        value={formData.apellido_materno}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Gómez (opcional)"
                                    />
                                </div>

                                {/* Fecha Nacimiento */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento *</label>
                                    <input
                                        type="date"
                                        name="fecha_nacimiento"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Sexo */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sexo *</label>
                                    <select
                                        name="sexo_id"
                                        value={formData.sexo_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar sexo</option>
                                        <option value="1">Masculino</option>
                                        <option value="2">Femenino</option>
                                    </select>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción (opcional)</label>
                                    <textarea
                                        name="descripcion_puntos"
                                        value={formData.descripcion_puntos}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Notas adicionales sobre el cliente..."
                                    />
                                </div>

                                {/* Error */}
                                {displayError && (
                                    <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-2 rounded-lg text-sm">
                                        {displayError}
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {uploading ? 'Creando...' : 'Crear Cliente'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}