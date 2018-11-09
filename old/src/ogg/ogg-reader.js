import BufferReader from "@/ogg/buffer-reader";
import OggReaderError from "@/ogg/ogg-reader-error";

export default class OggReader extends BufferReader {
  static MAGIC = 0x4f676753;
  static VERSION = 0;
  static CONT_PKT = 0x01;
  static BOS_PKT = 0x02;
  static EOS_PKT = 0x04;

  static MAGIC_ERROR =
    "Expected magic value {expected}, but found {actual} instead.";
  static VERSION_ERROR =
    "Expected stream structure version {expected}, but found {actual} instead."

  constructor(source) {
    super(source);
  }

  readPage() {
    // Read magic value 'OggS'.
    const magic = this.readBytes(4, true);
    if (magic != OggReader.MAGIC) {
      throw new OggReaderError(
        OggReader.MAGIC_ERROR
          .replace("{expected}", `0x${OggReader.MAGIC.toString(16)}`)
          .replace("{actual}", `0x${magic.toString(16)}`),
        this.bytePos - 4
      );
    }

    // Read stream version.
    const version = this.readByte();
    if (version != OggReader.VERSION) {
      throw new OggReaderError(
        OggReader.VERSION_ERROR
          .replace("{expected}", OggReader.VERSION)
          .replace("{actual}", version),
        this.bytePos - 1
      );
    }

    // Read header flags.
    const flags = this.readByte();
    const continuedPacket = (OggReader.CONT_PKT & flags) == OggReader.CONT_PKT;
    const startStream = (OggReader.BOS_PKT & flags) == OggReader.BOS_PKT;
    const endStream = (OggReader.EOS_PKT & flags) == OggReader.EOS_PKT;

    // Read absolute granule position.
    const absGranulePosition = this.readDataView(8);

    // Read serial number.
    const serialNumber = this.readBytes(4);

    // Read page number.
    const pageNumber = this.readBytes(4);

    // Read checksum.
    const checksum = this.readBytes(4);

    // Read segment table.
    const tableSize = this.readByte();
    const segmentTable = [];
    let contentsSize = 0;
    for (let i = 0; i < tableSize; i++) {
      const seg = this.readByte();
      segmentTable.push(seg);
      contentsSize += seg;
    }

    const contents = this.readDataView(contentsSize);

    return {
      magic,
      version,
      continuedPacket,
      startStream,
      endStream,
      absGranulePosition,
      serialNumber,
      pageNumber,
      checksum,
      segmentTable,
      contents
    };
  }
}