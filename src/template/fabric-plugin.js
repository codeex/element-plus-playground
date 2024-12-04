import * as fabric from 'fabric'
import { getCurrentInstance } from 'vue'

let installed = false
await loadStyle()

export function setupFabricJs() {
  if (installed) return
  const instance = getCurrentInstance()
  const app = instance.appContext.app
  app.config.globalProperties.$fabric = fabric
  installed = true
}

export function loadStyle() {
  const styles = ['#STYLE#', '#DARKSTYLE#'].map((style) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = style
      link.addEventListener('load', resolve)
      link.addEventListener('error', reject)
      document.body.append(link)
    })
  })
  return Promise.allSettled(styles)
}
