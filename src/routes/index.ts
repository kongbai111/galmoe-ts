import * as Router from 'koa-router'
// import {getUserInfo} from '../controllers/user'
import * as user from './user'
import * as upload from './upload'
import * as captcha from './captcha'
import * as session from './session'
import * as post from './post'
import * as publish from './publish'
import * as comment from './comment'
import * as reply from './reply'
import * as img from './img'


const router = new Router({
  prefix: '/api'
})

router.get('/', async (ctx) => {
  ctx.throw(403, '403 Forbidden')
});


router.use(user.routes())
router.use(upload.routes())
router.use(captcha.routes())
router.use(session.routes())
router.use(post.routes())
router.use(publish.routes())
router.use(comment.routes())
router.use(reply.routes())
router.use(img.routes())

// router.use(user)
// router.use(user.routes(), user.allowedMethods())

export = router
