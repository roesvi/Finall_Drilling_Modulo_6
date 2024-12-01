/**
 * Analizar url de la solicitud y dirigirla al controlador correspondiente
 */

import { animesController } from "./controllers/animesController.js";

export const router = (req, res) => {
  const url = req.url;
  const urlParts = url.split('/').filter(part => !!part);     //.map(part => part.split('?')[0]);

  let payloadBruto = '';// @todo generar payload desde evento data

  req.on('data', chunk => {
    payloadBruto += chunk;
  })

  req.on('end', () => {
    /**
     * /public
     */
    console.log(req.method, req.url);
    if (urlParts[0] != 'api') {
      publicController(req, res, urlParts);
    }
    //Realizar un test para poder probar la respuesta del servidor que fue creado.
    else if (urlParts[0] == 'api' && urlParts[1] == 'test') {
      res.writeHead(200, 'OK', { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Servidor funcionando correctamente, cualquier similitud con trabajos hechos en clase es sólo coincidencia" }));
    }
    /**
   * Ruta Animes
   * localhost:3000/api/animes
   */
    else if (urlParts[0] == 'api' && urlParts[1] == 'animes') {
      animesController(req, res, payloadBruto, urlParts);
    }
    
    /**
     * 404 not found
     */
    else {
      res.writeHead(404, 'Not Found', { "content-type": "text/plain" });
      res.end('Ruta No encontrada');
    }
  });
};