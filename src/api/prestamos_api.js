import api from './axios'

const BASE = '/prestamos'

export const listarPrestamos = (estado) => {
  const params = estado ? { estado } : {}
  return api.get(`${BASE}/`, { params })
}

export const crearPrestamo = (data) => api.post(`${BASE}/`, data)


export const listarPagosPrestamo = (prestamoId) =>
  api.get(`${BASE}/${prestamoId}/abonos`)

// medio_pago aquí es el medio con el que EL CLIENTE PAGA este abono,
// puede ser distinto entre abonos de un mismo préstamo.
export const abonarPrestamo = (prestamoId, data) =>
  api.post(`${BASE}/${prestamoId}/abonos`, data)