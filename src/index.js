import OggReader from './ogg-reader'

logger.setMode(true)

fetch('./small.ogv')
  .then(response => {
    return response.arrayBuffer()
  })
  .then(buffer => {
    window.reader = OggReader.create({ buffer })
  })
  .catch(console.log.bind(console))