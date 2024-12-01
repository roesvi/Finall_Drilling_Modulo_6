/**
 * Validaciones
 */

/**
 * Valida que el objeto anime tenga la estructura mínima requerida.
 * 
 * @param {object} animeObject - Objeto anime a validar.
 * @return {boolean} - Retorna true si el objeto tiene todas las propiedades requeridas y no están vacías, de lo contrario false.
 */
export const animeWithRequiredParams = (animeObject) => {
  const llavesMinimasValidas = ['nombre', 'genero', 'año', 'autor'];
  const llavesObjeto = Object.keys(animeObject);

  // Validar que tenga todas las llaves mínimas y que no estén vacías
  return llavesMinimasValidas.every(
    llave => llavesObjeto.includes(llave) && typeof animeObject[llave] === 'string' && animeObject[llave].trim() !== ''
  );
};

/**
 * Valida si el año es correcto.
 * 
 * @param {string} año - Año a validar.
 * @return {boolean} - Retorna true si el año es un número de 4 dígitos válido entre 1900 y el año actual, de lo contrario false.
 */
export const validarAnio = (año) => {
  const currentYear = new Date().getFullYear();
  // Validación: debe ser un número de 4 dígitos y estar entre 1900 y el año actual
  return /^\d{4}$/.test(año) && Number(año) >= 1900 && Number(año) <= currentYear;
};

/**
 * Valida que un objeto anime sea válido y devuelve las llaves no usadas.
 * 
 * @param {object} animeObject - Objeto anime a validar.
 * @return {{ animeValido: boolean, llavesExtra: string[] }} 
 * - animeValido: true si el objeto tiene la estructura válida y el año es correcto, false en caso contrario.
 * - llavesExtra: Array con las llaves adicionales que no son necesarias.
 */
export const isValidAnime = (animeObject) => {
  const llavesAnime = ['nombre', 'genero', 'año', 'autor'];
  const llavesObjeto = Object.keys(animeObject);

  // Identificar llaves adicionales que no son necesarias
  const llavesExtra = llavesObjeto.filter(llave => !llavesAnime.includes(llave));

  // Validar si el objeto tiene la estructura mínima requerida
  const estructuraValida = animeWithRequiredParams(animeObject);

  // Validar si el año cumple los criterios
  const añoValido = validarAnio(animeObject.año);

  return {
    animeValido: estructuraValida && añoValido,
    llavesExtra
  };
};
