import { iniciarRegistro } from './register.js';

function mostrarVista() {
  const hayUsuario = sessionStorage.getItem('user');
  document.getElementById('register-view').hidden = Boolean(hayUsuario);
  document.getElementById('game').hidden = !hayUsuario;
}

iniciarRegistro(mostrarVista);
mostrarVista();