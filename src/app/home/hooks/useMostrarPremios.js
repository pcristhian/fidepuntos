// hooks/useMostrarPremios.js
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
        console.log('1. Iniciando fetch de premios...')

        // Verificar conexión a Supabase
        console.log('2. Supabase cliente:', supabase ? 'Inicializado' : 'No inicializado')

        // Prueba simple de conexión
        const { data: testData, error: testError } = await supabase
          .from('premios')
          .select('count')

        console.log('3. Prueba de conexión:', testError ? 'Error' : 'Exitosa', testError?.message)

        // Si hay error de conexión, mostrar específicamente
        if (testError) {
          throw new Error(`Error de conexión a Supabase: ${testError.message}`)
        }

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
          .eq('disponible', true)
          .order('puntos_equivalentes', { ascending: true })

        console.log('4. Resultado consulta:', {
          dataLength: data?.length,
          error: supabaseError,
          supabaseErrorMsg: supabaseError?.message
        })

        if (supabaseError) {
          console.error('5. Error de Supabase:', supabaseError)
          throw new Error(`Error en consulta: ${supabaseError.message}`)
        }

        if (data && data.length > 0) {
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
          console.log('6. Premios cargados exitosamente:', premiosFormateados.length)
        } else {
          console.log('7. No hay premios en la base de datos')
          setPremios([])
        }

      } catch (err) {
        console.error('8. Error capturado:', err)
        console.error('8a. Mensaje:', err.message)
        console.error('8b. Stack:', err.stack)
        setError(err.message || 'Error desconocido al cargar premios')
      } finally {
        setLoading(false)
        console.log('9. Loading establecido a false')
      }
    }

    fetchPremios()
  }, [])

  return { premios, loading, error }
}