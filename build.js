const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

function read(filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath)).toString()
}

function evaluate(filePath) {
    const file = read(filePath)
    return template(file)({ evaluate })
}

function build(src, dest) {
    const content = evaluate(path.resolve(__dirname, src))
    const page = template(templateString)({ content })
    fs.writeFileSync(path.resolve(__dirname, dest), page)
}

if (!fs.existsSync('pages')){
    fs.mkdirSync('pages')
}

const templateString = read('assets/template.html')
const pagePaths = fs.readdirSync(path.resolve(__dirname, 'assets/pages'))

for (let pagePath of pagePaths) {
    build('assets/pages/' + pagePath, 'pages/' + pagePath)
}

build('assets/index.html', 'index.html')
