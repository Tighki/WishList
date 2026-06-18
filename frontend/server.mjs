import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

const port = Number(process.env.PORT ?? 80)
const distDir = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function sendFile(response, filePath) {
  const ext = extname(filePath)
  response.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' })
  createReadStream(filePath).pipe(response)
}

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://${request.headers.host}`).pathname)
  const safePath = pathname.replace(/^\/+/, '')
  const filePath = join(distDir, safePath)

  if (safePath && existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(response, filePath)
    return
  }

  const indexPath = join(distDir, 'index.html')
  if (existsSync(indexPath)) {
    sendFile(response, indexPath)
    return
  }

  response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
  response.end('dist/index.html not found')
}).listen(port, '0.0.0.0', () => {
  console.log(`WishList frontend listening on http://0.0.0.0:${port}`)
})
