import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('manager', Application.makePath('apps/manager/resources'))
View.mount('web', Application.makePath('apps/web/resources'))
