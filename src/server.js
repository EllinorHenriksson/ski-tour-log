/**
 * The starting point of the application.
 *
 * @author Ellinor Henriksson
 * @version 1.0.0
 */

import { container } from './config/bootstrap.js'

import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import createError from 'http-errors'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'

try {
  await connectDB(container.resolve('ConnectionString'))

  const app = express()

  app.set('container', container)

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    if (!err.status) {
      const cause = err
      err = createError(500)
      err.cause = cause
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        cause: err.cause ? JSON.stringify(err.cause, Object.getOwnPropertyNames(err.cause)) : undefined,
        stack: err.stack
      })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
