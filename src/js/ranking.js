import { obtenerRanking, obtenerUsuarios } from './api.js';
import { formatearTiempo } from './utils.js';

function ordenar(partidas) {
  return [...partidas].sort((a, b) => b.cartas - a.cartas || a.tiempo - b.tiempo);
}

function seleccionarVisibles(ordenadas, idDestacado) {
  const todas = ordenadas.map((partida, i) => ({ partida, posicion: i + 1 }));
  if (todas.length <= 5) return todas;

  const indice = ordenadas.findIndex((p) => p.id === idDestacado);
  if (indice < 4) return [...todas.slice(0, 4), null];
  if (indice === 4) return [...todas.slice(0, 5), null];

  const destacada = todas[indice];
  const esUltima = indice === todas.length - 1;
  return esUltima
    ? [...todas.slice(0, 4), null, destacada]
    : [...todas.slice(0, 4), null, destacada, null];
}

function crearFila({ partida, posicion }, usuarios, idDestacado) {
  const usuario = usuarios[partida.userId] ?? {};
  const fila = document.createElement('tr');
  if (partida.id === idDestacado) fila.classList.add('highlight');

  const valores = [
    posicion,
    usuario.username ?? '-',
    usuario.email ?? '-',
    formatearTiempo(partida.tiempo),
    partida.cartas
  ];
  valores.forEach((valor) => {
    const celda = document.createElement('td');
    celda.textContent = valor;
    fila.appendChild(celda);
  });
  return fila;
}

function crearFilaPuntos() {
  const fila = document.createElement('tr');
  const celda = document.createElement('td');
  celda.colSpan = 5;
  celda.textContent = '...';
  fila.appendChild(celda);
  return fila;
}

export async function cargarRanking(idDestacado = null) {
  const cuerpo = document.getElementById('ranking-body');
  try {
    const [partidas, usuarios] = await Promise.all([obtenerRanking(), obtenerUsuarios()]);
    const visibles = seleccionarVisibles(ordenar(partidas), idDestacado);

    cuerpo.replaceChildren(
      ...visibles.map((item) => (item ? crearFila(item, usuarios, idDestacado) : crearFilaPuntos()))
    );
  } catch (error) {
    console.error(error);
  }
}