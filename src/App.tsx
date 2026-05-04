import { useState } from 'react'
import MatriculaForm from './components/MatriculaForm'
import Confirmacion from './components/Confirmacion'

export default function App() {
  const [numeroSeguimiento, setNumeroSeguimiento] = useState<string | null>(
    null
  )

  return (
    <div className="min-h-screen py-12 px-4">
      <header className="max-w-3xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-1">
          Academia Élite
        </h1>
        <p className="text-gray-600">Matrícula online</p>
      </header>

      {numeroSeguimiento ? (
        <Confirmacion
          numeroSeguimiento={numeroSeguimiento}
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
