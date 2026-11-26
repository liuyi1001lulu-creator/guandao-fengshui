async function renderLesson11(){
 const body=document.querySelector("#detailBody");
 const escText=(v)=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const inline=(v)=>escText(v).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
 const cells=(line)=>line.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(x=>x.trim());
 const rule=(line)=>/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
 body.innerHTML="<div class='detailcat'>课程档案 · 第十一课</div><h1>第十一课｜五鬼、祸害、六煞磁场与应期调和</h1><p>正在读取第十一课课堂资料……</p>";
 try{
  const res=await fetch("./courses/lesson11-notes.md?v=20261126-confirmed");
  if(!res.ok)throw new Error("课堂笔记读取失败，状态码："+res.status);
  const lines=(await res.text()).replaceAll("\r","").split("\n");
  const parts=[];let current=null,html="",list=[];
  const flush=()=>{if(list.length){html+="<ul>"+list.map(x=>"<li>"+inline(x)+"</li>").join("")+"</ul>";list=[];}};
  for(let i=0;i<lines.length;i++){
   const line=lines[i];
   if(line.startsWith("## ")){flush();if(current)current.html=html;current={title:line.slice(3).trim(),html:""};parts.push(current);html="";continue;}
   if(!current)continue;
   const figure=line.match(/^!\[([^\]]+)\]\(\.\.\/images\/(lesson11-[a-z-]+\.svg)\)$/);
   if(figure){flush();const src="images/"+figure[2]+"?v=20261126-confirmed";const label=escText(figure[1]);html+="<figure class='lesson10-figure'><a href='"+src+"' target='_blank' rel='noopener'><img src='"+src+"' alt='"+label+"' loading='lazy' decoding='async'></a><figcaption>"+label+" · 点击放大</figcaption></figure>";continue;}
   if(line.startsWith("### ")){flush();html+="<h4>"+inline(line.slice(4).trim())+"</h4>";continue;}
   if(line.trim().startsWith("|")&&i+1<lines.length&&rule(lines[i+1])){
    flush();const heads=cells(line);i+=2;const rows=[];
    while(i<lines.length&&lines[i].trim().startsWith("|")){rows.push(cells(lines[i]));i++;}
    i--;html+="<div class='lesson03-table-wrap'><table class='lesson03-table'><thead><tr>"+heads.map(x=>"<th>"+inline(x)+"</th>").join("")+"</tr></thead><tbody>"+rows.map(row=>"<tr>"+heads.map((_,j)=>"<td>"+inline(row[j]||"")+"</td>").join("")+"</tr>").join("")+"</tbody></table></div>";continue;
   }
   if(/^\s*[-*]\s+/.test(line)){list.push(line.replace(/^\s*[-*]\s+/,"").trim());continue;}
   if(!line.trim()){flush();continue;}
   flush();if(line.startsWith("> "))html+="<blockquote><p>"+inline(line.slice(2))+"</p></blockquote>";else if(!line.startsWith("# "))html+="<p>"+inline(line.trim())+"</p>";
  }
  flush();if(current)current.html=html;
  if(!parts.length)throw new Error("没有识别到章节标题");
  const nav=parts.map((p,i)=>"<button type='button' data-lesson11-part='"+i+"'><b>"+String(i+1).padStart(2,"0")+"</b><span>"+escText(p.title)+"</span></button>").join("");
  const content=parts.map((p,i)=>"<details class='lesson-part' id='lesson11-part-"+i+"'><summary><span class='lesson-part-title'>"+escText(p.title)+"</span><span class='lesson-part-summary'>第"+(i+1)+"部分</span></summary><div class='lesson-part-body reader-text'>"+p.html+"</div></details>").join("");
  body.innerHTML="<div class='detailcat'>课程档案 · 第十一课</div><h1>第十一课｜五鬼、祸害、六煞磁场与应期调和</h1><div class='summary'>五鬼、祸害、六煞的天地人取象，相位与理法应期，磁场主动运用及大场、小场、人场的处理。 按章节展开，待核内容单独标注。</div><section class='lesson-framework'><h2>重点复习 · 课后作业</h2><nav class='lesson03-map-grid'><button type='button' data-lesson11-part='12'><b>01</b><span>八大磁场完整知识树</span></button><button type='button' data-lesson11-part='13'><b>02</b><span>应期判断与七星运用</span></button></nav><h2>本课知识章节（"+parts.length+"部分）</h2><nav class='lesson03-map-grid'>"+nav+"</nav><div class='lesson-parts'>"+content+"</div></section><div class='source'>资料来源：第十一课当天听课笔记与课堂截图整理稿（2026-11-26）；课后作业综合第九至十一课及第六课星曜对应资料。课堂观点与待核内容按原始记录保留，不将未核实解释写成定论。</div>";
  body.querySelectorAll("[data-lesson11-part]").forEach(button=>button.addEventListener("click",()=>{const target=document.getElementById("lesson11-part-"+button.dataset.lesson11Part);if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});}}));
 }catch(e){body.innerHTML="<div class='detailcat'>课程档案 · 第十一课</div><h1>第十一课｜五鬼、祸害、六煞磁场与应期调和</h1><p>课程资料加载失败："+escText(e.message)+"</p>";}
}