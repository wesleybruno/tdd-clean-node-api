import { Express, Router } from 'express'
import fg from 'fast-glob'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.ts').map(async file => {
    const rout = (await import(`../../../${file}`)).default
    rout(router)
  })
}
