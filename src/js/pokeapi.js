const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';
export const MAX_POKEMON = 151;

const barajar = (lista) => [...lista].sort(() => Math.random() - 0.5);

async function obtenerPokemon(id) {
  const respuesta = await fetch(`${POKEAPI_URL}/${id}`);
  if (!respuesta.ok) throw new Error(`No se pudo obtener el pokémon ${id}`);
  const { sprites } = await respuesta.json();
  return { id, imagen: sprites.other['official-artwork'].front_default ?? sprites.front_default };
}

export async function obtenerCartas(numeroCartas) {
  const todosLosIds = Array.from({ length: MAX_POKEMON }, (_, i) => i + 1);
  const ids = barajar(todosLosIds).slice(0, numeroCartas / 2);
  const pokemons = await Promise.all(ids.map(obtenerPokemon));
  return barajar([...pokemons, ...pokemons]);
}