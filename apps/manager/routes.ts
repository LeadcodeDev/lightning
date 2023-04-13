import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('', 'HomeController.home').as('manager.home')
  Route.group(() => {
    Route.get('/', 'UsersController.index').as('manager.users.index')
    Route.get('/create', 'UsersController.create').as('manager.users.create')
    Route.post('/store', 'UsersController.store').as('manager.users.store')
    Route.get('/edit/:id', 'UsersController.edit').as('manager.users.edit')
    Route.put('/update/:id', 'UsersController.update').as('manager.users.update')
  }).prefix('users')

  Route.group(() => {
    Route.get('/', 'UsersController.index').as('manager.roles.index')
    Route.get('/:id', 'UsersController.show').as('manager.roles.show')
    Route.get('/edit/:id', 'UsersController.edit').as('manager.roles.edit')
    Route.put('/update/:id', 'UsersController.update').as('manager.roles.update')
  }).prefix('roles')
}).namespace('Apps/manager/controllers').prefix('manager')
