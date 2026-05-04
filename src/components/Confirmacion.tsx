interface Props {
  numeroSeguimiento: string
  onNueva: () => void
}

export default function Confirmacion({ numeroSeguimiento, onNueva }: Props) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
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
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Solicitud enviada
      </h1>
      <p className="text-gray-600 mb-4">
        Hemos recibido tu solicitud. Nuestro equipo se contactará contigo por
        WhatsApp en las próximas horas para confirmar tu matrícula.
      </p>
      <div className="bg-gray-50 rounded p-4 mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Número de seguimiento
        </p>
        <p className="text-2xl font-mono font-bold text-primary">
          {numeroSeguimiento}
        </p>
      </div>
      <button
        onClick={onNueva}
        className="text-primary hover:underline font-medium"
      >
        Enviar otra solicitud
      </button>
    </div>
  )
}
