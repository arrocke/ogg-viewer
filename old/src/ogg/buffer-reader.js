/**
 * Sequentially reads an ArrayBuffer
 * @param {ArrayBuffer|DataView} source The buffer to read.
 */
export default class BufferReader {
  constructor(source) {
    if (source instanceof ArrayBuffer) {
      this._view = new DataView(source);
    }
    else if (source instanceof DataView) {
      this._view = source;
    }
    else {
      throw new TypeError("'source' must be an ArrayBuffer or DataView.");
    }
    this._bytePos = 0;
  }

  /**
   * Gets the position of the reader in the buffer in bytes.
   */
  get bytePos() {
    return this._bytePos;
  }

  /**
   * Gets a value that indicates whether the reader has more data to read.
   */
  get hasNext() {
    return this._bytePos < this._view.byteLength;
  }

  /**
   * Reads the next byte in the buffer.
   */
  readByte() {
    return this._view.getUint8(this._bytePos++);
  }

  /**
   * Reads several bytes as a number.
   * @param {Number} n The number of bytes to read. Must be no more than 4.
   */
  readBytes(n, bigEndian = false) {
    if (n > 4) {
      throw new RangeError("Cannot read more than 4 bytes at a time.");
    }
    let val = 0;
    if (bigEndian) {
      for (let i = 0; i < n; i++) {
        val <<= 8;
        val |= this.readByte();
      }
    } else {
      for (let i = 0; i < n; i++) {
        val |= (this.readByte() << (i * 8));
      }
    }
    return val >>> 0;
  }

  /**
   * Reads the next byteLength bytes as a DataView.
   * @param {int} byteLength The number of bytes to make available in the DataView.
   */
  readDataView(byteLength) {
    const view = new DataView(this._view.buffer, this._bytePos, byteLength);
    this._bytePos += byteLength;
    return view;
  }
}