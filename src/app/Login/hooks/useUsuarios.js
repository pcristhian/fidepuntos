import { useState, useEffect, useCallback } from 'react'
import bcrypt from 'bcryptjs'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Obtener todos los usuarios
  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/usuarios')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setUsuarios(data.usuarios)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Crear usuario (con contraseña hasheada)
  const crearUsuario = useCallback(async (nombre, password) => {
    setLoading(true)
    try {
      // Hashear la contraseña antes de enviarla
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre, 
          password: hashedPassword 
        })
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      await fetchUsuarios()
      return { success: true, usuario: data.usuario }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchUsuarios])

  // Actualizar usuario (con contraseña hasheada si se proporciona)
  const actualizarUsuario = useCallback(async (id, datos) => {
    setLoading(true)
    try {
      let datosActualizar = { ...datos }
      
      // Si se proporciona nueva contraseña, hashearla
      if (datos.password) {
        const salt = await bcrypt.genSalt(10)
        datosActualizar.password = await bcrypt.hash(datos.password, salt)
      }
      
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizar)
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      await fetchUsuarios()
      return { success: true, usuario: data.usuario }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchUsuarios])

  // Eliminar usuario
  const eliminarUsuario = useCallback(async (id) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      await fetchUsuarios()
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchUsuarios])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  return {
    usuarios,
    loading,
    error,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    fetchUsuarios
  }
}