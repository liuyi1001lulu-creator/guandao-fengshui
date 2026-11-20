/* 从《2026-09易理基础知识卡修订版》PPT第4/6/9/10页核对转录。
 * 传统课堂图表，仅供资料学习；有争议的中宫小字保持待核实。
 * 与 knowledge/03、04 的文字稿同步维护。 */
window.GUANDAO_DIAGRAMS=(function(){
const stage=["长生","沐浴","冠带","临官","帝旺","衰","病","死","墓","绝","胎","养"];
const groups=[
 {name:"甲木",type:"阳干",slide:9,branches:"亥 子 丑 寅 卯 辰 巳 午 未 申 酉 戌".split(" ")},
 {name:"丙火、戊土",type:"阳干",slide:9,branches:"寅 卯 辰 巳 午 未 申 酉 戌 亥 子 丑".split(" ")},
 {name:"庚金",type:"阳干",slide:9,branches:"巳 午 未 申 酉 戌 亥 子 丑 寅 卯 辰".split(" ")},
 {name:"壬水",type:"阳干",slide:9,branches:"申 酉 戌 亥 子 丑 寅 卯 辰 巳 午 未".split(" ")},
 {name:"乙木",type:"阴干",slide:10,branches:"午 巳 辰 卯 寅 丑 子 亥 戌 酉 申 未".split(" ")},
 {name:"丁火、己土",type:"阴干",slide:10,branches:"酉 申 未 午 巳 辰 卯 寅 丑 子 亥 戌".split(" ")},
 {name:"辛金",type:"阴干",slide:10,branches:"子 亥 戌 酉 申 未 午 巳 辰 卯 寅 丑".split(" ")},
 {name:"癸水",type:"阴干",slide:10,branches:"卯 寅 丑 子 亥 戌 酉 申 未 午 巳 辰".split(" ")}
];
const positions=["东南","正南","西南","正东","中央","正西","东北","正北","西北"];
const base=[["巽","离","坤"],["震","中宫","兑"],["艮","坎","乾"]];
const yin=["兑","乾","巽","离","体","坎","震","坤","艮"];
const yang=["巽","离","坤","震","用","兑","艮","坎","乾"];
const values={
 "八卦方位":["东南","南","西南","东","方位","西","东北","北","西北"],
 "四季":["","夏","","春","季节","秋","","冬",""],
 "家庭角色":["长女、大儿媳","二女儿","女主、老母亲","长子、壮年男子","阴阳（图中辅助文字）","小女儿","小儿子","二儿子","男主、老父亲"],
 "五行":["阴木","火","阴土","阳木","五行","阴金","阳土","水","阳金"],
 "洛书九宫数":["4","9","2","3","5","7","8","1","6"],
 "脏腑":["肝","心、小肠","胃","胆","脏腑","肺","脾","肾、膀胱","大肠"],
 "八卦性情":["入","丽","顺","动","八卦性情","说","止","陷","健"],
 "自然万物":["风","火","地","雷","万物类象","泽","山","水","天"],
 "身体及系统":["左上部；乳腺；神经内分泌系统","头部；血液","右上部；子宫；消化系统","手指；左胸；左臂","中宫小字待核","右胸；右臂；皮肤；口；呼吸系统","左腿脚；消化系统","腹部；泌尿；生殖系统","头；右腿脚"]
};
const mountains=["辰·巽·巳","丙·午·丁","未·坤·申","甲·卯·乙","戊·己（中宫）","庚·酉·辛","丑·艮·寅","壬·子·癸","戌·乾·亥"];
const hetu=[["南",7,2],["北",1,6],["东",3,8],["西",9,4],["中",5,10]];
const marks={1:"○",2:"●",3:"○",4:"●",5:"○",6:"●",7:"○",8:"●",9:"○"};
const e=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function nine(title,arr,withBagua=true){
 const cells=arr.map((v,i)=>'<div class="gd-nine-cell'+(i===4?' gd-center':'')+'"><small>'+e(positions[i])+(withBagua&&i!==4?' · '+e(base[Math.floor(i/3)][i%3]):'')+'</small><strong>'+e(v||"—")+'</strong></div>').join("");
 return '<div class="gd-chart"><div class="gd-chart-title">'+e(title)+'</div><div class="gd-nine-grid">'+cells+'</div></div>';
}
function life(){
 const cards=groups.map((g,i)=>'<details class="gd-detail"'+(i===0?' open':'')+'><summary>'+e(g.name)+' · '+g.type+' · '+g.branches[0]+'长生 <span>源：PPT第'+g.slide+'页</span></summary><div class="gd-table-scroll"><table class="gd-table"><thead><tr><th>阶段</th><th>地支</th></tr></thead><tbody>'+stage.map((p,j)=>'<tr><td>'+p+'</td><td>'+g.branches[j]+'</td></tr>').join('')+'</tbody></table></div></details>').join("");
 const matrix='<details class="gd-detail"><summary>八组长生十二态 · 横向总表 <span>96格已逐一核对</span></summary><div class="gd-table-scroll"><table class="gd-table"><thead><tr><th>阶段</th>'+groups.map(g=>'<th>'+e(g.name)+'</th>').join('')+'</tr></thead><tbody>'+stage.map((p,i)=>'<tr><th>'+p+'</th>'+groups.map(g=>'<td>'+g.branches[i]+'</td>').join('')+'</tr>').join('')+'</tbody></table></div></details>';
 return '<section class="gd-visuals"><h2>原始PPT核对后的长生十二态速查</h2><p class="gd-note">按第9页阳干图与第10页阴干图，八组共96个“阶段—地支”对应已逐格复核。展开各组查看，手机可纵向阅读；总表可以左右滑动。</p><div class="gd-life-grid">'+cards+'</div>'+matrix+'</section>';
}
function bagua(){
 return '<section class="gd-visuals"><h2>先天八卦 · 后天八卦</h2><p class="gd-note">严格按PPT第4页原始布局；传统方位图采用上南下北、左东右西。中宫的“体／用”按原图保留。</p><div class="gd-two">'+nine("先天八卦 · 体",yin,false)+nine("后天八卦 · 用",yang,false)+'</div></section>';
}
function river(){
 const pairs=hetu.map(x=>'<tr><td>'+x[0]+'</td><td><strong>○ '+x[1]+'</strong></td><td><strong>● '+x[2]+'</strong></td></tr>').join('');
 const luo=[4,9,2,3,5,7,8,1,6].map(v=>v+marks[v]);
 return '<section class="gd-visuals"><h2>河图洛书 · 图中数位速查</h2><p class="gd-note">原PPT第4页图例：○为阳、●为阴；采用上南下北、左东右西的展示方向。</p><div class="gd-two"><div class="gd-chart"><div class="gd-chart-title">河图：五方点数</div><div class="gd-table-scroll"><table class="gd-table"><thead><tr><th>方位</th><th>阳 ○</th><th>阴 ●</th></tr></thead><tbody>'+pairs+'</tbody></table></div></div>'+nine("洛书：九宫点数",luo,false)+'</div></section>';
}
function imagery(){
 const cards=Object.entries(values).map(([title,arr],i)=>'<details class="gd-detail"'+(i===4?' open':'')+'><summary>'+e(title)+' <span>课件第6页</span></summary>'+nine(title,arr)+'</details>').join("");
 return '<section class="gd-visuals"><h2>八卦象意 · 九宫速查</h2><p class="gd-note">源于PPT第6页九张小九宫；“身体及系统”中的中宫小字仍待确认。传统象意不是医学判断依据。</p>'+cards+'</section>';
}
function mountain(){return '<section class="gd-visuals"><h2>后天八卦 · 二十四山</h2><p class="gd-note">课程用上南下北、左东右西；中宫戊己不计入外围二十四山。图示不等于现场罗盘分度测量。</p>'+nine("八宫与二十四山",mountains)+'</section>';}
const byId={b6:life,f2:river,g2:bagua,f4:imagery,f5:mountain};
return {byId,life,bagua,river,imagery,mountain,stage,groups,values,positions,mountains};
})();
