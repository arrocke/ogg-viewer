export default class Page {
  static MAGIC = "OggS";
  static VERSION = 0;
  static CONTINUATION_PACKET = 0x01;
  static BOS_PACKET = 0x02;
  static EOS_PACKET = 0x03;

  static read(index, bufferReader) {
    // Create the new page.
    const page = new Page();
    page._index = index;
    // Read and convert magic page string.
    page._magic = [
      String.fromCharCode(bufferReader.readByte()),
      String.fromCharCode(bufferReader.readByte()),
      String.fromCharCode(bufferReader.readByte()),
      String.fromCharCode(bufferReader.readByte())
    ].join("");
    // Read version.
    page._version = bufferReader.readByte();
    // Read header flags.
    page._flags = bufferReader.readByte();
    // Read granule position.
    page._granulePosition = bufferReader.readDataView(8);
    // Read stream serial number.
    page._serialNumber =
      bufferReader.readByte() |
      (bufferReader.readByte() << 8) |
      (bufferReader.readByte() << 16) |
      (bufferReader.readByte() << 24);
    // Read page number.
    page._pageNumber =
      bufferReader.readByte() |
      (bufferReader.readByte() << 8) |
      (bufferReader.readByte() << 16) |
      (bufferReader.readByte() << 24);
    // Read CRC checksum.
    page._checksum =
      bufferReader.readByte() |
      (bufferReader.readByte() << 8) |
      (bufferReader.readByte() << 16) |
      (bufferReader.readByte() << 24);
    // Read page segments.
    page._segmentCount = bufferReader.readByte();
    // Read segment table.
    page._payloadSize = 0;
    page._segmentTable = [];
    for (let i = 0; i < page._segmentCount; i++) {
      const size = bufferReader.readByte();
      page._segmentTable.push(size);
      page._payloadSize += size;
    }
    page._payload = bufferReader.readDataView(page._payloadSize);
    return page;
  }

  get index() {
    return this._index;
  }
  get magic() {
    return this._magic;
  }
  get magicValid() {
    return this._magic === Page.MAGIC;
  }
  get version() {
    return this._version;
  }
  get versionValid() {
    return this._version === Page.VERSION;
  }
  get continuationPacket() {
    return (
      (this._flags & Page.CONTINUATION_PACKET) === Page.CONTINUATION_PACKET
    );
  }
  get bos() {
    return (this._flags & Page.BOS_PACKET) === Page.BOS_PACKET;
  }
  get eos() {
    return (this._flags & Page.EOS_PACKET) === Page.EOS_PACKET;
  }
  get granulePosition() {
    return this._granulePosition;
  }
  get serialNumber() {
    return this._serialNumber;
  }
  get pageNumber() {
    return this._pageNumber;
  }
  get checksum() {
    return this._checksum;
  }
  get segmentCount() {
    return this._segmentCount;
  }
  get payloadSize() {
    return this._payloadSize;
  }
  get payload() {
    return this._payload;
  }

  segmentSize(index) {
    return this._segmentTable[index];
  }
}
