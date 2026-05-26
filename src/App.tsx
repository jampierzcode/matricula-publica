import { useEffect, useState } from 'react'
import api from './api'
import MatriculaForm from './components/MatriculaForm'
import Confirmacion from './components/Confirmacion'
import MiMatricula from './components/MiMatricula'

export default function App() {
  const [numeroSeguimiento, setNumeroSeguimiento] = useState<string | null>(null)
  const [whatsappAcademia, setWhatsappAcademia] = useState<string | null>(null)

  // Ruteo simple por path (sin librería de router).
  const path = window.location.pathname
  const matchMatricula = path.match(/\/mi-matricula\/(.+)$/)

  useEffect(() => {
    api
      .get('/public/configuracion')
      .then((r) => setWhatsappAcademia(r.data?.data?.whatsappContacto || null))
      .catch(() => {})
  }, [])

  if (matchMatricula) {
    return (
      <div className="min-h-screen py-12 px-4">
        <header className="max-w-3xl mx-auto mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary mb-1">Academia Élite</h1>
          <p className="text-gray-600">Mi matrícula</p>
        </header>
        <MiMatricula token={decodeURIComponent(matchMatricula[1])} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <header className="max-w-3xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-1">Academia Élite</h1>
        <p className="text-gray-600">Matrícula online</p>
      </header>

      {numeroSeguimiento ? (
        <Confirmacion
          numeroSeguimiento={numeroSeguimiento}
          whatsappAcademia={whatsappAcademia}
          onNueva={() => setNumeroSeguimiento(null)}
        />
      ) : (
        <MatriculaForm onSuccess={setNumeroSeguimiento} />
      )}

      <footer className="mt-12 text-center text-xs text-gray-400">
        © Academia Élite — Sistema de matrícula
      </footer>
    </div>
  )
}
