import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useMostrarClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Obtener todos los clientes
  const fetchClientes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select(`
          *,
          sexo (
            id,
            nombre
          )
        `)
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (supabaseError) throw supabaseError

      const clientesFormateados = data.map(cliente => ({
        id: cliente.id,
        carnet: cliente.carnet_alfanumerico,
        nombre: cliente.nombre,
        apellido_paterno: cliente.apellido_paterno,
        apellido_materno: cliente.apellido_materno,
        nombre_completo: `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno || ''}`.trim(),
        fecha_nacimiento: cliente.fecha_nacimiento,
        sexo: cliente.sexo?.nombre || 'No especificado',
        sexo_id: cliente.sexo_id,
        descripcion_puntos: cliente.descripcion_puntos,
        url_imagen: cliente.url_imagen,
        puntos_actual: cliente.puntos_actual,
        puntos_acumulados_totales: cliente.puntos_acumulados_totales || 0,
        puntos_canjeados_totales: cliente.puntos_canjeados_totales || 0,
        activo: cliente.activo,
        created_at: cliente.created_at,
        updated_at: cliente.updated_at
      }))

      setClientes(clientesFormateados)
    } catch (err) {
      console.error('Error fetching clientes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Subir imagen a Cloudinary
  const subirImagenCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'clientes')

    const response = await fetch('/api/upload/cliente', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)

    return {
      url: data.url,
      public_id: data.public_id
    }
  }

  // Crear nuevo cliente con imagen
  const crearCliente = useCallback(async (clienteData, imagenFile = null) => {
    setUploading(true)
    setError(null)

    try {
      let imageUrl = null

      // Subir imagen a Cloudinary si existe
      if (imagenFile) {
        const result = await subirImagenCloudinary(imagenFile)
        imageUrl = result.url
      }

      // Insertar cliente en Supabase
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([
          {
            carnet_alfanumerico: clienteData.carnet,
            nombre: clienteData.nombre,
            apellido_paterno: clienteData.apellido_paterno,
            apellido_materno: clienteData.apellido_materno || null,
            fecha_nacimiento: clienteData.fecha_nacimiento,
            sexo_id: parseInt(clienteData.sexo_id),
            descripcion_puntos: clienteData.descripcion_puntos || null,
            url_imagen: imageUrl,
            puntos_actual: 0,
            puntos_acumulados_totales: 0,
            puntos_canjeados_totales: 0,
            activo: true
          }
        ])
        .select()

      if (supabaseError) throw supabaseError

      // Actualizar la lista localmente sin recargar toda la página
      const nuevoClienteFormateado = {
        id: data[0].id,
        carnet: data[0].carnet_alfanumerico,
        nombre: data[0].nombre,
        apellido_paterno: data[0].apellido_paterno,
        apellido_materno: data[0].apellido_materno,
        nombre_completo: `${data[0].nombre} ${data[0].apellido_paterno} ${data[0].apellido_materno || ''}`.trim(),
        fecha_nacimiento: data[0].fecha_nacimiento,
        sexo: clienteData.sexo_id === '1' ? 'Masculino' : 'Femenino',
        sexo_id: data[0].sexo_id,
        descripcion_puntos: data[0].descripcion_puntos,
        url_imagen: imageUrl,
        puntos_actual: 0,
        puntos_acumulados_totales: 0,
        puntos_canjeados_totales: 0,
        activo: true,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      }

      setClientes(prev => [nuevoClienteFormateado, ...prev])

      return { success: true, cliente: nuevoClienteFormateado }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setUploading(false)
    }
  }, [])

  // Actualizar cliente existente
  const actualizarCliente = useCallback(async (id, clienteData, imagenFile = null) => {
    setUploading(true)
    setError(null)

    try {
      let imageUrl = clienteData.url_imagen

      // Subir nueva imagen si existe
      if (imagenFile) {
        const result = await subirImagenCloudinary(imagenFile)
        imageUrl = result.url
      }

      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .update({
          carnet_alfanumerico: clienteData.carnet,
          nombre: clienteData.nombre,
          apellido_paterno: clienteData.apellido_paterno,
          apellido_materno: clienteData.apellido_materno || null,
          fecha_nacimiento: clienteData.fecha_nacimiento,
          sexo_id: parseInt(clienteData.sexo_id),
          descripcion_puntos: clienteData.descripcion_puntos || null,
          url_imagen: imageUrl,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()

      if (supabaseError) throw supabaseError

      await fetchClientes()
      return { success: true, cliente: data[0] }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setUploading(false)
    }
  }, [fetchClientes])

  // Eliminar cliente (soft delete)
  const eliminarCliente = useCallback(async (id) => {
    setLoading(true)
    try {
      const { error: supabaseError } = await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id', id)

      if (supabaseError) throw supabaseError

      setClientes(prev => prev.filter(cliente => cliente.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Calcular estadísticas
  const estadisticas = {
    total: clientes.length,
    totalPuntos: clientes.reduce((sum, c) => sum + (c.puntos_actual || 0), 0),
    totalPuntosAcumulados: clientes.reduce((sum, c) => sum + (c.puntos_acumulados_totales || 0), 0),
    totalPuntosCanjeados: clientes.reduce((sum, c) => sum + (c.puntos_canjeados_totales || 0), 0),
    promedioPuntos: clientes.length > 0
      ? Math.round(clientes.reduce((sum, c) => sum + (c.puntos_actual || 0), 0) / clientes.length)
      : 0
  }

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  return {
    clientes,
    loading,
    uploading,
    error,
    estadisticas,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    refetch: fetchClientes
  }
}