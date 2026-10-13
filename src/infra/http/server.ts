import { env } from '@shared/env.ts'
import { app } from './app.ts'

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`)
})
