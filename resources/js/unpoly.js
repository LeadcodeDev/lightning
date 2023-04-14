import 'unpoly'
import 'unpoly/unpoly.css'
import SlimSelect from "slim-select";

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

