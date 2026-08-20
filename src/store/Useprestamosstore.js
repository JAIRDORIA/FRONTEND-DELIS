import { create } from 'zustand'
import { listarPrestamos, crearPrestamo, abonarPrestamo, listarPagosPrestamo } from '../api/prestamos_api'

export const usePrestamosStore = create((set, get) => ({
  prestamos: [],
  loading: false,
  error: null,
  filtroEstado: '',

  setFiltroEstado: (estado) => {
    set({ filtroEstado: estado })
    get().fetchPrestamos()
  },

  fetchPrestamos: async () => {
    set({ loading: true, error: null })
    try {
      const { filtroEstado } = get()
      const res = await listarPrestamos(filtroEstado || undefined)
      set({ prestamos: res.data, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.mensaje || 'Error al cargar los prestamos',
        loading: false,
      })
    }
  },

  nuevoPrestamo: async (data) => {
    try {
      const res = await crearPrestamo(data)
      set((state) => ({ prestamos: [res.data.datos, ...state.prestamos] }))
      return { ok: true, datos: res.data.datos }
    } catch (err) {
      return { ok: false, mensaje: err.response?.data?.mensaje || 'Error al registrar el prestamo' }
    }
  },

  // data: { usuario_id, monto, medio_pago, observacion }
  abonar: async (prestamoId, data) => {
    try {
      const res = await abonarPrestamo(prestamoId, data)
      set((state) => ({
        prestamos: state.prestamos.map((p) => (p.id === prestamoId ? res.data.datos : p)),
      }))
      return { ok: true, datos: res.data.datos }
    } catch (err) {
      return { ok: false, mensaje: err.response?.data?.mensaje || 'Error al registrar el abono' }
    }
  },

  obtenerHistorialAbonos: async (prestamoId) => {
    try {
      const res = await listarPagosPrestamo(prestamoId)
      return { ok: true, datos: res.data }
    } catch (err) {
      return { ok: false, mensaje: err.response?.data?.mensaje || 'Error al cargar el historial' }
    }
  },
}))