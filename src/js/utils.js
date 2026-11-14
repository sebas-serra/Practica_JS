export function formatearTiempo(total) {
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}