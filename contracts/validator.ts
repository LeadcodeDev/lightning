declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    notExists(options: DbRowCheckOptions): Rule
  }
}
