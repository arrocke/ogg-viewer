import BufferReader from "@/ogg/buffer-reader";

describe("BufferReader", () => {
  describe("create", () => {
    it("sets the bytePos to 0.", () => {
      const buffer = new ArrayBuffer(1);
      const reader = BufferReader.create(buffer);
      expect(reader).toHaveProperty("bytePos", 0);
    });

    it("creates a DataView for the buffer.", () => {
      const buffer = new ArrayBuffer(1);
      const reader = BufferReader.create(buffer);
      expect(reader).toHaveProperty("view");
      expect(reader.view.buffer).toBe(buffer);
      expect(reader.view.byteOffset).toEqual(0);
    });

    it("uses the given DataView.", () => {
      const buffer = new ArrayBuffer(10);
      const view = new DataView(buffer, 1, 5);
      const reader = BufferReader.create(view);
      expect(reader).toHaveProperty("view", view);
    });

    it("throws exception if argument is not ArrayBuffer or DataView.", () => {
      expect(() => BufferReader.create("")).toThrowError(TypeError);
    });
  });
});
