/**
 * Controlador del recurso Animes
 */

import { AnimesModel } from "../models/animesModel.js"
import * as crypto from 'node:crypto'
import * as url from "node:url"

export const animesController = async (req, res, payloadBruto, urlparts) => {
  let queryObject = url.parse(req.url, true).query;
  try {

    /**
     * Listar todos las series de animes
     * /api/animes /....
     *    * Mostrar serie anime por nombre, ejemplo : /api/animes?nombre=akira
     */
    if (req.method === "GET" && urlparts[0] === "api" && urlparts[1] === "animes" && !urlparts[2]) {
      const series = await AnimesModel.getAll();

      if (queryObject.nombre?.trim()) {
        const filteredSeries = Object.values(series).filter((serie) =>
          serie.nombre?.toLowerCase().includes(queryObject.nombre.toLowerCase())
        );

        res.writeHead(200, "OK", { "content-type": "application/json" });
        return res.end(JSON.stringify(filteredSeries));
      }

      res.writeHead(200, "OK", { "content-type": "application/json" });
      return res.end(JSON.stringify(series));
    }

    /**
     * Mostrar serie anime por ID
     * /api/animes/:id
     */
    if (req.method === "GET" && urlparts[2]) {
      const serie = await AnimesModel.getById(urlparts[2]);

      if (serie) {
        res.writeHead(200, "OK", { "content-type": "application/json" });
        return res.end(JSON.stringify(serie));
      } else {
        res.writeHead(404, "Not Found", { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Serie anime no encontrada" }));
      }
    }

    /**
     * Crear un nuevo serie anime
     * /api/animes
     */
    if (req.method == 'POST' && !urlparts[2]) {
      let data = JSON.parse(payloadBruto)
      let id = crypto.randomUUID()

      let series = await AnimesModel.getAll() // 1
      series[id] = { id, ...data };

      let status = await AnimesModel.createAndUpdateSerie(series)
      if (status) {
        res.writeHead(201, 'Created', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'Serie anime Creada' }))
      } else {
        throw new Error('Error interno al crear la serie anime');
      }
    }
    /**
     * Actualizar Serie animes
     * 
     * PUT /api/animes/:id
     * payload
     */
    if (req.method == 'PUT' && urlparts[2]) {
      let series = await AnimesModel.getAll()
      let serie = await AnimesModel.getById(urlparts[2])

      if (serie) {
        let payload = JSON.parse(payloadBruto)
        //serie = { ...serie, ...payload } // serie (singular) actualizada
        series[urlparts[2]] = { ...serie, ...payload }; // Actualizamos todos las series de anime

        await AnimesModel.createAndUpdateSerie(series)

        res.writeHead(200, 'OK', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'anime actualizado', serie }))
      } else {
        res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'Payload mal formado' }))
      }
    }

    /**
     * Borrar series
     * DELETE /api/series/:id
     */
    if (req.method == 'DELETE' && urlparts[2]) {
      let series = await AnimesModel.getAll()

      if (series[urlparts[2]]) {
        delete series[urlparts[2]];
        await AnimesModel.createAndUpdateSerie(series);

        res.writeHead(200, 'OK', { "content-type": "application/json" })
        return res.end((JSON.stringify({ message: "Serie anime eliminada con éxito" })))
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: 'Serie anime no encontrada' }));
      }
    }

    // Ruta no encontrada
    res.writeHead(404, 'Not Found', { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
  } catch (err) {
    res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: err.message }));
  }
};

