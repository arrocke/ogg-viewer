export default {
  readFile: (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("abort", () => reject());
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsArrayBuffer(file);
  })
}