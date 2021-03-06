import * as fs from 'fs'
import * as path from 'path'
import * as gm from 'gm'
import { Context } from 'koa'
import { host } from '../../config'
import * as Upload from '../models/mysql/Upload'
import { saveAvatar, saveBackground } from '../models/mysql/Session'
import { randomMd5 } from '../../lib/md5'
import { getFileSize } from '../utils/util'
import { fileInfoF } from "../server"
import * as Promise from 'bluebird'


// file upload test
export const getPage = async (ctx: Context) => {
  const html = `
      <h1>koa2 upload demo</h1>
      <form method="POST" action="/api/upload" enctype="multipart/form-data">
        <p>file upload</p>
        <input name="file" type="file" multiple /><br/><br/>
        <button type="submit">submit</button>
      </form>
    `
  ctx.body = html
}

const saveWebp = function (fname: string) {
  return new Promise(function (resolve, reject) {
    gm(`/data/github/galmoe/galmoe-ts/public/images/${fname}`)
      .write(`/data/github/galmoe/galmoe-ts/public/images/${fname}.webp`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve()
        }
      })
  })
}

export const uploadFile = async (ctx: Context) => {
  // console.log(' ctx.request.files',  ctx.request.files)
  const { uid } = ctx.state
  const fileInfo = fileInfoF()
  // const  file  = ctx.request.files.File           // 获取上传文件
  // const reader = fs.createReadStream(file.path) // 创建可读流
  // const sizeSimple = bytesToSize(file.size)   // 文件大小
  // let ext = file.name.split('.').pop()        // 获取上传文件扩展名
  // // 过滤blob, 设为webp
  // if (ext === 'blob') {
  //   ext = 'webp'
  // }
  // console.log('sizeSimple：', sizeSimple)
  // const hash = randomMd5()
  // const fileName = `${hash}.${ext}`
  // // 创建可写流
  // const upStream = fs.createWriteStream(path.join(__dirname, `../../public/files/${fileName}`))
  // // 可读流通过管道写入可写流
  // reader.pipe(upStream)
  // // 直接删除temp
  // await fs.unlink(file.path, (err: any) => {
  //   if (err) {
  //     console.log(err)
  //   }
  // })
  // const
  // 写入mysql
  // fs.createReadStream(`${fileInfo.dir}/${fileInfo.hash}`).pipe(fs.createWriteStream(`${fileInfo.dir}/${fileInfo.fname}`));
  let fileObj = {...fileInfo, uid, size: getFileSize(`${fileInfo.dir}/${fileInfo.fname}`)}
  await Upload.saveFileInfo(fileObj).catch(error => {
    return ctx.body = {
      type: 'error',
      msg: '上传失败'
    }
  })
  const { fname } = fileInfo
  // 存储webp
  const src = `${host}/${fname}.webp`
  await saveWebp(fname)
  if (ctx.request.body.type === 'avatar') {
    await saveAvatar(uid, src)
  }
  if (ctx.request.body.type === 'background') {
    await saveBackground(uid, src)
  }
  ctx.body = {
    type: 'success',
    msg: '上传成功',
    src
  }
}
