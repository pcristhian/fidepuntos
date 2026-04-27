'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export default function LoginSimple() {
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Buscar usuario por nombre
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .select('id, nombre, password')
        .eq('nombre', nombre)
        .single()

      if (supabaseError || !data) {
        setError('Usuario no encontrado')
        setLoading(false)
        return
      }

      // Comparar contraseña con bcrypt
      const isValid = await bcrypt.compare(password, data.password)

      if (isValid) {
        // Guardar usuario sin la contraseña
        const { password: _, ...userWithoutPassword } = data
        localStorage.setItem('usuario', JSON.stringify(userWithoutPassword))
        router.push('/usuarios')
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (err) {
      setError('Error al conectar con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p className="text-gray-300">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}