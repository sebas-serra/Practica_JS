import { iniciarRegistro } from './register.js';
import { iniciarJuego } from './game.js';
import { guardarPartida } from './api.js';
import { cargarRanking } from './ranking.js';

function mostrarVista() {
  const hayUsuario = Boolean(sessionStorage.getItem('user'));
  document.getElementById('register-view').hidden = hayUsuario;
  document.getElementById('game').hidden = !hayUsuario;
  if (hayUsuario) cargarRanking();
}

async function alGanar(segundos, numeroCartas, errores) {
  try {
    const id = await guardarPartida(sessionStorage.getItem('user'), segundos, numeroCartas, errores);
    await cargarRanking(id);
  } catch (error) {
    console.error(error);
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('user');
  location.reload();
});

iniciarRegistro(mostrarVista);
iniciarJuego(alGanar);
mostrarVista();