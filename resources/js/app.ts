import '../css/app.css'
import '../css/tailwind.css'
import '../css/highlight.css'
import '../css/ql-editor.css'

import './unpoly.js'

import Alpine from 'alpinejs'

window['Alpine'] = Alpine

Alpine.data('imageUploader', () => {
  return {
    imageUrl: '',

    fileChosen(event) {
      this.fileToDataUrl(event, src => this.imageUrl = src)
    },

    fileToDataUrl(event, callback) {
      if (! event.target.files.length) return

      let file = event.target.files[0],
        reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = e => callback(e.target?.result)
    },
  }
})

Alpine.start()
