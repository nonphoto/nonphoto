const fs = require('fs')
const path = require('path')

const layoutsDirname = path.resolve(__dirname, 'assets/layouts')
const pagesDirname = path.resolve(__dirname, 'assets/pages')

const layoutPaths = fs.readdirSync(layoutsDirname)
const pagePaths = fs.readdirSync(pagesDirname)

const pages = pagePaths.map((pagePath) => {
    const readPath = path.resolve(pagesDirname, pagePath)
    return fs.readFileSync(readPath)
})

const layouts = layoutPaths.map((layoutPath) => {
    const readPath = path.resolve(layoutsDirname, layoutPath)
    return fs.readFileSync(readPath)
})

console.log(layouts.toString())