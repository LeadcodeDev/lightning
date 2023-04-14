declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    normalizeManyRelations(): Rule
  }
}
