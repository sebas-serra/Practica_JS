import { buscarUsuarioPorEmail, crearUsuario, actualizarUsername } from './api.js';

export function iniciarRegistro(alRegistrar) {
  document.getElementById('user-form').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();

    const idExistente = await buscarUsuarioPorEmail(email);
    const id = idExistente
      ? await actualizarUsername(idExistente, username)
      : await crearUsuario(username, email);

    sessionStorage.setItem('user', id);
    alRegistrar();
  });
}