import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('', 'HomeController.home').as('manager.home')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'UsersController.index').as('manager.users.index')
      Route.get('/create', 'UsersController.create').as('manager.users.create')
      Route.post('/store', 'UsersController.store').as('manager.users.store')
      Route.get('/edit/:id', 'UsersController.edit').as('manager.users.edit')
      Route.put('/update/:id', 'UsersController.update').as('manager.users.update')
    }).prefix('users')

    Route.group(() => {
      Route.get('/', 'RolesController.index').as('manager.roles.index')
      Route.get('/create', 'RolesController.create').as('manager.roles.create')
      Route.get('/edit/:id', 'RolesController.edit').as('manager.roles.edit')
      Route.post('/', 'RolesController.store').as('manager.roles.store')
      Route.put('/update/:id', 'RolesController.update').as('manager.roles.update')
      Route.delete('/:id', 'RolesController.destroy').as('manager.roles.destroy')
    }).prefix('roles')

    Route.group(() => {
      Route.get('/', 'PermissionsController.index').as('manager.permissions.index')
      Route.get('/:id', 'PermissionsController.show').as('manager.permissions.show')
    }).prefix('permissions')
  }).prefix('accounts')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'PostsController.index').as('manager.news.posts.index')
      Route.get('/create', 'PostsController.create').as('manager.news.posts.create')
      Route.post('/', 'PostsController.store').as('manager.news.posts.store')
      Route.get('/edit/:id', 'PostsController.edit').as('manager.news.posts.edit')
      Route.put('/update/:id', 'PostsController.update').as('manager.news.posts.update')
      Route.delete('/:id', 'PostsController.destroy').as('manager.news.posts.destroy')
    }).prefix('posts')

    Route.group(() => {
      Route.get('/', 'PostTagsController.index').as('manager.news.tags.index')
      Route.get('/create', 'PostTagsController.create').as('manager.news.tags.create')
      Route.post('/', 'PostTagsController.store').as('manager.news.tags.store')
      Route.get('/edit/:id', 'PostTagsController.edit').as('manager.news.tags.edit')
      Route.put('/update/:id', 'PostTagsController.update').as('manager.news.tags.update')
      Route.delete('/:id', 'PostTagsController.destroy').as('manager.news.tags.destroy')
    }).prefix('tags')
  }).prefix('news')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'WebsiteSettingsController.index').as('manager.settings.index')
      Route.get('/edit/:id', 'WebsiteSettingsController.edit').as('manager.settings.edit')
      Route.put('/update/:id', 'WebsiteSettingsController.update').as('manager.settings.update')
      Route.post('/clear', 'WebsiteSettingsController.clearCache').as('manager.settings.clearCache')
    }).prefix('settings')
  }).prefix('website')
}).namespace('Apps/manager/controllers')
  .prefix('manager')
  .middleware('auth')
  .middleware('manager_guard')
