const vscode = require('vscode')
// const path = require('path')
const fs = require('fs')
const util = require('./util')

function provideDefinition(document, position, token) {
  const fileName = document.fileName
  // const workDir = path.dirname(fileName)
  const word = document.getText(document.getWordRangeAtPosition(position))
  // const line = document.lineAt(position)
  const projectPath = util.getProjectPath(document)
  if (/\.vue$/.test(fileName)) {
    var fileList = util.getAllFiles(`${projectPath}/api`)
    var destPath = null
    var pos = null
    fileList.forEach(filename => {
      let data = destPath?'': fs.readFileSync(filename, 'utf8')
      if (new RegExp(`${word}`).test(data)) {
        destPath = filename
        let tIndex = data.search(new RegExp(`${word}`))
        let tData = data.slice(0, tIndex)
        pos = tData.match(/\n/ig).length
      }
    })
    if (fs.existsSync(destPath)) {
      return new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(pos, 2))
    }
  }
}

module.exports = function (context) {
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(['vue'], {
    provideDefinition
  }))
}