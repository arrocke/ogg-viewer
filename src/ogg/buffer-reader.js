const create = (source) => {
  let view;
  if (source instanceof ArrayBuffer) {
    view = new DataView(source);
  }
  else if (source instanceof DataView) {
    view = source;
  }
  else {
    throw new TypeError("'source' must be an ArrayBuffer or DataView.");
  }
  return {
    view,
    bytePos: 0
  };
};

export default {
  create
}