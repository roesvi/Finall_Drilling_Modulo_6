/**
 * Grabamos o leemos datos relativos a Los Animes
 */

import {
  createFile,
  deleteFile,
  updateFile,
  readFile,
  fileExists,
  listAll,
} from "../lib/data.js";

export class AnimesModel {
  static folder = '.data/'
  static fileName = 'anime.json'

  static async getAll() {
    let series = await readFile(AnimesModel.folder, AnimesModel.fileName)

    return series
  }

  static async getById(id) {
    let series = await AnimesModel.getAll()

    return series[id]
  }

  static async createAndUpdateSerie(series) {
    try {
      await updateFile(AnimesModel.folder, AnimesModel.fileName, series)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}