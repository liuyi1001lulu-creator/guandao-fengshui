async function renderLesson03(){
 const body=document.querySelector("#detailBody");
 const escText=(value)=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const formatInline=(value)=>escText(value).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>");
 body.innerHTML="<div class='detailcat'>课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><p>正在读取第三课课堂笔记……</p>";
 try{
  const response=await fetch("./courses/lesson03-notes.md?v=20261124-course-visuals");
  if(!response.ok)throw new Error("课堂笔记读取失败，状态码："+response.status);
  const markdown=await response.text();
  const lines=markdown.replaceAll("\r","").split("\n");
  const sections=[];
  let current=null;
  let listItems=[];
  const flushList=()=>{
   if(current&&listItems.length){
    current.html+="<ul class='lesson03-list'>"+listItems.map(item=>"<li>"+formatInline(item)+"</li>").join("")+"</ul>";
    listItems=[];
   }
  };
  const tableCells=(line)=>line.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(cell=>cell.trim());
  const isTableRule=(line)=>/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  for(let i=0;i<lines.length;i++){
   const line=lines[i];
   if(line.startsWith("## ")){
    flushList();
    current={title:line.slice(3).trim(),html:""};
    sections.push(current);
   }else if(current&&!line.startsWith("# ")){
    const figure=line.match(/^!\[([^\]]+)\]\(\.\.\/images\/(lesson03-[a-z-]+)\.svg\)$/);
    if(figure){flushList();current.html+=guandaoCourseFigure(figure[2]);continue;}
    if(line.startsWith("### ")){
     flushList();
     current.html+="<h3>"+formatInline(line.slice(4))+"</h3>";
    }else if(line.trim().startsWith("|")&&i+1<lines.length&&isTableRule(lines[i+1])){
     flushList();
     const headers=tableCells(line);
     i+=2;
     const rows=[];
     while(i<lines.length&&lines[i].trim().startsWith("|")){
      rows.push(tableCells(lines[i]));
      i++;
     }
     i--;
     current.html+="<div class='lesson03-table-wrap'><table class='lesson03-table'><thead><tr>"+headers.map(cell=>"<th>"+formatInline(cell)+"</th>").join("")+"</tr></thead><tbody>"+rows.map(row=>"<tr>"+headers.map((_,index)=>"<td>"+formatInline(row[index]||"")+"</td>").join("")+"</tr>").join("")+"</tbody></table></div>";
    }else if(/^\s*[-*]\s+/.test(line)){
     listItems.push(line.replace(/^\s*[-*]\s+/,"").trim());
    }else if(!line.trim()){
     flushList();
    }else{
     flushList();
     current.html+="<p>"+formatInline(line.trim())+"</p>";
    }
   }
  }
  flushList();
  if(!sections.length)throw new Error("已读取文件，但没有识别到章节标题");
  const nav=sections.map((item,index)=>"<button type='button' data-lesson03-part='"+index+"'><b>"+String(index+1).padStart(2,"0")+"</b><span>"+escText(item.title)+"</span></button>").join("");
  const content=sections.map((item,index)=>"<details class='lesson-part' id='lesson03-part-"+index+"'><summary><span class='lesson-part-title'>"+escText(item.title)+"</span><span class='lesson-part-summary'>第"+(index+1)+"部分</span></summary><div class='lesson-part-body reader-text'>"+item.html+"</div></details>").join("");
  body.innerHTML="<div class='detailcat'>课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><div class='summary'>依据第三课完整课堂笔记整理，按原始章节展开阅读。原版幕布导图与文字课堂笔记并列保留。</div><figure class='lesson-figure lesson-original-map lesson03-image-frame'><figcaption>原版幕布导图 · 第三课《天干地支与五行运行规律》</figcaption><div class='lesson-figure-note'>保留幕布原版结构 · 点击图片可放大查看</div><a class='lesson03-image-link' href='./images/lesson03-original-mindmap.jpg' target='_blank' rel='noopener'><img src='./images/lesson03-original-mindmap.jpg' alt='第三课原版幕布导图' loading='lazy' decoding='async' style='display:block;width:100%;height:auto;max-height:none;object-fit:contain'></a></figure><div class='lesson03-download'><a href='./courses/lesson03-original.opml' download>下载原始幕布 OPML 文件</a><a href='./courses/lesson03-notes.md' download>下载完整课堂笔记 Markdown</a></div><section class='lesson-framework'><h2>本课知识章节（"+sections.length+"部分）</h2><nav class='lesson03-map-grid'>"+nav+"</nav><div class='lesson-parts'>"+content+"</div></section>";
  body.querySelectorAll("[data-lesson03-part]").forEach((button)=>{
   button.addEventListener("click",()=>{
    const target=document.getElementById("lesson03-part-"+button.dataset.lesson03Part);
    if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});}
   });
  });
 }catch(error){
  body.innerHTML="<div class='detailcat'>课程档案 · 第三课</div><h1>第三课｜天干地支与五行运行规律</h1><p>课程资料加载失败："+escText(error.message)+"</p>";
 }
}