const http = require('http')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

async function fetchGithubAddress() {
  return new Promise((resolve, reject) => {
    http.get('http://react-component.github.io/badgeboard/', res => {
      let receives = [];

      res.on('data', function (chunk) {
        receives.push(chunk)
      })

      try {
        res.on('end', function () {
          let resData = Buffer.concat(receives).toString()

          // 类jq用法
          let $ = cheerio.load(resData)
          // 拿到项目table的所有tr
          const trs = $('.table.sortable.table-striped.projects-table tbody').children();
          let hrefArray = [];
          // 拿到tr的所有a标签的链接
          trs.each((index, item) => {
            hrefArray.push(item.childNodes[1].children[0].attribs.href);
          })
          resolve(hrefArray)
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

fetchGithubAddress().then((res) => {
  // 写入txt，等待被轮询clone
  fs.writeFile(path.join(__dirname, 'test.txt'), res.join('\n'), err => {
    console.log(err);
  })
})