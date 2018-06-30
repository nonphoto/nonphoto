const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

const pagesDirname = path.resolve(__dirname, 'assets/pages')

function read(filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath)).toString()
}

function evaluate(filePath) {
    const file = read(filePath)
    return template(file)({ evaluate })
}

const templateString = read('assets/template.html')

const pages = fs.readdirSync(pagesDirname).map(pagePath => {
    const content = evaluate(path.resolve(pagesDirname, pagePath))
    return template(templateString)({ content })
})

for (let page of pages) {
    console.log(page)
}
