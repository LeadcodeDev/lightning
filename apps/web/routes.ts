import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('/password/forgot', 'PasswordResetController.forgot').as('password.forgot')
  Route.post('/password/send', 'PasswordResetController.send').as('password.send')
  Route.get('/password/reset/:token', 'PasswordResetController.reset').as('password.reset')
  Route.post('/password/store', 'PasswordResetController.store').as('password.store')

  Route.group(() => {
    Route.get('account/create', 'UserController.create').as('user.create')
    Route.post('account/create', 'UserController.store').as('user.store')
    Route.get('account/confirm-email/:token', 'UserController.confirmEmail').as('user.confirmEmail')

    Route.get('authentication/login', 'AuthenticationController.showLogin').as('authentication.showLoginForm')
    Route.post('authentication/login', 'AuthenticationController.login').as('authentication.login')
  })
}).namespace('Apps/web/controllers')
