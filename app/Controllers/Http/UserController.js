'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
// Şifre update fonksiyonun, şifreyi hash etmek için çağrıldı
const Hash = use('Hash')


class UserController {

    // async profile({ response, view, auth, session }) {
    //     try {
    //         await auth.check()
    //         return view.render('users.profile',{
    //             user: auth.user
    //         })
    //     } catch (error) {
    //         //response.send('You are not logged in')
    //         session.flash({ notification: 'You are not logged in!' })
    //         return response.redirect('/users/login')

    //     }
    // }


    // 88888888ba                           ad88 88 88
    // 88      "8b                         d8"   "" 88
    // 88      , 8P                         88       88
    // 88aaaaaa8P' 8b,dPPYba,  ,adPPYba, MM88MMM 88 88  ,adPPYba,  
    // 88""""""'   88P'   "Y8 a8"     "8a  88    88 88 a8P_____88  
    // 88          88         8b       d8  88    88 88 8PP"""""""  
    // 88          88         "8a,   ,a8"  88    88 88 "8b,   ,aa  
    // 88          88          `"YbbdP"'   88    88 88  `"Ybbd8"'  

    async profile({ auth, params, view }) {
        if (auth.user.id !== Number(params.id)) {
            return 'You cannot see someone else\'s profile'
        }
        return view.render('users.profile', {
            user: auth.user
        })
    }

    async showRegisterPage({ request, response, view, auth }) {
        try {
            await auth.check()
        } catch (error) {
            return view.render('users.register')
        }
    }


    // 88888888ba                        88                                         
    // 88      "8b                       ""             ,d                          
    // 88      ,8P                                      88                          
    // 88aaaaaa8P' ,adPPYba,  ,adPPYb,d8 88 ,adPPYba, MM88MMM ,adPPYba, 8b,dPPYba,  
    // 88""""88'  a8P_____88 a8"    `Y88 88 I8[    ""   88   a8P_____88 88P'   "Y8  
    // 88    `8b  8PP""""""" 8b       88 88  `"Y8ba,    88   8PP""""""" 88          
    // 88     `8b "8b,   ,aa "8a,   ,d88 88 aa    ]8I   88,  "8b,   ,aa 88          
    // 88      `8b `"Ybbd8"'  `"YbbdP"Y8 88 `"YbbdP"'   "Y888 `"Ybbd8"' 88          
    //                        aa,    ,88                                            
    //                         "Y8bbdP"                                             

    async register({ request, response, session, auth }) {
        const validation = await validate(request.all(), User.rules)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }
        const user = new User()

        user.username = request.input('username')
        user.email = request.input('email')
        user.password = request.input('password')

        await user.save()

        session.flash({ notification: 'User created!' })

        await auth.login(user)

        return response.redirect('/users/profile/'+ user.id)
    }



    async showLoginPage({ request, response, view, auth }) {
        try {
            await auth.check()
        } catch (error) {
            return view.render('users.login')
        }
    }


    // 88                                 88              
    // 88                                 ""              
    // 88                                                 
    // 88          ,adPPYba,   ,adPPYb,d8 88 8b,dPPYba,   
    // 88         a8"     "8a a8"    `Y88 88 88P'   `"8a  
    // 88         8b       d8 8b       88 88 88       88  
    // 88         "8a,   ,a8" "8a,   ,d88 88 88       88  
    // 88888888888 `"YbbdP"'   `"YbbdP"Y8 88 88       88  
    //                         aa,    ,88                 
    //                          "Y8bbdP"                  

    async login({ request, response, session, auth, view }) {

        const { email, password } = request.all()
        try {
            await auth.attempt(email, password)
            return response.redirect('/users/profile/' + auth.user.id)
        } catch (error) {
            session.flash({ notification: error.message })
            return response.redirect('/users/login')
        }
    }


    // 88                                                                  
    // 88                                                           ,d     
    // 88                                                           88     
    // 88          ,adPPYba,   ,adPPYb,d8  ,adPPYba,  88       88 MM88MMM  
    // 88         a8"     "8a a8"    `Y88 a8"     "8a 88       88   88     
    // 88         8b       d8 8b       88 8b       d8 88       88   88     
    // 88         "8a,   ,a8" "8a,   ,d88 "8a,   ,a8" "8a,   ,a88   88,    
    // 88888888888 `"YbbdP"'   `"YbbdP"Y8  `"YbbdP"'   `"YbbdP'Y8   "Y888  
    //                         aa,    ,88                                  
    //                          "Y8bbdP"       

    async logout({ request, response, auth }) {
        await auth.logout()
        return response.redirect('/users/login')
    }


    // 88        88                      88                               
    // 88        88                      88              ,d               
    // 88        88                      88              88               
    // 88        88 8b,dPPYba,   ,adPPYb,88 ,adPPYYba, MM88MMM ,adPPYba,  
    // 88        88 88P'    "8a a8"    `Y88 ""     `Y8   88   a8P_____88  
    // 88        88 88       d8 8b       88 ,adPPPPP88   88   8PP"""""""  
    // Y8a.    .a8P 88b,   ,a8" "8a,   ,d88 88,    ,88   88,  "8b,   ,aa  
    //  `"Y8888Y"'  88`YbbdP"'   `"8bbdP"Y8 `"8bbdP"Y8   "Y888 `"Ybbd8"'  
    //              88                                                    
    //              88                                                  

    async update({ params, request, response, session }) {
        const user = await User.find(params.id)
        const hashedPassword = await Hash.make(request.input('password'))

        user.username = request.input('username')
        user.password = hashedPassword

        await user.save()

        session.flash({ notification: 'User updated!' })

        return response.redirect('/users/profile/' + user.id)


    }



}

module.exports = UserController
