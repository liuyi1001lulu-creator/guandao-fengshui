async function renderLesson03(){
 const body=document.querySelector("#detailBody");
 const escHtml=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const inline=value=>escHtml(value).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
 body.innerHTML='<div class="detailcat">课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><div class="lesson03-loading">正在载入第三课原始课堂笔记与幕布结构……</div>';
 try{
  const results=await Promise.all([
   fetch("courses/lesson03-notes.md").then(r=>{if(!r.ok)throw new Error("课堂笔记加载失败");return r.text();}),
   fetch("courses/lesson03-original.opml").then(r=>{if(!r.ok)throw new Error("幕布原始结构加载失败");return r.text();})
  ]);
  const markdown=results[0].replace(/^\uFEFF/,"");
  const opml=results[1];
  const sections=[];let current=null;
  markdown.split(/\r?\n/).forEach(line=>{
   if(/^##\s+/.test(line)){current={title:line.replace(/^##\s+/,"").trim(),lines:[]};sections.push(current);}
   else if(current&&!/^#\s+/.test(line))current.lines.push(line);
  });
  const renderBlocks=source=>{
   const lines=source.slice();let html="",i=0;
   while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}
    if(/^####?\s+/.test(line)){
     const level=(line.match(/^#+/)[0].length),tag=level===3?"h4":"h5";
     html+="<"+tag+">"+inline(line.replace(/^####?\s+/,"").trim())+"</"+tag+">";i++;continue;
    }
    if(/^\|/.test(line)&&i+1<lines.length&&/^\|?[\s\-:|]+\|?$/.test(lines[i+1])){
     const rows=[];
     while(i<lines.length&&/^\|/.test(lines[i])){rows.push(lines[i].split("|").slice(1,-1).map(cell=>cell.trim()));i++;}
     const head=rows.shift()||[];rows.shift();
     html+='<div class="reader-table-wrap"><table class="reader-table"><thead><tr>'+head.map(cell=>"<th>"+inline(cell)+"</th>").join("")+"</tr></thead><tbody>"+rows.map(row=>"<tr>"+head.map((_,j)=>"<td>"+inline(row[j]||"")+"</td>").join("")+"</tr>").join("")+"</tbody></table></div>';
     continue;
    }
    if(/^\s*[-*]\s+/.test(line)){
     const items=[];
     while(i<lines.length&&/^\s*[-*]\s+/.test(lines[i])){items.push(lines[i].replace(/^\s*[-*]\s+/,"").trim());i++;}
     html+="<ul>"+items.map(item=>"<li>"+inline(item)+"</li>").join("")+"</ul>";continue;
    }
    if(/^\s{2,}\S/.test(line)){html+="<p>"+inline(line.trim())+"</p>";i++;continue;}
    const paragraph=[line.trim()];i++;
    while(i<lines.length&&lines[i].trim()&&!/^#{2,4}\s+/.test(lines[i])&&!/^\s*[-*]\s+/.test(lines[i])&&!/^\|/.test(lines[i])){paragraph.push(lines[i].trim());i++;}
    html+="<p>"+inline(paragraph.join(" "))+"</p>";
   }
   return html;
  };
  const nav=sections.map((section,i)=>'<button type="button" data-lesson03-part="'+i+'"><b>'+(i+1<10?"0":"")+(i+1)+'</b><span>'+escHtml(section.title.replace(/^[一二三四五六七八九十]+、/,""))+'</span></button>').join("");
  const parts=sections.map((section,i)=>'<details class="lesson-part" id="lesson03-part-'+i+'"><summary><span class="lesson-part-title">'+escHtml(section.title)+'</span><span class="lesson-part-summary">第'+(i+1)+'部分</span></summary><div class="lesson-part-body reader-text">'+renderBlocks(section.lines)+'</div></details>').join("");
  const xml=new DOMParser().parseFromString(opml,"application/xml");
  if(xml.querySelector("parsererror"))throw new Error("幕布 OPML 格式无法读取");
  const root=xml.querySelector("body > outline");
  const drawOutline=node=>{
   const children=Array.from(node.children).filter(child=>child.tagName==="outline");
   const label=escHtml(node.getAttribute("text")||"");
   if(!children.length)return '<div class="outline-leaf">'+label+'</div>';
   return '<details><summary>'+label+'</summary>'+children.map(drawOutline).join("")+'</details>';
  };
  const outline=root?'<details class="lesson03-source-outline"><summary>原始幕布结构｜点击展开完整知识树</summary><div class="outline-root">'+Array.from(root.children).filter(child=>child.tagName==="outline").map(drawOutline).join("")+'</div></details>':"";
  body.innerHTML='<div class="detailcat">课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><div class="summary">从天干与地支的本质出发，认识五行生克、十天干与十二地支、地支藏干、天干五合，以及地支三会、三合、六合、六冲、相刑、六害与六破。</div><div class="lesson03-download"><a href="courses/lesson03-original.opml" download>下载原始幕布 OPML 文件</a><a href="courses/lesson03-notes.md" download>下载完整课堂笔记 Markdown</a></div>'+outline+'<section class="lesson-framework"><h2>本课十四个知识章节</h2><nav class="lesson03-map-grid" aria-label="第三课知识框架">'+nav+'</nav><div class="lesson-parts">'+parts+'</div><details class="lesson-appendix"><summary>资料来源与整理说明</summary><div class="reader-text"><p>依据第三课《天干地支与五行运行规律》完整课堂笔记及幕布导入版整理。保留课堂定义、关系组合、口诀性内容与判断框架。</p><p>本页不将其他课程或其他流派的解释混入第三课课堂内容；如需补充辨析，将单独标注来源。</p></div></details></section><div class="source">本课原始幕布结构与完整课堂笔记分别存档；可展开查看知识树，也可下载原始 OPML 文件导入幕布。</div>';
  body.querySelectorAll("[data-lesson03-part]").forEach(button=>button.onclick=()=>{
   const target=document.querySelector("#lesson03-part-"+button.dataset.lesson03Part);
   if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});}
  });
 }catch(error){
  body.innerHTML='<div class="detailcat">课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><p>课程资料暂时无法加载：'+escHtml(error.message)+'。请刷新页面后重试。</p>';
 }
}