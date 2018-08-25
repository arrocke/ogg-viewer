import BufferReader from "@/ogg/buffer-reader";

export default class OggReader extends BufferReader {
  constructor(source) {
    super(source);
  }

  /**
   * Reads several bytes as a number.
   * @param {Number} n The number of bytes to read. Must be no more than 4.
   */
  _readBytes(n, bigEndian = false) {
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
    return val;
  }

  readPage() {
    const magic = this._readBytes(4, true);
    const version = this.readByte();

    return {
      magic,
      version
    };
  }
}