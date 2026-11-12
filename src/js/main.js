import { iniciarRegistro } from './register.js';
import { iniciarJuego } from './game.js';

function mostrarVista() {
  const hayUsuario = Boolean(sessionStorage.getItem('user'));
  document.getElementById('register-view').hidden = hayUsuario;
  document.getElementById('game').hidden = !hayUsuario;
}

function alGanar(segundos, numeroCartas) {
  console.log(`Partida ganada: ${segundos}s con ${numeroCartas} cartas`);
}

function iniciarLogout() {
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('user');
    location.reload();
  });
}

iniciarRegistro(mostrarVista);
iniciarJuego(alGanar);
iniciarLogout();
mostrarVista();