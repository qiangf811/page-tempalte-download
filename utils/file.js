const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')
const archiver = require('archiver')
const testData = require('../data.json')

const TEMPLATE_FILE_PATH = '/template/' // 模板文件夹路径
const TEMP_DOWNLOA_DPATH = '/temp_download/' // 根据模板和页面数据渲染出的文件存放路径
const DOWNLOAD_PATH = '/downLoad/' // 压缩包文件路径
const resolvePath = dir => path.join(__dirname, '../', dir)

class File {
  /**
   * 渲染模板并输出到新文件
   * @param {Object} data
   */
  static renderTemplateFile (data = testData) {
    const fileName = data.fileName
    const template = fs.readFileSync(resolvePath(TEMPLATE_FILE_PATH + 'index.vue'), 'utf-8')
    const page = Mustache.render(template, data, {}, ['<%', '%>'])
    const dataFilePath = resolvePath(TEMP_DOWNLOA_DPATH + fileName)
    !fs.existsSync(dataFilePath) && fs.mkdirSync(dataFilePath)
    fs.writeFileSync(dataFilePath + '/' + fileName + '.vue', page, 'utf-8')
    return { dataFilePath, fileName }
  }
  /**
   * 添加zip压缩包
   * @param {String} fileName
   */
  static addZip (dataFilePath, fileName) {
    return new Promise((resolve, reject) => {
      const outputPath = resolvePath(DOWNLOAD_PATH + fileName + '.zip')
      const output = fs.createWriteStream(outputPath)
      const archive = archiver('zip', {
        zlib: {
          level: 9
        }
      })
      output.on('close', () => {
        resolve(outputPath)
      })
      archive.on('error', err => {
        reject(err)
      })
      archive.pipe(output)
      // 压缩指定的文件夹
      archive.directory(dataFilePath, false)
      archive.finalize()
    })
  }

  static async generateZip (data = testData) {
    try {
      const { dataFilePath, fileName } = this.renderTemplateFile(data)
      const zipPath = await this.addZips(dataFilePath, fileName)
      return zipPath
    } catch (error) {
      throw Error(error)
    }
  }
}

module.exports = File
