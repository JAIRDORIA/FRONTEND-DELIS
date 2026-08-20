import { useState } from 'react'
import { usePrestamosStore } from '../store/Useprestamosstore'

export default function AbonarPrestamoModal({ prestamo, onClose, onSuccess }) {
  const { abonar } = usePrestamosStore()
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  const [monto, setMonto] = useState(String(prestamo.saldo_pendiente))
  const [medioPago, setMedioPago] = useState('efectivo')
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  if (!prestamo) return null

  const montoNum = parseFloat(monto)

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setError('')

    if (!montoNum || montoNum <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }
    if (montoNum > prestamo.saldo_pendiente) {
      setError(`El abono no puede superar el saldo pendiente ($${prestamo.saldo_pendiente.toLocaleString('es-CO')})`)
      return
    }
    if (!usuario?.id) {
      setError('No se pudo identificar el usuario actual')
      return
    }

    setGuardando(true)
    const resultado = await abonar(prestamo.id, {
      usuario_id: usuario.id,
      monto: montoNum,
      medio_pago: medioPago,
      observacion: observacion || null,
    })
    setGuardando(false)

    if (!resultado.ok) {
      setError(resultado.mensaje)
      return
    }
    onSuccess?.()
    onClose()
  }

  const esPagoTotal = montoNum === prestamo.saldo_pendiente

  return (
    <div  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div style={{padding:"24px"}} className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 style={{marginBottom:"8px"}} className="text-lg font-semibold mb-2">Abonar a préstamo</h2>
        <p style={{marginBottom:"32px"}} className="text-sm text-gray-900 mb-4">
          {prestamo.cliente_nombre}
          <br />
          <span className="text-xs text-red-800">
            Saldo pendiente: ${prestamo.saldo_pendiente.toLocaleString('es-CO')} de ${prestamo.monto.toLocaleString('es-CO')}
          </span>
        </p>

        <form onSubmit={handleConfirmar} className="space-y-3">
          <div>
            <div style={{marginBottom:"4px"}} className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Monto a abonar</label>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setMonto(String(prestamo.saldo_pendiente))}
              >
                Pagar todo
              </button>
            </div>
            <input
              type="number"
              min="1"
              max={prestamo.saldo_pendiente}
              step="1"
              style={{padding:"4px 12px"}}
              className="w-full border rounded px-3 py-2 text-sm"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>

          <div>
            <label style={{marginBottom:"4px"}} className="block text-sm font-medium mb-1">Medio de pago</label>
            <select
            style={{padding:"8px 12px"}}
              className="w-full border rounded px-3 py-2 text-sm"
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <div>
            <label style={{marginBottom:"4px"}} className="block text-sm font-medium mb-1">Observación (opcional)</label>
            <input

              type="text"
              style={{padding:"8px 12px"}}
              className="w-full border rounded px-3 py-2 text-sm"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div style={{paddingTop:"8px"}} className="flex justify-end gap-2 pt-2">
            <button style={{padding:"8px 16px"}} type="button" className="px-4 py-2 text-sm rounded border" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              style={{padding:"8px 16px"}}
              className={`px-4 py-2 text-sm rounded text-white disabled:opacity-50 ${esPagoTotal ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {guardando ? 'Guardando...' : esPagoTotal ? 'Confirmar pago total' : 'Confirmar abono'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}