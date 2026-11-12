const DB_URL = 'https://bd-practica-js-default-rtdb.europe-west1.firebasedatabase.app';

export async function buscarUsuarioPorEmail(email) {
  const respuesta = await fetch(`${DB_URL}/users.json`);
  const usuarios = await respuesta.json();
  if (!usuarios) return null;

  const id = Object.keys(usuarios).find((clave) => usuarios[clave].email === email);
  return id ?? null;
}

export async function crearUsuario(username, email) {
  const respuesta = await fetch(`${DB_URL}/users.json`, {
    method: 'POST',
    body: JSON.stringify({ username, email })
  });
  const datos = await respuesta.json();
  return datos.name;
}

export async function actualizarUsername(id, username) {
  await fetch(`${DB_URL}/users/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ username })
  });
  return id;
}