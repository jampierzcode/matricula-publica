import type { Sede } from '../api'

interface Props {
  sedes: Sede[]
  value: number
  onChange: (id: number) => void
}

export default function SedeSelector({ sedes, value, onChange }: Props) {
  if (sedes.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No hay sedes disponibles. Contacta a la academia.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sedes.map((s) => {
        const seleccionada = value === s.id
        const direccion = [s.direction, s.district, s.province, s.department]
          .filter(Boolean)
          .join(', ')
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`text-left rounded-lg border-2 p-3 transition ${
              seleccionada
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold truncate ${
                    seleccionada ? 'text-primary' : 'text-gray-900'
                  }`}
                >
                  {s.name_referential}
                </div>
                {direccion && (
                  <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {direccion}
                  </div>
                )}
              </div>
              {seleccionada && (
                <svg
                  className="w-5 h-5 text-primary shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            {s.googleMapsUrl && (
              <a
                href={s.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver en Google Maps
              </a>
            )}
          </button>
        )
      })}
    </div>
  )
}
