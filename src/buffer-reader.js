/**
 * Sequentially reads an ArrayBuffer or DataView.
 */
export default class BufferReader {
  /**
   * Creates a new BufferReader from an ArrayBuffer or DataView.
   * @param {ArrayBuffer} options.buffer The ArrayBuffer to read. Do not use this parameter if options.dataview is set.
   * @param {DataView} options.dataview The DataView to read. Do not use this parameter if options.buffer is set.
   * @param {bool} options.littleEndian Whether bytes should be read with little endianess. Defaults to false.
   */
  static create({ buffer, dataview, littleEndian = false } = {}) {
    let reader = new BufferReader()

    if (buffer instanceof ArrayBuffer) {
      reader._buffer = buffer
      reader._view = new DataView(reader._buffer)
    } else if (dataview instanceof DataView) {
      reader._buffer = dataview.buffer
      reader._view = dataview
    } else {
      throw new Error('BufferReader requires an ArrayBuffer or DataView to read.')
    }

    reader._pos = 0;
    reader._littleEndian = littleEndian

    return reader
  }

  /**
   * The position of the reader in the buffer.
   */
  get position() {
    return this._pos
  }

  /**
   * Determines whether the reader is at the end of the buffer.
   */
  get hasNext() {
    return this._pos < this._view.byteLength
  }

  /**
   * Reads byte(s) as an integer.
   * @param {int} n The number of bytes to read. Defaults to 1.
   */
  readInt(n = 1) {
    if (n > 4 || n < 1)
      throw new Error('BufferReader can only read one to four bytes as an integer.')

    let data = 0
    for (let i = 0; i < n; i++) {
      const byte = this._view.getUint8(this._pos++)
      if (this._littleEndian)
        data += (byte << (8 * i))
      else
        data = (data << 8) + byte
    }

    return data
  }

  /**
   * Reads byte(s) as a DataView.
   * @param {int} n The number of bytes to read. Defaults to 1.
   */
  readDataView(n = 1) {
    const view = new DataView(this._buffer, this._view.byteOffset + this._pos, n)
    this._pos += n
    return view
  }
}