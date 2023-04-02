import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('', 'HomeController.home')
}).namespace('Apps/manager/controllers').prefix('manager')
