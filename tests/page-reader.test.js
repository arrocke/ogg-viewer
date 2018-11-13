import PageReader from '../src/page-reader'

describe('PageReader', () => {
  describe('create', () => {
    it('throws exception if an ArrayBuffer is not given.', () => {
      expect(() => PageReader.create({})).toThrowError()
    })
  })

  describe('readPage', () => {
    let page

    const createReader = (data) => {
      const buffer = new Uint8Array(data).buffer
      return PageReader.create({ buffer })
    }

    beforeEach(() => {
      page = [
        0x4f, 0x67, 0x67, 0x53,   // Capture pattern
        0x00,                     // Version number
        0x00,                     // Header flags
        0x00, 0x00, 0x00, 0x00,   // Granule position
        0x00, 0x00, 0x00, 0x00,
        0x12, 0x34, 0x6a, 0xff,   // Bitstream serial number
        0x02, 0x00, 0x00, 0x00,   // Page sequence number
        0x4f, 0xff, 0x23, 0x23,   // CRC checksum
        0x02,                     // Number of page segments
        0xff, 0x0a                // Segment lacing values
      ]

      // Payload data
      for (let i = 0; i < 0xff + 0x0a; i++) {
        page.push(i)
      }
    })

    it('throws an exception if the capture pattern is not found.', () => {
      page[0] = 0x44
      const reader = createReader(page)
      expect(() => reader.readPage()).toThrowError()
    })

    it('throws an exception if the version number is not 0.', () => {
      page[4] = 0x01 
      const reader = createReader(page)
      expect(() => reader.readPage()).toThrowError()
    })

    it('decodes the continued header flag.', () => {
      page[5] = 0x00
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('continued', false)

      page[5] = 0x01
      reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('continued', true)
    })

    it('decodes the bos header flag.', () => {
      page[5] = 0x00
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('bos', false)

      page[5] = 0x02
      reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('bos', true)
    })

    it('decodes the eos header flag.', () => {
      page[5] = 0x00
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('eos', false)

      page[5] = 0x04
      reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('eos', true)
    })

    it('decodes the granule position.', () => {
      let reader = createReader(page)
      let { granulePosition } = reader.readPage()
      expect(granulePosition).toBeInstanceOf(DataView)
      expect(granulePosition.byteOffset).toBe(6)
      expect(granulePosition.byteLength).toBe(8)
    })

    it('decodes the bitstream serial number.', () => {
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('streamSerialNumber', 0xff6a3412)
    })

    it('decodes the page sequence number.', () => {
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('pageNumber', 0x00000002)
    })

    it('decodes the CRC checksum.', () => {
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('checksum', 0x2323ff4f)
    })

    it('decodes the segment table.', () => {
      let reader = createReader(page)
      expect(reader.readPage()).toHaveProperty('segmentTable', [0xff, 0x0a])
    })

    it('decodes the page payload.', () => {
      let reader = createReader(page)
      let { payload } = reader.readPage()
      expect(payload).toBeInstanceOf(DataView)
      expect(payload.byteOffset).toBe(29)
      expect(payload.byteLength).toBe(0xff + 0x0a)
    })
  })
})