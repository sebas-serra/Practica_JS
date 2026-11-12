import { buscarUsuarioPorEmail, crearUsuario, actualizarUsername } from './api.js';

export function iniciarRegistro(alRegistrar) {
  const formulario = document.getElementById('user-form');

  formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

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