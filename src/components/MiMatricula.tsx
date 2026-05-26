import { useEffect, useState } from 'react'
import api, { type MiMatriculaData } from '../api'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function MiMatricula({ token }: { token: string }) {
  const [data, setData] = useState<MiMatriculaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/public/matricula/${token}`)
      .then((r) => {
        if (r.data.status === 'success') setData(r.data.data)
        else setError('No encontramos tu matrícula.')
      })
      .catch(() => setError('No encontramos tu matrícula.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading)
    return <p className="text-center text-gray-500 mt-12">Cargando tu matrícula...</p>
  if (error || !data)
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-700">{error || 'No encontramos tu matrícula.'}</p>
      </div>
    )

  const horaShort = (h: string) => (h ? h.slice(0, 5) : '')
  const fmtFecha = (f: string | null) =>
    f ? new Date(f).toLocaleDateString('es-PE') : '—'

  // Agrupar horario por día
  const porDia = DIAS.map((d) => ({
    dia: d,
    clases: data.horario.filter((c) => c.dia === d),
  })).filter((g) => g.clases.length > 0)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Resumen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-primary mb-1">
          ¡Hola {data.estudiante.nombre}! 🎓
        </h1>
        <p className="text-gray-600 text-sm mb-4">Esta es tu matrícula confirmada.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <Dato label="Ciclo" valor={data.ciclo} />
          <Dato label="Modalidad" valor={data.modalidad} />
          <Dato label="Turno" valor={data.turno} />
          <Dato label="Canal" valor={data.canal?.nombre} />
          <Dato label="Área" valor={data.canal?.area} />
          <Dato label="Carrera" valor={data.carrera} />
        </div>
      </div>

      {/* Horario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">📅 Tu horario</h2>
        {porDia.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aún no se ha publicado el horario de tu canal. Te avisaremos pronto.
          </p>
        ) : (
          <div className="space-y-4">
            {porDia.map((g) => (
              <div key={g.dia}>
                <h3 className="font-semibold text-primary mb-1">{g.dia}</h3>
                <div className="space-y-1">
                  {g.clases.map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-gray-50 rounded px-3 py-2 text-sm"
                    >
                      <span className="font-mono text-gray-700">
                        {horaShort(c.horaInicio)}–{horaShort(c.horaFin)}
                      </span>
                      <span className="font-medium">{c.curso || 'Curso'}</span>
                      {c.profesor && (
                        <span className="text-gray-500">· {c.profesor}</span>
                      )}
                      {(c.aula || c.codigoAula) && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary rounded px-2 py-0.5">
                          Aula {c.aula || ''} {c.codigoAula ? `(${c.codigoAula})` : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cronograma de pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">💳 Cronograma de pagos</h2>
        {data.cronograma.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin cuotas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-2">Concepto</th>
                  <th className="py-2 px-2">Vence</th>
                  <th className="py-2 px-2 text-right">Monto</th>
                  <th className="py-2 pl-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.cronograma.map((q, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-2 capitalize">
                      {q.tipo}
                      {q.tipo === 'mensualidad' ? ` #${q.numeroCuota}` : ''}
                    </td>
                    <td className="py-2 px-2">{fmtFecha(q.fechaVencimiento)}</td>
                    <td className="py-2 px-2 text-right">
                      S/ {Number(q.montoEsperado).toFixed(2)}
                    </td>
                    <td className="py-2 pl-2 text-right">
                      <EstadoBadge estado={q.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-gray-400 pb-6">
        © Academia Élite — Guarda este enlace para consultar tu matrícula.
      </footer>
    </div>
  )
}

function Dato({ label, valor }: { label: string; valor?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-gray-800">{valor || '—'}</p>
    </div>
  )
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pagada: 'bg-green-100 text-green-700',
    parcial: 'bg-yellow-100 text-yellow-700',
    pendiente: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`rounded px-2 py-0.5 text-xs capitalize ${map[estado] || map.pendiente}`}>
      {estado}
    </span>
  )
}
