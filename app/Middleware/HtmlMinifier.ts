import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { minify } from 'html-minifier'

export default class HtmlMinifier {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    await next()

    const method: string = request.method()
    const accepts: string[] = request.accepts([]) ?? []
    const isPng = request.url().endsWith('png')
    const isJpg = request.url().endsWith('jpg')
    const isJpeg = request.url().endsWith('jpeg')
    const isWebp = request.url().endsWith('webp')
    const isXml = request.url().endsWith('xml')

    if (method != 'GET' || !accepts.includes('text/html') || isXml || isPng || isJpg || isJpeg || isWebp) {
      return
    }

    response.send(minify(response.getBody(), {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true
    }))
  }
}
