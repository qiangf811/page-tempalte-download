export default {
  fileDownload (response) {
    let contentType = response.headers['content-type']
    let blob = new Blob([response.data], { type: contentType })
    let fileName = response.config['fileName'] || response.headers['content-disposition'].split('=')[1]
    fileName = fileName.replace(/\"/g, '')
    let blobUrl = window.URL.createObjectURL(blob)
    let eleLink = document.createElement('a')
    eleLink.style.display = 'none'
    eleLink.href = blobUrl
    if (fileName) eleLink.download = fileName
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
    window.URL.revokeObjectURL(blobUrl)
  }
}
