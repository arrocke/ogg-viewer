import Page from "@/ogg/page";
import BufferReader from "@/ogg/buffer-reader";

// Provides helper methods for reading a buffer as an ogg bitstream.
export default class OggReader {
  constructor({ buffer }) {
    this._buffer = buffer;
    this._bufferReader = new BufferReader({ buffer });
    this._pages = [];
    this._pos = 0;
    this._bitstreams = {};
  }

  loadAll() {
    let i = 0;
    while (this._bufferReader.hasNextByte) {
      this._loadPage(i++);
    }
  }

  page(index) {
    this._loadPage(index);
    return this._pages[index];
  }

  _loadPage(index) {
    if (!this._pages[index]) {
      if (index > 0) {
        this._loadPage(index - 1);
      }
      const page = Page.read(this._pages.length, this._bufferReader);
      this._pages.push(page);
      if (!this._bitstreams[page.serialNumber]) {
        this._bitstreams[page.serialNumber] = [];
      }
      this._bitstreams[page.serialNumber].push(page);
    }
  }
}
