import BufferReader from '../src/buffer-reader'

describe('BufferReader', () => {
  describe('create', () => {
    it('throws exception if neither ArrayBuffer or DataView is given.', () => {
      expect(() => BufferReader.create({})).toThrowError()
    })

    it('initializes the position of the reader to the beginning of the buffer.', () => {
      const buffer = new ArrayBuffer(10)
      const reader = BufferReader.create({ buffer })
      expect(reader.position).toBe(0)
    })
  })

  describe('hasNext', () => {
    it('returns true when the reader is not at the end of the buffer.', () => {
      const buffer = new ArrayBuffer(10)
      const reader = BufferReader.create({ buffer })
      expect(reader.hasNext).toBe(true)
    })

    it('returns false when the reader is at the end of the buffer.', () => {
      const buffer = new ArrayBuffer(0)
      const reader = BufferReader.create({ buffer })
      expect(reader.hasNext).toBe(false)
    })
  })

  describe('readAsInt', () => {
    let buffer, reader

    beforeEach(() => {
      buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer
      reader = BufferReader.create({ buffer })
    })

    it('returns a single byte by default.', () => {
      expect(reader.readInt()).toBe(0)
      expect(reader.readInt()).toBe(1)
      expect(reader.readInt()).toBe(2)
    })

    it('returns the given amount of bytes.', () => {
      expect(reader.readInt(2)).toBe(0x0001)
      expect(reader.readInt(3)).toBe(0x020304)
      expect(reader.readInt(4)).toBe(0x05060708)
      expect(reader.readInt(1)).toBe(0x09)
    })

    it('throws an exception if more than four bytes are asked for.', () => {
      expect(() => reader.readInt(5)).toThrowError()
    })

    it('can handle little endian bytes.', () => {
      reader = BufferReader.create({ buffer, littleEndian: true })
      expect(reader.readInt(2)).toBe(0x0100)
      expect(reader.readInt(3)).toBe(0x040302)
      expect(reader.readInt(4)).toBe(0x08070605)
      expect(reader.readInt(1)).toBe(0x09)
    })

    it('increments the position of the reader.', () => {
      reader.readInt()
      expect(reader.position).toBe(1)
      reader.readInt(2)
      expect(reader.position).toBe(3)
      reader.readInt(3)
      expect(reader.position).toBe(6)
      reader.readInt(4)
      expect(reader.position).toBe(10)
    })
  })

  describe('readAsDataView', () => {
    let buffer, reader

    beforeEach(() => {
      buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer
      reader = BufferReader.create({ buffer })
    })

    it('returns a single byte by default.', () => {
      const view = reader.readDataView()
      expect(view.buffer).toBe(buffer)
      expect(view.byteOffset).toBe(0)
      expect(view.byteLength).toBe(1)
    })

    it('returns the given amount of bytes.', () => {
      let view = reader.readDataView(1)
      expect(view.buffer).toBe(buffer)
      expect(view.byteOffset).toBe(0)
      expect(view.byteLength).toBe(1)
      view = reader.readDataView(2)
      expect(view.buffer).toBe(buffer)
      expect(view.byteOffset).toBe(1)
      expect(view.byteLength).toBe(2)
      view = reader.readDataView(3)
      expect(view.buffer).toBe(buffer)
      expect(view.byteOffset).toBe(3)
      expect(view.byteLength).toBe(3)
      view = reader.readDataView(4)
      expect(view.buffer).toBe(buffer)
      expect(view.byteOffset).toBe(6)
      expect(view.byteLength).toBe(4)
    })

    it('increments the position of the reader.', () => {
      reader.readDataView()
      expect(reader.position).toBe(1)
      reader.readDataView(2)
      expect(reader.position).toBe(3)
      reader.readDataView(3)
      expect(reader.position).toBe(6)
      reader.readDataView(4)
      expect(reader.position).toBe(10)
    })
  })
})