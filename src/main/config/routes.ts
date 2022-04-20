import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(`${String(__dirname)}/../routes`).map(async (file) => {
    const fileMap = file.endsWith('.map')
    const testFile = file.includes('.test.')

    if (!fileMap && !testFile) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
