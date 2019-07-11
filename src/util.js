export const getExtension = filename => {
    let i = filename.lastIndexOf('.')
    if (i === -1) {
        return null
    } else {
        return filename.slice(i + 1)
    }
}

export const splitExtension = filename=>{
    let i = filename.lastIndexOf('.')
    if (i === -1) {
        return null
    } else {
        return filename.slice(0, i)
    }
}

export const fileType = {
    isPdf: ext => ext === 'pdf',
    isImg: ext => /(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(ext),
    isExcel: ext => /(xls)$/.test(ext),
    isMarkdown: ext => /(md)$/.test(ext),
    isTxt: ext => /(txt)$/.test(ext),
    isWord: ext => /(doc|docx)$/.test(ext),
    isZip: ext => /(zip|rar)$/.test(ext),
    isPpt: ext => /(ppt)$/.test(ext),
}