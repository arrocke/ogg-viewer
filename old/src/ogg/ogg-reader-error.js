export default class OggReaderError extends Error {
  constructor(message, byteOffset) {
    super(`Error parsing Ogg page at byte ${byteOffset}: ${message}`);
    this._byteOffset = byteOffset;
  }

  get byteOffset() {
    return this._byteOffset;
  }
}