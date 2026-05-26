interface Props {
  numeroSeguimiento: string
  whatsappAcademia?: string | null
  onNueva: () => void
}

export default function Confirmacion({
  numeroSeguimiento,
  whatsappAcademia,
  onNueva,
}: Props) {
  const waNumero = (whatsappAcademia || '').replace(/\D/g, '')
  const waLink = waNumero
    ? `https://wa.me/${waNumero}?text=${encodeURIComponent(
        `Hola, acabo de enviar mi solicitud de matrícula (${numeroSeguimiento}). Quiero confirmar mi inscripción.`
      )}`
    : null
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
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition mb-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.99-1.297z" />
          </svg>
          Confírmalo por WhatsApp
        </a>
      )}
      {waLink && (
        <p className="text-xs text-gray-500 mb-4">
          Escríbenos para confirmar más rápido y recibir novedades por WhatsApp.
        </p>
      )}
      <button
        onClick={onNueva}
        className="text-primary hover:underline font-medium"
      >
        Enviar otra solicitud
      </button>
    </div>
  )
}
