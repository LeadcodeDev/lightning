import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('manager', Application.makePath('apps/manager/resources'))
