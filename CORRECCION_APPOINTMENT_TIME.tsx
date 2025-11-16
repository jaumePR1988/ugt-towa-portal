// CORRECCIÓN PARA CitasPage.tsx
// Reemplaza la línea 155 en la función handleConfirmBooking

// ANTES (línea 155):
appointment_time: selectedSlot.start_time,

// DESPUÉS (línea 155):
appointment_time: new Date(selectedSlot.start_time).toTimeString().split(' ')[0],

// EXPLICACIÓN:
// - new Date(selectedSlot.start_time) convierte el string a objeto Date
// - .toTimeString() devuelve "08:00:00 GMT+0000 (Coordinated Universal Time)"
// - .split(' ')[0] extrae solo la primera parte: "08:00:00"

// ALTERNATIVA más robusta:
appointment_time: selectedSlot.start_time ? 
  selectedSlot.start_time.split('T')[1]?.split('+')[0]?.split('.')[0] : 
  null,

// O más simple para el formato actual:
appointment_time: selectedSlot.start_time.split(' ')[1]?.split('.')[0],

