import BufferReader from "@/ogg/buffer-reader";

describe("BufferReader", () => {
  describe("constructor", () => {
    it("throws exception if argument is not ArrayBuffer or DataView.", () => {
      expect(() => new BufferReader("")).toThrowError(TypeError);
    });
  });

  describe("hasNext", () => {
    it("returns true if there are more bytes to be read.", () => {
      const buffer = new ArrayBuffer(2);
      const reader = new BufferReader(buffer);
      expect(reader.hasNext).toEqual(true);
    });

    it("returns false if there are no more bytes to be read.", () => {
      const buffer = new ArrayBuffer(0);
      const reader = new BufferReader(buffer);
      expect(reader.hasNext).toEqual(false);
    });
  });

  describe("readByte", () => {
    let reader, view;

    beforeEach(() => {
      const size = 10;
      const buffer = new ArrayBuffer(size);
      view = new DataView(buffer);
      for (let i = 0; i < size; i++) {
        view.setUint8(i, i);
      }
      reader = new BufferReader(view);
    });

    it("returns the next byte in the view.", () => {
      for (let i = 0; i < view.byteLength; i++) {
        const byte = reader.readByte();
        expect(byte).toEqual(i);
      }
    });

    it("moves to the next byte in the view.", () => {
      for (let i = 0; i < view.byteLength; i++) {
        reader.readByte();
        expect(reader.bytePos).toEqual(i + 1);
      }
    });

    it("throws exception if the reader is at the end of the view.", () => {
      for (let i = 0; i < view.byteLength; i++) {
        reader.readByte();
      }
      expect(() => reader.readByte()).toThrowError(RangeError);
    });
  });

  describe("readBytes", () => {
    let reader, view;

    beforeEach(() => {
      const size = 10;
      const buffer = new ArrayBuffer(size);
      view = new DataView(buffer);
      for (let i = 0; i < size; i++) {
        view.setUint8(i, i);
      }
      reader = new BufferReader(view);
    });

    it("returns the next bytes in little endian form from the view.", () => {
      for (let i = 0; i < view.byteLength / 2; i++) {
        const byte = reader.readBytes(2);
        expect(byte).toEqual((2 * i) | ((2 * i + 1) << 8));
      }
    });

    it("returns the next bytes in big endian form from the view when flag is set.", () => {
      for (let i = 0; i < view.byteLength / 2; i++) {
        const byte = reader.readBytes(2, true);
        expect(byte).toEqual(((2 * i) << 8) | (2 * i + 1));
      }
    });

    it("moves to the next byte in the view.", () => {
      for (let i = 0; i < view.byteLength / 2; i++) {
        reader.readBytes(2);
        expect(reader.bytePos).toEqual(2 * (i + 1));
      }
    });

    it("throws exception if more than 4 bytes are requested.", () => {
      expect(() => reader.readBytes(5)).toThrowError(RangeError);
    });

    it("throws exception if the reader is at the end of the view.", () => {
      for (let i = 0; i < view.byteLength; i++) {
        reader.readByte();
      }
      expect(() => reader.readBytes(2)).toThrowError(RangeError);
    });
  });

  describe("readDataView", () => {
    let reader, view;

    beforeEach(() => {
      const size = 10;
      const buffer = new ArrayBuffer(size);
      view = new DataView(buffer);
      for (let i = 0; i < size; i++) {
        view.setUint8(i, i);
      }
      reader = new BufferReader(view);
    });

    it("returns a DataView of the next several bytes in the view.", () => {
      for (let i = 0; i < view.byteLength / 2; i++) {
        const view = reader.readDataView(2);
        expect(view).toBeInstanceOf(DataView);
        expect(view.buffer).toBe(view.buffer);
        expect(view.byteOffset).toBe(i * 2);
        expect(view.byteLength).toBe(2);
      }
    });

    it("moves to the next byte in the view.", () => {
      for (let i = 0; i < view.byteLength / 2; i++) {
        reader.readDataView(2);
        expect(reader.bytePos).toEqual(2 * (i + 1));
      }
    });

    it("throws exception if the reader is at the end of the view.", () => {
      for (let i = 0; i < view.byteLength - 1; i++) {
        reader.readByte();
      }
      expect(() => reader.readDataView(2)).toThrowError(RangeError);
    });
  });
});
