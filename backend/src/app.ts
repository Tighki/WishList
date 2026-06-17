import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { errorHandler } from './middleware/error-handler.js'
import { itemsRouter } from './routes/items.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

export function createApp() {
  const app = express()
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    app.use(cors({ origin: true }))
  }

  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'wishlist-backend' })
  })

  app.use('/api/items', itemsRouter)

  if (isProduction && fs.existsSync(publicDir)) {
    app.use(express.static(publicDir))

    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'))
    })
  }

  app.use(errorHandler)

  return app
}
