const puppeteer = require('puppeteer');

const url = 'http://oabt004.com/index/index/cid/25/p/1';

const timeOut = time => new Promise(res=>{
    setTimeout(res,time)
});

(async ()=> {
    console.log('=====start=====')
    
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'networkidle2'});

    await timeOut(3000)

    await page.waitForSelector('a[aria-label="Next"]')

    // for(let i = 0 ; i<1;i++){
    //     await timeOut(3000)
        
    //     await page.click('a[aria-label="Next"]')
    // }

    console.log('=====evaluate=====')

    const res = await page.evaluate(()=>{
        // var $ = window.$
        // var listTitle = document.querySelectorAll('.link-list-wrapper .link-list-title')
        var list =  document.querySelectorAll('.link-list-wrapper .link-list')
        var dataArr = []
        
        list.forEach((item)=>{
            // var it = $(item)
            item.querySelectorAll('li[data-id]').forEach((items)=>{

              var MAG =   items.getAttribute('data-magnet')
            //   console.log(MAG)
              dataArr.push({
                  MAG,
              })

            })

        }) 
        console.log(dataArr)
        return dataArr
    })

    console.log(res)
     browser.close()

})()