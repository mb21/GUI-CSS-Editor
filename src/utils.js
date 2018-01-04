const getUniqueId = (() => {
  let id = 0;
  return prefix => {
    id++;
    return prefix + id.toString()
  }
})();

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject  = reject
      this.resolve = resolve
    })
  }
}

const previewBody = "main"

export {Deferred, getUniqueId, previewBody}
