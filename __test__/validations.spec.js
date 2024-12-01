/**
 * Definir especificaciones de las validaciones
 */

import { animeWithRequiredParams, validarAnio } from "./lib/validations.js"; 

describe('Testing de validaciones de animes', () => {
  test('Retorna false si el objeto no contiene todos los parámetros requeridos', () => {
    const animeInvalido = {
      "nombre": "Naruto",
      "genero": "Shonen",
      "año": "2002"
    };

    expect(animeWithRequiredParams(animeInvalido)).toBe(false);
  });

  test('Retorna false si el año no tiene sólo números o no es válido', () => {
    const animeValido = {
      "nombre": "Neon Genesis Evangelion",
      "genero": "Mecha",
      "año": "1995",
      "autor": "Yoshiyuki Sadamoto"
    };

    const animeInvalido = {
      "nombre": "Naruto",
      "genero": "Shonen",
      "año": "a34p",
      "autor": "Masashi Kishimoto"
    };

    expect(validarAnio(animeValido.año)).toBe(true);
    expect(validarAnio(animeInvalido.año)).toBe(false);
  });

  test('Retorna true si el anime contiene todos los datos requeridos correctamente', () => {
    const animeValido = {
      "nombre": "Neon Genesis Evangelion",
      "genero": "Mecha",
      "año": "1995",
      "autor": "Yoshiyuki Sadamoto"
    };

    expect(animeWithRequiredParams(animeValido)).toBe(true);
  });

  test('Retorna false si el anime no contiene todos los datos requeridos', () => {
    const animeInvalido = {
      "nombre": "Neon Genesis Evangelion",
      "año": "1995",
      "autor": "Yoshiyuki Sadamoto"
    };

    expect(animeWithRequiredParams(animeInvalido)).toBe(false);
  });

  test('Valida correctamente los rangos y formato del año', () => {
    const animeValido = {
      "nombre": "Neon Genesis Evangelion",
      "genero": "Mecha",
      "año": "1995",
      "autor": "Yoshiyuki Sadamoto"
    };

    const animeAñoFuturo = {
      "nombre": "Neon Genesis Evangelion",
      "genero": "Mecha",
      "año": "2026",
      "autor": "Yoshiyuki Sadamoto"
    };

    const animeAñoInvalido = {
      "nombre": "Neon Genesis Evangelion",
      "genero": "Mecha",
      "año": "1995128889",
      "autor": "Yoshiyuki Sadamoto"
    };

    expect(validarAnio(animeValido.año)).toBe(true); // Año correcto
    expect(validarAnio(animeAñoFuturo.año)).toBe(false); // Año mayor al actual
    expect(validarAnio(animeAñoInvalido.año)).toBe(false); // Año con formato inválido
  });
});
