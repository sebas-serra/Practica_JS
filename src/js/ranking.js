import { obtenerRanking, obtenerUsuarios } from './api.js';
import { formatearTiempo } from './utils.js';

// Prioridad: más cartas, menos tiempo, menos errores
function ordenar(partidas) {
  return [...partidas].sort((a, b) =>
    b.cartas - a.cartas
    || a.tiempo - b.tiempo
    || (a.errores ?? 0) - (b.errores ?? 0)
  );
}

// Elige qué filas mostrar; null representa una fila de "..."
function seleccionarVisibles(filas, indice) {
  if (filas.length <= 5) return filas;
  if (indice <= 4) return [...filas.slice(0, indice === 4 ? 5 : 4), null];

  const esUltima = indice === filas.length - 1;
  return [...filas.slice(0, 4), null, filas[indice], ...(esUltima ? [] : [null])];
}

function crearFila({ partida, posicion }, usuarios, idDestacado) {
  const { username = '-', email = '-' } = usuarios[partida.userId] ?? {};
  const fila = document.createElement('tr');
  if (partida.id === idDestacado) fila.classList.add('highlight');

  [posicion, username, email, formatearTiempo(partida.tiempo), partida.cartas]
    .forEach((valor) => { fila.insertCell().textContent = valor; });
  return fila;
}

function crearFilaPuntos() {
  const celda = document.createElement('tr').insertCell();
  celda.colSpan = 5;
  celda.textContent = '...';
  return celda.parentElement;
}

export async function cargarRanking(idDestacado = null) {
  try {
    const [partidas, usuarios] = await Promise.all([obtenerRanking(), obtenerUsuarios()]);
    const filas = ordenar(partidas).map((partida, i) => ({ partida, posicion: i + 1 }));
    const indice = filas.findIndex(({ partida }) => partida.id === idDestacado);

    document.getElementById('ranking-body').replaceChildren(
      ...seleccionarVisibles(filas, indice)
        .map((fila) => (fila ? crearFila(fila, usuarios, idDestacado) : crearFilaPuntos()))
    );
  } catch (error) {
    console.error(error);
  }
}