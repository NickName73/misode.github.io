import { DataModel } from "../model/DataModel"
import { Path } from "../model/Path"

type Registry = {
  [id: string]: (el: Element) => void
}

const registryIdLength = 12
const dec2hex = (dec: number) => ('0' + dec.toString(16)).substr(-2)

export function getId() {
  var arr = new Uint8Array((registryIdLength || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

export class TreeView {
  model: DataModel
  registry: Registry = {}

  constructor(model: DataModel) {
    this.model = model
  }

  register(callback: (el: Element) => void): string {
    const id = getId()
    this.registry[id] = callback
    return id
  }

  render(target: HTMLElement) {
    target.innerHTML = this.model.schema.render(new Path(), this.model.data, this)
    for (const id in this.registry) {
      const element = target.querySelector(`[data-id="${id}"]`)
      if (element !== null) this.registry[id](element)
    }
  }
}