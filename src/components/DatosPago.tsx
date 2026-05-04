import { useEffect, useState } from 'react'
import api, { type ConfiguracionPublica } from '../api'

interface MetodoImagen {
  id: number
  url: string
  descripcion: string | null
  orden: number
}

/**
 * Muestra los métodos de pago configurados desde el admin:
 *  - Texto libre del campo `estadosCuenta` (cuentas, alias, etc.)
 *  - Imágenes (screenshots) de la tabla `metodos_pago_imagenes`
 *
 * Si ambos están vacíos, no renderiza nada.
 */
export default function DatosPago() {
  const [config, setConfig] = useState<ConfiguracionPublica | null>(null)
  const [imagenes, setImagenes] = useState<MetodoImagen[]>([])
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    api
      .get('/public/configuracion')
      .then((res) => setConfig(res.data.data || null))
      .catch(() => setConfig(null))
    api
      .get('/public/metodos-pago-imagenes')
      .then((res) => setImagenes(res.data.data || []))
      .catch(() => setImagenes([]))
  }, [])

  const texto = config?.estadosCuenta?.trim() || ''
  if (!texto && imagenes.length === 0) return null

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-primary">Datos para depósito (opcional)</h3>
        {texto && (
          <button
            type="button"
            onClick={copiar}
            className="text-xs text-primary hover:underline shrink-0"
          >
            {copiado ? '✓ Copiado' : 'Copiar texto'}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Si ya realizaste el pago, puedes adjuntar el voucher abajo. Si no,
        también puedes enviar la solicitud sin él y nuestro equipo te
        contactará.
      </p>

      {texto && (
        <div className="bg-white rounded border border-blue-100 p-3 text-sm whitespace-pre-wrap font-mono text-gray-700 mb-3">
          {texto}
        </div>
      )}

      {imagenes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {imagenes.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded border border-blue-100 p-2"
            >
              {img.descripcion && (
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {img.descripcion}
                </div>
              )}
              <a href={img.url} target="_blank" rel="noreferrer">
                <img
                  src={img.url}
                  alt={img.descripcion || 'Método de pago'}
                  className="w-full h-auto max-h-64 object-contain rounded"
                />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
