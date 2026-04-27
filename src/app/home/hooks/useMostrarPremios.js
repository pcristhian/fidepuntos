import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useMostrarPremios() {
  const [premios, setPremios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        setLoading(true)
        
        // Obtener premios con la información de categoría
        const { data, error: supabaseError } = await supabase
          .from('premios')
          .select(`
            *,
            categorias_premios!premios_categoria_id_fkey (
              id,
              nombre
            )
          `)
          .eq('disponible', true) // Solo premios disponibles
          .order('puntos_equivalentes', { ascending: true }) // Ordenar por puntos
          // .limit(10) // Opcional: limitar resultados
        
        if (supabaseError) throw supabaseError
        
        if (data && data.length > 0) {
          // Formatear los datos
          const premiosFormateados = data.map(premio => ({
            id: premio.id,
            nombre: premio.nombre,
            descripcion: premio.descripcion,
            puntos_equivalentes: premio.puntos_equivalentes,
            url_imagen: premio.url_imagen,
            stock: premio.stock,
            disponible: premio.disponible,
            categoria: premio.categorias_premios?.nombre || 'Sin categoría',
            categoria_id: premio.categoria_id
          }))
          
          setPremios(premiosFormateados)
          console.log('Premios cargados:', premiosFormateados.length)
        } else {
          console.log('No hay premios en la base de datos')
          setPremios([])
        }
        
      } catch (err) {
        console.error('Error al cargar premios:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPremios()
  }, [])

  return { premios, loading, error }
}