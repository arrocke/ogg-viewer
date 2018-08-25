import OggReader from "@/ogg/ogg-reader";

describe("OggReader", () => {
  describe("constructor", () => {
    it("throws exception if argument is not ArrayBuffer or DataView.", () => {
      expect(() => new OggReader("")).toThrowError(TypeError);
    });
  });

  describe("readPage", () => {
    let buffer;

    beforeEach(() => {
      buffer = new ArrayBuffer(1000);
      const view = new DataView(buffer);
      view.setUint32(0, 0x4f676753);
    });

    it("reads the magic buffer.", () => {
      const reader = new OggReader(buffer);
      const page = reader.readPage();
      expect(page).toHaveProperty("magic", 0x4f676753);
    });

    it("reads the stream structure version.", () => {
      const reader = new OggReader(buffer);
      const page = reader.readPage();
      expect(page).toHaveProperty("version", 0);
    });
  });
});