import { dbquery } from '../../db/mysql'

interface File {
  fname: string,
  uid: number,
  size: string,
  type: string
}

export const saveInfo = async (file: File) => {
  let _sql = `INSERT INTO upload (fname, uid, date, size, type) VALUES ('${file.fname}', ${file.uid}, NOW(), '${file.size}', '${file.type}')`
  return dbquery(_sql)
}
