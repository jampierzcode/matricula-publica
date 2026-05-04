import { useEffect, useMemo, useState } from 'react'
import api, {
  type Ciclo,
  type Sede,
  type Turno,
  type SolicitudPayload,
  type UploadResponse,
} from '../api'
import DatosPago from './DatosPago'
import SedeSelector from './SedeSelector'

interface Props {
  onSuccess: (numeroSeguimiento: string) => void
}

type Modalidad = 'presencial' | 'virtual'

const initialForm = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  whatsapp: '',
  cicloId: 0,
  modalidad: '' as Modalidad | '',
  turnoId: 0,
  sedeId: 0,
  montoReferencia: '',
}

interface VoucherUpload {
  file: File | null
  uploaded: { url: string; key: string } | null
  subiendo: boolean
  error: string
}

const initialVoucher: VoucherUpload = {
  file: null,
  uploaded: null,
  subiendo: false,
  error: '',
}

export default function MatriculaForm({ onSuccess }: Props) {
  const [ciclos, setCiclos] = useState<Ciclo[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [form, setForm] = useState(initialForm)
  const [voucherMatricula, setVoucherMatricula] =
    useState<VoucherUpload>(initialVoucher)
  const [voucherMensualidad, setVoucherMensualidad] =
    useState<VoucherUpload>(initialVoucher)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/public/ciclos')
      .then((r) => setCiclos(r.data.data || []))
      .catch(() => {})
    api
      .get('/public/sedes')
      .then((r) => setSedes(r.data.data || []))
      .catch(() => {})
    api
      .get('/public/turnos')
      .then((r) => setTurnos(r.data.data || []))
      .catch(() => {})
  }, [])

  const cicloSeleccionado = useMemo(
    () => ciclos.find((c) => c.id === form.cicloId),
    [ciclos, form.cicloId]
  )

  const precios = useMemo(() => {
    if (!cicloSeleccionado || !form.modalidad)
      return { matricula: null, mensualidad: null }
    const isP = form.modalidad === 'presencial'
    return {
      matricula: isP
        ? cicloSeleccionado.montoMatriculaPresencial
        : cicloSeleccionado.montoMatriculaVirtual,
      mensualidad: isP
        ? cicloSeleccionado.montoMensualidadPresencial
        : cicloSeleccionado.montoMensualidadVirtual,
    }
  }, [cicloSeleccionado, form.modalidad])

  const update = (k: string, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }))

  const subirVoucher = async (
    file: File,
    setter: React.Dispatch<React.SetStateAction<VoucherUpload>>
  ) => {
    setter({ file, uploaded: null, subiendo: true, error: '' })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post<UploadResponse>(
        '/public/uploads/comprobante',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setter({
        file,
        uploaded: { url: res.data.data.url, key: res.data.data.key },
        subiendo: false,
        error: '',
      })
    } catch {
      setter({
        file,
        uploaded: null,
        subiendo: false,
        error: 'No se pudo subir. Inténtalo de nuevo.',
      })
    }
  }

  const validar = (): string | null => {
    if (!form.nombre.trim()) return 'Tu nombre es requerido'
    if (!form.whatsapp.trim()) return 'WhatsApp es requerido'
    if (!form.cicloId) return 'Selecciona el ciclo'
    if (!form.modalidad) return 'Selecciona la modalidad'
    if (!form.turnoId) return 'Selecciona el turno'
    if (!form.sedeId) return 'Selecciona la sede donde quieres estudiar'
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return 'Email no válido'
    if (voucherMatricula.subiendo || voucherMensualidad.subiendo)
      return 'Espera a que terminen de subir los comprobantes'
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const err = validar()
    if (err) {
      setError(err)
      return
    }

    setEnviando(true)
    const payload: SolicitudPayload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim() || undefined,
      dni: form.dni.trim() || undefined,
      email: form.email.trim() || undefined,
      whatsapp: form.whatsapp.trim(),
      cicloId: form.cicloId,
      modalidad: form.modalidad as Modalidad,
      turnoId: form.turnoId,
      sedeId: form.sedeId || undefined,
      comprobanteMatriculaUrl: voucherMatricula.uploaded?.url,
      comprobanteMatriculaKey: voucherMatricula.uploaded?.key,
      comprobanteMensualidadUrl: voucherMensualidad.uploaded?.url,
      comprobanteMensualidadKey: voucherMensualidad.uploaded?.key,
      montoReferencia: form.montoReferencia
        ? Number(form.montoReferencia)
        : undefined,
    }

    try {
      const res = await api.post('/public/solicitudes-matricula', payload)
      if (res.data.status === 'success' && res.data.data) {
        onSuccess(res.data.data.numeroSeguimiento)
      } else {
        setError(res.data.message || 'Error al enviar')
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'No se pudo enviar la solicitud. Inténtalo de nuevo.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-primary mb-1">
        Solicitud de matrícula
      </h1>
      <p className="text-gray-600 mb-6 text-sm">
        Completa tus datos. Te contactaremos por WhatsApp para confirmar.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Section titulo="Datos personales">
          <Input
            label="Nombre *"
            value={form.nombre}
            onChange={(v) => update('nombre', v)}
          />
          <Input
            label="Apellido"
            value={form.apellido}
            onChange={(v) => update('apellido', v)}
          />
          <Input
            label="DNI"
            value={form.dni}
            onChange={(v) => update('dni', v)}
            maxLength={15}
          />
          <Input
            label="WhatsApp *"
            value={form.whatsapp}
            onChange={(v) => update('whatsapp', v)}
            placeholder="9XXXXXXXX"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            className="md:col-span-2"
          />
        </Section>

        <Section titulo="Ciclo y modalidad">
          <Select
            label="Ciclo *"
            value={form.cicloId || ''}
            onChange={(v) => update('cicloId', Number(v))}
            options={[
              { value: '', label: 'Selecciona' },
              ...ciclos.map((c) => ({ value: c.id, label: c.nombre })),
            ]}
            className="md:col-span-2"
          />
          <Select
            label="Modalidad *"
            value={form.modalidad}
            onChange={(v) => update('modalidad', v)}
            options={[
              { value: '', label: 'Selecciona' },
              { value: 'presencial', label: 'Presencial' },
              { value: 'virtual', label: 'Virtual' },
            ]}
          />
          <Select
            label="Turno *"
            value={form.turnoId || ''}
            onChange={(v) => update('turnoId', Number(v))}
            options={[
              { value: '', label: 'Selecciona' },
              ...turnos
                .filter((t) => t.activo)
                .map((t) => ({
                  value: t.id,
                  label: `${t.nombre} (${t.horaInicio?.slice(0, 5)} - ${t.horaFin?.slice(0, 5)})`,
                })),
            ]}
          />
          {sedes.length > 0 && (
            <div className="md:col-span-2">
              <span className="text-sm text-gray-600 mb-2 block">Sede *</span>
              <SedeSelector
                sedes={sedes}
                value={form.sedeId}
                onChange={(id) => update('sedeId', id)}
              />
            </div>
          )}
          {precios.matricula !== null && (
            <div className="md:col-span-2 bg-gray-50 rounded p-3 text-sm">
              <div className="flex justify-between">
                <span>Matrícula:</span>
                <span className="font-semibold">
                  S/ {Number(precios.matricula).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Mensualidad:</span>
                <span className="font-semibold">
                  S/ {Number(precios.mensualidad).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estos son los precios referenciales. La academia puede aplicar
                descuentos al confirmar.
              </p>
            </div>
          )}
        </Section>

        <DatosPago />

        <Section titulo="Comprobantes (opcional)">
          <div className="md:col-span-2 text-xs text-gray-500 -mt-1 mb-1">
            Si ya pagaste matrícula y/o mensualidad, sube los vouchers. También
            puedes enviar la solicitud sin ellos — tu pago se confirma luego.
          </div>
          <VoucherInput
            label="Voucher de matrícula"
            voucher={voucherMatricula}
            onSelect={(file) => subirVoucher(file, setVoucherMatricula)}
            onClear={() => setVoucherMatricula(initialVoucher)}
          />
          <VoucherInput
            label="Voucher de mensualidad"
            voucher={voucherMensualidad}
            onSelect={(file) => subirVoucher(file, setVoucherMensualidad)}
            onClear={() => setVoucherMensualidad(initialVoucher)}
          />
          <Input
            label="Monto pagado total (referencia)"
            type="number"
            value={form.montoReferencia}
            onChange={(v) => update('montoReferencia', v)}
            className="md:col-span-2"
          />
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={
            enviando ||
            voucherMatricula.subiendo ||
            voucherMensualidad.subiendo
          }
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-60"
        >
          {enviando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  )
}

function VoucherInput({
  label,
  voucher,
  onSelect,
  onClear,
}: {
  label: string
  voucher: VoucherUpload
  onSelect: (file: File) => void
  onClear: () => void
}) {
  return (
    <label className="flex flex-col text-sm">
      <span className="text-gray-600 mb-1">{label}</span>
      {voucher.uploaded ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
          <svg
            className="w-4 h-4 text-green-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-xs text-green-800 truncate flex-1">
            {voucher.file?.name || 'Subido'}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-600 hover:underline shrink-0"
          >
            Quitar
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          disabled={voucher.subiendo}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onSelect(f)
          }}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-blue-800 disabled:opacity-60"
        />
      )}
      {voucher.subiendo && (
        <span className="text-xs text-blue-600 mt-1">Subiendo...</span>
      )}
      {voucher.error && (
        <span className="text-xs text-red-600 mt-1">{voucher.error}</span>
      )}
    </label>
  )
}

function Section({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        {titulo}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

interface InputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  maxLength?: number
  className?: string
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  className = '',
}: InputProps) {
  return (
    <label className={`flex flex-col text-sm ${className}`}>
      <span className="text-gray-600 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </label>
  )
}

interface SelectProps {
  label: string
  value: string | number
  onChange: (v: string) => void
  options: { value: string | number; label: string }[]
  className?: string
}

function Select({
  label,
  value,
  onChange,
  options,
  className = '',
}: SelectProps) {
  return (
    <label className={`flex flex-col text-sm ${className}`}>
      <span className="text-gray-600 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
