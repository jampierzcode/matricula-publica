import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4336/api'

const api = axios.create({ baseURL })

export default api

export interface Ciclo {
  id: number
  nombre: string
  fechaInicio: string
  fechaFin: string
  status: boolean
  montoMatriculaPresencial: number
  montoMensualidadPresencial: number
  montoMatriculaVirtual: number
  montoMensualidadVirtual: number
}

export interface Sede {
  id: number
  name_referential: string
  direction?: string
  district?: string
  province?: string
  department?: string
  googleMapsUrl?: string | null
}

export interface Turno {
  id: number
  nombre: string
  horaInicio: string
  horaFin: string
  activo: boolean
  orden: number
}

export interface ConfiguracionPublica {
  nombreEmpresa: string
  logoUrl: string | null
  mision: string | null
  vision: string | null
  emailContacto: string | null
  whatsappContacto: string | null
  telefonoFijo: string | null
  direccionPrincipal: string | null
  estadosCuenta: string | null
}

export interface Carrera {
  id: number
  nombre: string
  canalId: number | null
  canal?: { id: number; nombre: string; area?: string | null } | null
}

export interface SolicitudPayload {
  nombre: string
  apellido?: string
  dni?: string
  email?: string
  whatsapp: string
  cicloId: number
  modalidad: 'presencial' | 'virtual'
  turnoId: number
  sedeId?: number
  carreraId?: number
  canalId?: number
  comprobanteMatriculaUrl?: string
  comprobanteMatriculaKey?: string
  comprobanteMensualidadUrl?: string
  comprobanteMensualidadKey?: string
  montoReferencia?: number
}

export interface MiMatriculaData {
  estudiante: { nombre: string; apellido: string }
  ciclo: string | null
  modalidad: string
  turno: string | null
  canal: { nombre: string; area: string | null } | null
  carrera: string | null
  horario: Array<{
    dia: string
    horaInicio: string
    horaFin: string
    curso: string | null
    profesor: string | null
    aula: string | null
    codigoAula: string | null
  }>
  cronograma: Array<{
    tipo: string
    numeroCuota: number
    montoEsperado: number
    montoPagado: number
    fechaVencimiento: string | null
    estado: string
  }>
}

export interface UploadResponse {
  status: string
  data: {
    key: string
    url: string
    filename: string
    size: number
    contentType: string
  }
}

export interface SolicitudResponse {
  status: 'success' | 'error'
  message: string
  data?: { id: number; numeroSeguimiento: string }
}
