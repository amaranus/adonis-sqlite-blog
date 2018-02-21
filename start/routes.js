'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

//const { auth } = use('Adonis/Middleware/Auth')

// Route.on('/').render('home')
Route.get('/','PostController.home')

// 1. Yazılış
// Route.get('/test', () => 'Hello World')
// 2. Yazılış
// Route.get('/test2', function () {
//     return 'Hello World'   
// })

// URL den parametre okuma
// Route.get('/test/:id', function ({ params }) {
//     return `This is the id: ${params.id}`
// })

Route.get('/posts/page/:page', 'PostController.index')

Route.get('/posts/add', 'PostController.add')

Route.get('/posts/edit/:id', 'PostController.edit')

Route.get('/posts/page/:page/:id', 'PostController.details')

Route.post('/posts', 'PostController.store')

Route.put('/posts/:id', 'PostController.update')

Route.delete('/posts/:id', 'PostController.destroy')

Route
    .get('/users/profile/:id', 'UserController.profile')
    .middleware('auth')

Route.get('/users/register', 'UserController.showRegisterPage')

Route.post('/users/register', 'UserController.register')

Route.get('/users/login', 'UserController.showLoginPage')

Route.post('/users/login', 'UserController.login')

Route.get('/users/logout', 'UserController.logout')

Route.put('/users/profile/:id','UserController.update')

