import { obtenerCartas, MAX_POKEMON } from './pokeapi.js';
import { formatearTiempo } from './utils.js';

let intervalo = null;
let segundos = 0;
let primeraCarta = null;
let bloqueado = false;
let errores = 0;

function mostrarError(mensaje) {
  document.getElementById('modal-message').textContent = mensaje;
  document.getElementById('modal').showModal();
}

function esValido(valor) {
  const numero = Number(valor);
  return valor !== '' && Number.isInteger(numero) && numero > 0
    && numero % 2 === 0 && numero <= MAX_POKEMON * 2;
}

function detenerTemporizador() {
  clearInterval(intervalo);
}

function iniciarTemporizador() {
  detenerTemporizador();
  segundos = 0;
  const timer = document.getElementById('timer');
  timer.textContent = formatearTiempo(0);
  intervalo = setInterval(() => {
    timer.textContent = formatearTiempo(++segundos);
  }, 1000);
}

// Muestra u oculta la imagen de una carta
function mostrar(carta, visible) {
  carta.classList.toggle('flipped', visible);
  carta.style.backgroundImage = visible ? `url(${carta.dataset.imagen})` : '';
}

function pintarTablero(cartas) {
  const elementos = cartas.map(({ id, imagen }) => {
    const carta = document.createElement('div');
    carta.className = 'card';
    carta.dataset.id = id;
    carta.dataset.imagen = imagen;
    return carta;
  });
  document.getElementById('game-board').replaceChildren(...elementos);
}

function manejarClic(evento, alGanar) {
  const carta = evento.target.closest('.card');
  if (!carta || bloqueado || carta.classList.contains('flipped')) return;

  mostrar(carta, true);
  if (!primeraCarta) {
    primeraCarta = carta;
    return;
  }

  const anterior = primeraCarta;
  primeraCarta = null;

  if (anterior.dataset.id === carta.dataset.id) {
    anterior.classList.add('matched');
    carta.classList.add('matched');
    // Si ya no quedan cartas sin emparejar, se ha ganado
    if (!document.querySelector('.card:not(.matched)')) {
      detenerTemporizador();
      alGanar(segundos, document.querySelectorAll('.card').length, errores);
    }
    return;
  }

  errores++;
  bloqueado = true;
  setTimeout(() => {
    mostrar(anterior, false);
    mostrar(carta, false);
    bloqueado = false;
  }, 800);
}

async function empezarPartida(numeroCartas) {
  detenerTemporizador();
  primeraCarta = null;
  bloqueado = false;
  errores = 0;

  try {
    pintarTablero(await obtenerCartas(numeroCartas));
    iniciarTemporizador();
    document.getElementById('play-btn').textContent = 'Volver a jugar';
  } catch {
    mostrarError('No se pudieron cargar los pokémon. Inténtalo de nuevo.');
  }
}

export function iniciarJuego(alGanar) {
  document.getElementById('game-form').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = document.getElementById('cards-number').value.trim();

    if (esValido(valor)) {
      empezarPartida(Number(valor));
    } else {
      mostrarError('Introduce un número entero, positivo y par de cartas.');
    }
  });

  document.getElementById('game-board').addEventListener('click', (evento) => manejarClic(evento, alGanar));
}