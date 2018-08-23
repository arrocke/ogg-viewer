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

  get bytePos() {
    return this._bytePos;
  }

  get hasNext() {
    return this._bytePos < this._view.byteLength;
  }

  readByte() {
    return this._view.getUint8(this._bytePos++);
  }

  readDataView(byteLength) {
    const view = new DataView(this._view.buffer, this._bytePos, byteLength);
    this._bytePos += byteLength;
    return view;
  }
}