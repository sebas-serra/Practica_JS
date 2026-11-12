import { obtenerCartas, MAX_POKEMON } from './pokeapi.js';

let intervalo = null;
let segundos = 0;
let primeraCarta = null;
let bloqueado = false;
let parejasEncontradas = 0;
let totalParejas = 0;

function mostrarError(mensaje) {
  document.getElementById('modal-message').textContent = mensaje;
  document.getElementById('modal').showModal();
}

function esValido(valor) {
  const numero = Number(valor);
  return valor !== '' && Number.isInteger(numero) && numero > 0
    && numero % 2 === 0 && numero <= MAX_POKEMON * 2;
}

function formatearTiempo(total) {
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}

function detenerTemporizador() {
  clearInterval(intervalo);
}

function iniciarTemporizador() {
  detenerTemporizador();
  segundos = 0;
  const timer = document.getElementById('timer');
  timer.textContent = formatearTiempo(segundos);
  intervalo = setInterval(() => {
    segundos++;
    timer.textContent = formatearTiempo(segundos);
  }, 1000);
}

function girar(carta) {
  carta.classList.add('flipped');
  carta.style.backgroundImage = `url(${carta.dataset.imagen})`;
}

function ocultar(carta) {
  carta.classList.remove('flipped');
  carta.style.backgroundImage = '';
}

function pintarTablero(cartas) {
  const tablero = document.getElementById('game-board');
  tablero.innerHTML = '';
  cartas.forEach((carta) => {
    const elemento = document.createElement('div');
    elemento.classList.add('card');
    elemento.dataset.id = carta.id;
    elemento.dataset.imagen = carta.imagen;
    tablero.appendChild(elemento);
  });
}

function manejarClic(evento, alGanar) {
  const carta = evento.target.closest('.card');
  if (!carta || bloqueado || carta.classList.contains('flipped')) return;

  girar(carta);

  if (!primeraCarta) {
    primeraCarta = carta;
    return;
  }

  if (primeraCarta.dataset.id === carta.dataset.id) {
    primeraCarta.classList.add('matched');
    carta.classList.add('matched');
    primeraCarta = null;
    parejasEncontradas++;

    if (parejasEncontradas === totalParejas) {
      detenerTemporizador();
      alGanar(segundos, totalParejas * 2);
    }
  } else {
    bloqueado = true;
    const anterior = primeraCarta;
    primeraCarta = null;
    setTimeout(() => {
      ocultar(anterior);
      ocultar(carta);
      bloqueado = false;
    }, 800);
  }
}

async function empezarPartida(numeroCartas) {
  detenerTemporizador();
  primeraCarta = null;
  bloqueado = false;
  parejasEncontradas = 0;
  totalParejas = numeroCartas / 2;

  try {
    const cartas = await obtenerCartas(numeroCartas);
    pintarTablero(cartas);
    iniciarTemporizador();
    document.getElementById('play-btn').textContent = 'Volver a jugar';
  } catch (error) {
    mostrarError('No se pudieron cargar los pokémon. Inténtalo de nuevo.');
  }
}

export function iniciarJuego(alGanar) {
  const formulario = document.getElementById('game-form');
  const tablero = document.getElementById('game-board');

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = document.getElementById('cards-number').value.trim();

    if (!esValido(valor)) {
      mostrarError('Introduce un número entero, positivo y par de cartas.');
      return;
    }
    empezarPartida(Number(valor));
  });

  tablero.addEventListener('click', (evento) => manejarClic(evento, alGanar));
}