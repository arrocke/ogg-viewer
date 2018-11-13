import BufferReader from './buffer-reader'

/**
 * Sequentially reads pages from an Ogg buffer.
 */
export default class PageReader {
  /**
   * Creates a new PageReader from an ArrayBuffer.
   * @param {ArrayBuffer} options.buffer The ArrayBuffer to read.
   */
  static create({ buffer } = {}) {
    const reader = new PageReader()
    reader._buffer = buffer
    reader._reader = BufferReader.create({ buffer, littleEndian: true })
    return reader
  }

  /**
   * Reads an Ogg page from the buffer.
   */
  readPage() {
    this._readCapturePattern()
    this._readVersionNumber()
    const flags = this._readHeaderFlags()
    const granulePosition = this._readGranulePosition()
    const streamSerialNumber = this._readStreamSerialNumber()
    const pageNumber = this._readPageNumber()
    const checksum = this._readChecksum()
    const { segmentTable, payloadLength } = this._readSegmentTable()
    const payload = this._readPayload(payloadLength)

    return {
      ...flags,
      granulePosition,
      streamSerialNumber,
      pageNumber,
      checksum,
      segmentTable,
      payload
    }
  }

  /**
   * Reads the capture pattern.
   * @throws If the capture pattern is not found.
   */
  _readCapturePattern () {
    if (this._reader.readInt(4) != 0x5367674f)
      throw new Error('Capture pattern 0x4f676753 not found.')
  }

  /**
   * Reads the Ogg version number.
   * @throws If the version number is not supported.
   */
  _readVersionNumber () {
    if (this._reader.readInt() != 0)
      throw new Error('Version number must be 0.')
  }

  /**
   * Reads the continued packet, beginning of stream, and end of stream header flags.
   */
  _readHeaderFlags () {
    const flags = this._reader.readInt()
    return {
      continued: (flags & 0x01) == 0x01,
      bos: (flags & 0x02) == 0x02,
      eos: (flags & 0x04) == 0x04
    }
  }

  /**
   * Reads the granule position as a DataView.
   */
  _readGranulePosition () {
    return this._reader.readDataView(8)
  }

  /**
   * Reads the stream serial number.
   */
  _readStreamSerialNumber () {
    return this._reader.readInt(4) >>> 0
  }

  /**
   * Reads the page sequence number within the logical bitstream.
   */
  _readPageNumber () {
    return this._reader.readInt(4) >>> 0
  }

  /**
   * Reads the CRC-32 checksum for the page.
   */
  _readChecksum () {
    return this._reader.readInt(4) >>> 0
  }

  /**
   * Reads the segment table.
   * @returns {Object} segmentTable: An array of lacing values for the packet encoded by the page.
   * payloadLength: The number of bytes in the payload.
   */
  _readSegmentTable () {
    const tableLength = this._reader.readInt()
    const segmentTable = []
    let payloadLength = 0
    for (let i = 0; i < tableLength; i++) {
      segmentTable.push(this._reader.readInt())
      payloadLength += segmentTable[i]
    }
    return { segmentTable, payloadLength }
  }

  /**
   * Reads the page's payload as a DataView.
   * @param {Number} length The number of bytes in the payload. 
   */
  _readPayload (length) {
    return this._reader.readDataView(length)
  }
}