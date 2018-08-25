import BufferReader from "@/ogg/buffer-reader";

export default class OggReader extends BufferReader {
  constructor(source) {
    super(source);
  }

  readPage() {
    const magic = this.readBytes(4, true);
    const version = this.readByte();

    return {
      magic,
      version
    };
  }
}