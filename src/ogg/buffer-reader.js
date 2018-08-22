export default class BufferReader {
  constructor({ buffer }) {
    this._buffer = buffer;
    this._view = new DataView(buffer);
    this._bytePos = 0;
  }

  get buffer() {
    return this._view.buffer;
  }

  get byteLength() {
    return this._view.byteLength;
  }

  get bytePos() {
    return this._bytePos;
  }

  get currentByte() {
    return this._view.getUint8(this._bytePos);
  }

  get hasNextByte() {
    return this._bytePos < this._view.byteLength;
  }

  readByte() {
    return this._view.getUint8(this._bytePos++);
  }

  readDataView(byteLength) {
    const view = new DataView(this._buffer, this._bytePos, byteLength);
    this._bytePos += byteLength;
    return view;
  }
}
