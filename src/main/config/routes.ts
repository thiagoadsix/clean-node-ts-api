import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(`${__dirname}/../routes`).map(async file => {
    const testFile = file.includes('.test.')
    if (!testFile) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
