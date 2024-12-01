/**
 * Tiene como responsabilidad el manejo HTTP de los usuarios
 */

import { isValidUser, userWithRequiredParams } from "../lib/validations.js"
import { UserModel } from "../models/userModel.js"
import * as path from 'node:path'

export const userController = async (req, res, payloadEnBruto, urlParts) => {
  /**
   * GET /api/users/{id}
   */

  if(req.method == 'GET' && urlParts[2] && urlParts.length <= 3 ) {
    try {
      let usuario = await UserModel.getById(urlParts[2])

      if(usuario) {
        res.writeHead(200, 'OK', { "content-type": "application/json" })
        res.write(JSON.stringify(usuario))
        res.end()
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
        res.write('No encontramos al usuario')
        res.end()
      }
    } catch (err) {
      console.log("error usuario", err)
      res.writeHead(500, 'Internal Server Error', { "content-type": "text/plain" })
      res.write('Error del servidor')
      res.end()
    }
  }

  /**
   * POST /api/users + payload
   */
  else if (req.method == 'POST' && payloadEnBruto) {
    try {
      let user = JSON.parse(payloadEnBruto)
      if(!userWithRequiredParams(user)) throw new Error('Usuario Inválido');

      let fueCreado = await UserModel.create(user.telefono, user)
      if(fueCreado) {
        res.writeHead(201, 'Created', { "content-type": "text/plain" })
        res.end('Usuario Creado exitosamente')
      } else {
        /**
         * @TODO analizar posibles errores capturados
        */
        res.writeHead(409, 'Conflict', { "content-type": "text/plain" })
        res.end('Usuario ya existía')
      }
    } catch (err) {
      res.writeHead(400, 'Bad Request', { "content-type": "text/plain" })
      res.end('No se puede crear usuario')
    }
  }

  /**
   * DELETE /api/users/id
   */
  else if (req.method == 'DELETE' && urlParts[2]) {
    try {
      let userExists =  await UserModel.exists(urlParts[2])
      if(userExists) {
        await UserModel.delete(urlParts[2])
        res.writeHead(200, 'OK', { "content-type": "application/json" })
        res.end(JSON.stringify({ status: 'deleted' }))
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
        res.end('Usuario no encontrado')
      }
    } catch (err) {
      console.error("Error eliminando usuario", err)
      res.writeHead(500, 'Internal Server Error', { "content-type": "text/plain" })
      res.end('Error de servidor')
    }
  }

  /**
   * PUT /api/users/id  + payload
   */
  else if (req.method == 'PUT' && urlParts[2] && payloadEnBruto) {
    try {
      const payload = JSON.parse(payloadEnBruto)
      const user = await UserModel.getById(urlParts[2])
      if(user) {
        /**
         * Validamos Payload
         */
        if(isValidUser(payload)) {
          delete payload.telefono
          let payloadKeys = Object.keys(payload)
          if(payloadKeys.length === 0) throw new Error('Payload Inválido');
          let usuarioActualizado = { ...user, ...payload }

          try {
            await UserModel.update(urlParts[2], usuarioActualizado)

            res.writeHead(200, 'OK', { "content-type": "text/plain" })
            res.end("Usuario Actualizado")
          } catch (err) {
            res.writeHead(500, "Internal Server Error", { "content-type": "text/plain" })
            res.end("Error Interno de Servidor")
          }
        } else {
          throw new Error('Payload Inválido')
        }
      } else {
        res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
        res.end("Usuario no encontrado")
      }
    } catch (err) {
      console.error(err)
      res.writeHead(400, 'Bad Request', { "content-type": "text/plain" })
      res.end("Solicitud mal hecha")
    }
  }

  /**
   * GET /api/users -> listar todos los usuarios
   */
  else if(req.method == 'GET' && !urlParts[2]) {
    /**
     * Enlistar los usuarios de la carpeta .data/users
     */
    let users = await UserModel.getAll()

    if(users.length > 0) {
      res.writeHead(200, 'OK', { "content-type": "application/json" })
      res.end(JSON.stringify(users))
    }
  }
}
