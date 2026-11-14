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

    body: JSON.stringify({ username, 
      email, 
      fechaRegistro: new Date().toISOString() })
  });
  const datos = await respuesta.json();
  return datos.name;
}

export async function actualizarUsername(id, username) {
  await fetch(`${DB_URL}/users/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      username,
      fechaActualizacion: new Date().toISOString()
     })
  });
  return id;
}

export async function guardarPartida(userId, tiempo, cartas) {
  const respuesta = await fetch(`${DB_URL}/ranking.json`, {
    method: 'POST',
    body: JSON.stringify({ userId, tiempo, cartas })
  });
  if (!respuesta.ok) throw new Error('Error al guardar la partida');
  const datos = await respuesta.json();
  return datos.name; // id de la partida recién creada
}

export async function obtenerRanking() {
  const respuesta = await fetch(`${DB_URL}/ranking.json`);
  if (!respuesta.ok) throw new Error('Error al leer el ranking');
  const datos = await respuesta.json();
  if (!datos) return [];
  return Object.entries(datos).map(([id, partida]) => ({ id, ...partida }));
}

export async function obtenerUsuarios() {
  const respuesta = await fetch(`${DB_URL}/users.json`);
  if (!respuesta.ok) throw new Error('Error al leer los usuarios');
  return (await respuesta.json()) ?? {};
}