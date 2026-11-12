const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';
const MAX_POKEMON = 151; 

function generarIdsAleatorios(cantidad) {
  const ids = new Set();
  while (ids.size < cantidad) {
    ids.add(Math.floor(Math.random() * MAX_POKEMON) + 1);
  }
  return [...ids];
}


async function obtenerPokemon(id) {
  const respuesta = await fetch(`${POKEAPI_URL}/${id}`);
  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el pokémon ${id}`);
  }
  const datos = await respuesta.json();
  const imagen = datos.sprites.other['official-artwork'].front_default
    ?? datos.sprites.front_default;
  return { id: datos.id, imagen };
}


function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}


export async function obtenerCartas(numeroCartas) {
  const ids = generarIdsAleatorios(numeroCartas / 2);
  const pokemons = await Promise.all(ids.map(obtenerPokemon));
  return barajar([...pokemons, ...pokemons]);
}