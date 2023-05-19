import 'unpoly'
import 'unpoly/unpoly.css'
import SlimSelect from "slim-select";
import Quill from 'quill'
import hljs from 'highlight.js'
import 'quill/dist/quill.snow.css'

up.fragment.config.mainTargets.push('[layout-main]')

up.link.config.preloadSelectors.push('a[href]')
up.link.config.followSelectors.push('a[href]')

up.form.config.submitSelectors.push(['form'])

up.on('up:fragment:loaded', (event) => {
  if (event.response.getHeader('X-Full-Reload')) {
    // Prevent the fragment update and don't update browser history
    event.preventDefault()

    // Make a full page load for the same request.
    event.request.loadPage()
  }
})

up.on('up:fragment:inserted', () => {
  const selects = document.querySelectorAll('select')

  selects.forEach((select) => {
    new SlimSelect({
      select: `#${select.id}`,
      settings: {
        allowDeselect: true,
        closeOnSelect: false,
      }
    })
  })
})

up.on('up:fragment:updated', () => {
  hljs.highlightAll();
})

up.on('up:fragment:inserted', function() {
  const editorContainer = document.getElementById('editor');
  if (editorContainer) {
    hljs.configure({
      languages: ['javascript', 'ruby', 'python']
    });

    const editor = new Quill('#editor', {
      modules: {
        syntax: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'code', 'link'],
          ['image', 'video'],
          [{'header': [2, 3, false]}],
          [{'color': []}, {'background': []}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['blockquote', 'code-block'],
          ['clean']
        ]
      },
      placeholder: 'Contenu de votre article',
      theme: 'snow'
    })

    const button = document.querySelector('button[type=submit]')
    const input = document.querySelector('#content')

    button.addEventListener('click', (event) => {
      event.preventDefault()
      input.value = editor.root.innerHTML
      input.form.submit()
    })
  }
})
