const DB_URL = 'https://bd-practica-js-default-rtdb.europe-west1.firebasedatabase.app';

// Única función que habla con Firebase; el resto solo elige ruta, método y datos
async function llamar(ruta, metodo = 'GET', cuerpo) {
  const respuesta = await fetch(`${DB_URL}/${ruta}.json`, {
    method: metodo,
    body: cuerpo && JSON.stringify(cuerpo)
  });
  if (!respuesta.ok) throw new Error(`Error en Firebase (${ruta})`);
  return respuesta.json();
}

export async function obtenerUsuarios() {
  return (await llamar('users')) ?? {};
}

export async function buscarUsuarioPorEmail(email) {
  const usuarios = await obtenerUsuarios();
  return Object.keys(usuarios).find((id) => usuarios[id].email === email) ?? null;
}

export async function crearUsuario(username, email) {
  const datos = await llamar('users', 'POST', {
    username,
    email,
    fechaRegistro: new Date().toISOString()
  });
  return datos.name;
}

export async function actualizarUsername(id, username) {
  await llamar(`users/${id}`, 'PATCH', {
    username,
    fechaActualizacion: new Date().toISOString()
  });
  return id;
}

export async function guardarPartida(userId, tiempo, cartas, errores) {
  const datos = await llamar('ranking', 'POST', { userId, tiempo, cartas, errores });
  return datos.name;
}

export async function obtenerRanking() {
  const datos = (await llamar('ranking')) ?? {};
  return Object.entries(datos).map(([id, partida]) => ({ id, ...partida }));
}