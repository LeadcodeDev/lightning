import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('manager', Application.makePath('app/manager/resources'))
