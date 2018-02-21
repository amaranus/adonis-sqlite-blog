'use strict'

// Modeli çağır
const Post = use('App/Models/Post')

// Validatorü çağır
const { validate } = use('Validator')

class PostController {
    // Sadece değer döndürme fonks.
    // async index () {
    //     return 'Posts'
    // }

    // Sadece View döndürme fonks.
    // async index({ view }) {
    //     return view.render('posts.index')
    // }

    // View döndürme ayrıca değer paslama
    async home({ view, auth }) {
        return view.render('home', {
            user: auth.user
        })
    }

    async index({ view, auth, response, params }) {
        // Elle data örneği
        // const posts = [
        //     { title: 'Post one', body: 'This is post one' },
        //     { title: 'Post two', body: 'This is post two' },
        //     { title: 'Post three', body: 'This is post three' }
        // ]

        // SQLite ile data örneği

        // const posts = await Post.all()

        const page = params.page
        const limit = 2
        const posts = await Post.query().paginate(page, limit)
        const lastPage = (posts.toJSON()).lastPage
        const pages = []

        for (var i = 1; i < lastPage + 1; i++) {
            pages.push(i)
        }

        return view.render('posts.index', {
            title: page,
            // Elle data ile
            // posts: posts
            // SQLite ile toJSON() yazılmazsa undefined olur
            posts: ((posts.toJSON()).data),
            pages: pages,
            page:page,
            user: auth.user
        })
    }


    // Post detay sayfasını aç
    async details({ params, view, auth }) {
        const post = await Post.find(params.id)
        return view.render('posts.details', {
            post: post,
            user: auth.user
        })
    }

    // Kayıt ekleme sayfasını aç
    async add({ request, response, view, auth }) {
        try {
            await auth.check()
            return view.render('posts.add', {
                user: auth.user
            })
        } catch (error) {
            return response.redirect('/users/login')
        }
    }

    // Kayıt ekleme fonks.
    async store({ request, response, session, auth, params }) {
        // Girişi validate et
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }


        const post = new Post()

        post.title = request.input('title')
        post.body = request.input('body')
        post.author = auth.user.username

        await post.save()

        session.flash({ notification: 'Post added!' })

        return response.redirect('/posts/page/1')
    }

    // Kayıt editleme görüntüle
    async edit({ params, view, auth }) {
        const post = await Post.find(params.id)

        return view.render('posts.edit', {
            post: post,
            user: auth.user
        })
    }

    async update({ params, request, response, session, auth }) {
        // Girişi validate et
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }

        const post = await Post.find(params.id)

        post.title = request.input('title')
        post.body = request.input('body')
        post.author = auth.user.username

        await post.save()

        session.flash({ notification: 'Post updated!' })

        return response.redirect('back')


    }

    async destroy({ params, session, response }) {
        const post = await Post.find(params.id)

        await post.delete()

        session.flash({ notification: 'Post deleted!' })

        return response.redirect('/posts/page/1')
        

    }

}

module.exports = PostController
