import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('', 'HomeController.home')
}).namespace('App/manager/controllers').prefix('manager')
