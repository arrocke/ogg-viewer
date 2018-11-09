import OggReader from "@/ogg/ogg-reader";
import OggReaderError from "@/ogg/ogg-reader-error";
import fs from "fs";
import smallData from "../../test-data/small";
import path from "path";

describe("OggReader", () => {
  describe("constructor", () => {
    it("throws exception if argument is not ArrayBuffer or DataView.", () => {
      expect(() => new OggReader("")).toThrowError(TypeError);
    });
  });

  describe("readPage", () => {
    let buffer, view, reader;

    const verifyPages = fn => {
      let i = 0;
      while (reader.hasNext && smallData[i]) {
        fn({
          ePage: smallData[i++],
          aPage: reader.readPage()
        });
      }
    }

    beforeEach(() => {
      buffer = fs.readFileSync(path.resolve(__dirname, "../../test-data/small.ogv")).buffer;
      view = new DataView(buffer);
      reader = new OggReader(buffer);
    });

    it("reads the magic value.", () => {
      verifyPages(({ aPage }) =>
        expect(aPage).toHaveProperty("magic", 0x4f676753));
    });

    it("reads the stream structure version.", () => {
      verifyPages(({ aPage }) =>
        expect(aPage).toHaveProperty("version", 0));
    });

    it("reads the continued packet flag.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("continuedPacket", ePage.continuedPacket));
    });

    it("reads the beginning of stream packet flag.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("startStream", ePage.startStream));
    });

    it("reads the end of stream packet flag.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("endStream", ePage.endStream));
    });

    it("reads the absolute granule position.", () => {
      verifyPages(({ ePage, aPage }) => {
        expect(aPage).toHaveProperty("absGranulePosition");
        expect(aPage.absGranulePosition).toBeInstanceOf(DataView);
        expect(aPage.absGranulePosition.buffer).toBe(buffer);
        expect(aPage.absGranulePosition.byteLength).toEqual(8);
        expect(aPage.absGranulePosition.byteOffset).toEqual(ePage.offset + 6);
      });
    });

    it("reads the stream serial number.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("serialNumber", ePage.serialNumber));
    });

    it("reads the page number.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("pageNumber", ePage.pageNumber));
    });

    it("reads the checksum.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("checksum", ePage.checksum));
    });

    it("reads segment table.", () => {
      verifyPages(({ ePage, aPage }) =>
        expect(aPage).toHaveProperty("segmentTable", ePage.segmentTable));
    });

    it("reads page contents.", () => {
      verifyPages(({ ePage, aPage }) => {
        expect(aPage).toHaveProperty("contents");
        expect(aPage.contents).toBeInstanceOf(DataView);
        expect(aPage.contents.buffer).toBe(buffer);
        expect(aPage.contents.byteOffset).toEqual(ePage.offset + 27 + ePage.segmentTable.length);
        expect(aPage.contents.byteLength).toEqual(ePage.segmentTable.reduce((acc, v) => acc + v));
      });
    })

    it("throws error if the magic number is incorrect.", () => {
      view.setUint32(0, 0);
      expect(() => reader.readPage()).toThrowError(OggReaderError)
    });

    it("throws error if the stream structure version is incorrect.", () => {
      view.setUint8(4, 1);
      expect(() => reader.readPage()).toThrowError(OggReaderError)
    });

    it("throws error if the reader is at the end of the view.", () => {
      reader = new OggReader(new ArrayBuffer(0));
      expect(() => reader.readPage()).toThrowError(RangeError);
    });
  });
});