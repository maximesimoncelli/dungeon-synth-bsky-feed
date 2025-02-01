import FeedGenerator from './server'
import { getFeedGeneratorConfig } from './config'


const run = async () => {
  const server = FeedGenerator.create(getFeedGeneratorConfig())
  await server.start()
  console.log(
    `🤖 running feed generator at http://${server.cfg.listenHost}:${server.cfg.port}`,
  )
}

run()
