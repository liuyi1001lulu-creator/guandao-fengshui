const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = process.cwd();
const port = 43157;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
  const uri=decodeURIComponent((req.url||'/').split('?')[0]);
  let file=path.resolve(root,'.'+(uri==='/'?'/index.html':uri));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
async function check(){
  await new Promise((resolve,reject)=>server.listen(port,'127.0.0.1',resolve).once('error',reject));
  const browser=await chromium.launch({headless:true});
  const reports=[];const issues=[];
  try{
    for(const device of [{name:'desktop',viewport:{width:1440,height:920},isMobile:false},{name:'mobile',viewport:{width:390,height:844},isMobile:true}]){
      const page=await browser.newPage({viewport:device.viewport,isMobile:device.isMobile,deviceScaleFactor:1});
      const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      page.on('console',msg=>{if(msg.type()==='error')errors.push('console: '+msg.text())});
      await page.goto('http://127.0.0.1:'+port+'/index.html',{waitUntil:'load'});
      await page.locator('#homeCards [data-home]').first().waitFor({state:'visible'});
      let sectionChecks=[];
      const clickNav=async id=>{
        if(device.isMobile){await page.locator('#menuBtn').click();await page.locator('#layout').waitFor({state:'attached'});if(id==='foundation')await page.screenshot({path:'artifacts/mobile-navigation.png',fullPage:false});}
        await page.locator('#nav [data-view="'+id+'"]').click();
        await page.locator('#view-'+id).waitFor({state:'visible'});
      };
      for(const v of ['foundation','branches','bagua','schools','yangzhai']){
        await clickNav(v);
        if(v==='foundation'){
          assert(await page.locator('#foundationCourseFeature').isVisible(),'lesson 2 framework feature missing');
          assert(await page.locator('#foundationCards [data-note]').count()===0,'lesson 2 should not be split into separate cards');
          await page.locator('#searchFoundation').fill('火克金');
          assert(await page.locator('#foundationCourseFeature').isVisible(),'foundation search should find full lesson 2 content');
          await page.locator('#searchFoundation').fill('绝无此词');
          assert(await page.locator('#foundationCourseFeature').isHidden(),'foundation search should hide unrelated lesson 2 feature');
          await page.locator('#searchFoundation').fill('');
          assert(await page.locator('#foundationCourseFeature').isVisible(),'lesson 2 feature should return after clearing search');
          await page.locator('#foundationCourseFeature [data-open-course="02"]').click();
          assert(await page.locator('#detailBody .lesson-part').count()===5,'lesson 2 should have five top-level parts');
          assert(await page.locator('#detailBody .lesson-subtopic-major').count()===3,'five-elements section should group three major chapters');
          const lessonText=await page.locator('#detailBody').evaluate(el=>el.textContent);
          assert(lessonText.includes('克不一定是毁灭，也可以是磨炼和修炼'),'original overcoming explanation missing');
          assert(lessonText.includes('体现制约的力量'),'metal-overcomes-wood explanation missing');
          assert(lessonText.includes('整个太极图的全部构成就是土'),'soil classroom note missing');
          await page.locator('#lesson-part-4 > summary').click();
          assert(await page.locator('#lesson-part-4').evaluate(el=>el.open),'five-elements accordion did not expand');
          await page.locator('#back').click();
          sectionChecks.push({module:v,cards:1,lessonFramework:true});
          continue;
        }
        const count=await page.locator('#'+v+'Cards [data-note]').count();
        assert(count>0,'empty module '+v);sectionChecks.push({module:v,cards:count});
        const ids=await page.locator('#'+v+'Cards [data-note]').evaluateAll(els=>els.map(e=>e.dataset.note));
        for(const id of ids){
          await page.locator('#'+v+'Cards [data-note="'+id+'"]').click();
          await page.locator('#overlay').waitFor({state:'visible'});
          assert(await page.locator('#detailBody .reader-text').count()===1,'no full article: '+id);
          await page.locator('#back').click();
        }
      }
      await clickNav('branches');
      await page.locator('#searchBranches').fill('虚日鼠');
      assert(await page.locator('#branchesCards [data-note="b9"]').count()===1,'branch search failed');
      await page.locator('#searchBranches').fill('');
      await page.locator('#branchesCards [data-note="b6"]').click();
      await page.locator('#overlay').waitFor({state:'visible'});
      assert(await page.locator('#detailBody .gd-life-grid details').count()===8,'8 longlife groups missing');
      assert((await page.locator('#detailBody .gd-visuals .gd-detail').count())===9,'matrix summary missing');
      assert(await page.locator('#detailBody .reader-text').count()===1,'article missing');
      await page.screenshot({path:'artifacts/'+device.name+'-longlife.png',fullPage:false});
      await page.locator('#back').click();
      await clickNav('bagua');
      await page.locator('#baguaCards [data-note="f4"]').click();
      assert(await page.locator('#detailBody .gd-visuals > .gd-detail').count()===9,'nine trigram charts missing');
      await page.locator('#detailBody .gd-visuals > .gd-detail').first().click();
      await page.screenshot({path:'artifacts/'+device.name+'-bagua.png',fullPage:false});
      await page.locator('#back').click();
      await page.locator('#view-bagua [data-full-module="bagua"]').click();
      assert(await page.locator('#detailBody .chapter-toc button').count()===10,'bagua chapter nav missing');
      await page.locator('#detailBody .chapter-toc button').nth(4).click();
      assert(await page.locator('#detailBody .reader-text h3').count()>=9,'full bagua tutorial missing');
      const metrics=await page.evaluate(()=>({
        width:window.innerWidth,
        scrollWidth:document.documentElement.scrollWidth,
        dialogWidth:document.querySelector('.detail').getBoundingClientRect().width,
        bodyWidth:document.querySelector('#detailBody').getBoundingClientRect().width,
        tableScroller:!!document.querySelector('#detailBody .reader-table-wrap')
      }));
      if(metrics.scrollWidth>metrics.width+2)issues.push(device.name+' horizontal body overflow '+JSON.stringify(metrics));
      await page.locator('#back').click();
      await clickNav('glossary');
      await page.locator('#searchGlossary').fill('河图');
      assert(await page.locator('#glossaryCards [data-note="f2"]').count()===1,'glossary search failed');
      await clickNav('branches');
      const firstCard=page.locator('#branchesCards [data-note]').first();
      await firstCard.focus();await page.keyboard.press('Enter');
      assert(await page.locator('#overlay').isVisible(),'keyboard cannot open knowledge card');
      await page.locator('#back').click();
      await clickNav('courses');
      const lesson5=page.locator('[data-course="05"]');
      await lesson5.click();assert(await page.locator('#detailBody [data-note]').count()===6,'lesson 5 linked cards missing');await page.locator('#back').click();
      for(const n of ['02','03','05','06','07','08','09','10']){
        await page.locator('[data-course="'+n+'"]').click();
        await page.locator('#detailBody .lesson-part').first().waitFor({state:'attached'});
        const figs=page.locator('#detailBody .lesson10-figure img');
        assert(await figs.count()>0,'illustrations missing for lesson '+n);
        const sources=await figs.evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));
        for(const source of sources){const res=await page.request.get(new URL(source,page.url()).href);assert(res.ok(),'broken diagram: '+source);assert((await res.text()).includes('<svg'),'non-SVG diagram: '+source);}
        await page.locator('#back').click();
      }
      if(errors.length)issues.push(device.name+' browser errors: '+errors.join(' | '));
      const report={device:device.name,sectionChecks,clickedCards:sectionChecks.reduce((n,x)=>n+x.cards,0),longlifeGroups:8,baguaCharts:9,baguaChapters:10,lesson5Cards:6,lesson2Framework:true,lesson2TopLevelParts:5,lesson2OvercomingText:true,glossarySearch:'河图',keyboardCardOpen:true,metrics,errors};
      reports.push(report);
      await page.close();
    }
    fs.mkdirSync('artifacts',{recursive:true});
    const final={status:issues.length?'FAIL':'PASS',reports,issues};
    fs.writeFileSync('artifacts/browser-report.json',JSON.stringify(final,null,2));
    console.log('GUANDAO_BROWSER_RESULT '+JSON.stringify(final));
    if(issues.length)process.exitCode=1;
  }finally{await browser.close();server.close();}
}
fs.mkdirSync('artifacts',{recursive:true});
check().catch(err=>{console.error('GUANDAO_BROWSER_FATAL',err.stack||err);process.exitCode=1;server.close()});
