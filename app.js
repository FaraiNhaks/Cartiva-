const CATEGORIES = [{"name":"🥖 Staples & Grains","items":["Rice","Mealie Meal","Pasta","Potatoes","Cereal","Bread","Sugar"]},{"name":"🥩 Meat & Protein","items":["Chicken","Beef","Mince","Sausage","Lamb"]},{"name":"🧅 Fresh Produce","items":["Onions","Tomatoes","Vegetables"]},{"name":"🥛 Dairy","items":["Milk","Cheese","Yoghurt","Butter","Mayonnaise"]},{"name":"🥤 Beverages","items":["Juice","Teabags"]},{"name":"🧂 Pantry & Cooking Essentials","items":["Spices","Cooking Oil","Tomato Sauce","Sweet Chilli Sauce","Balsamic Vinegar","Lemon Juice"]},{"name":"🧹 Cleaning & Laundry","items":["Sunlight Liquid","Laundry Agent","Fabric Softener","Handy Andy","Air Freshener","Bin Plastics"]},{"name":"🧻 Household Essentials","items":["Toilet Paper","Cleaning Cloths"]},{"name":"🩺 Health & Personal Care","items":["Pads/Tampons","Pain Killers","Body Lotion","Roll On","Colgate","Bathing Soap"]}];
const KEY="my-grocery-list-v1";
const $=id=>document.getElementById(id);
const money=n=>(Number(n)||0).toLocaleString("en-ZA",{minimumFractionDigits:2,maximumFractionDigits:2});
const defaultCollapsed=()=>Object.fromEntries(CATEGORIES.map((_,i)=>[i,true]));
function freshState(){return {budget:"",checked:[],qty:{},unit:{},custom:{},deleted:[],collapsed:defaultCollapsed(),savedLists:{}}}
function loadState(){try{return {...freshState(),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return freshState()}}
let state=loadState();
// Each launch starts with all categories closed, regardless of the previous viewing session.
state.collapsed=defaultCollapsed();
function save(){localStorage.setItem(KEY,JSON.stringify(state));$("save-status").textContent="Saved";}
function snapshot(){return {budget:state.budget,checked:[...state.checked],qty:{...state.qty},unit:{...state.unit},custom:JSON.parse(JSON.stringify(state.custom)),deleted:[...state.deleted]}}
function allItems(){return CATEGORIES.flatMap((cat,ci)=>[
 ...cat.items.map((name,ii)=>({id:`${ci}-${ii}`,name,ci,custom:false})),
 ...(state.custom[ci]||[]).map(x=>({...x,ci,custom:true}))
]).filter(x=>!state.deleted.includes(x.id))}
function amount(item){return (Number(state.qty[item.id])||0)*(Number(state.unit[item.id])||0)}
function total(){return allItems().reduce((s,x)=>s+amount(x),0)}
function checked(item){return state.checked.includes(item.id)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function updateSummary(){
 const t=total(),all=allItems(),done=all.filter(checked).length,pct=all.length?Math.round(done/all.length*100):0;
 $("total-top").textContent=$("total-bottom").textContent="R "+money(t);
 $("budget").value=state.budget;
 const msg=$("budget-message");
 if(state.budget!==""&&Number(state.budget)>=0){const diff=Number(state.budget)-t;msg.textContent=(diff<0?"Over budget by R ":"Budget remaining: R ")+money(Math.abs(diff));msg.className="budget-message "+(diff<0?"over":"under")}else{msg.textContent="";msg.className="budget-message"}
 $("progress-area").hidden=$("item-filter").value!=="all";
 $("progress-count").textContent=`${done} / ${all.length} checked`;$("progress-bar").style.width=pct+"%";$("progress-percent").textContent=pct+"% completed";
}
function itemMarkup(x){
 const isDone=checked(x),qty=state.qty[x.id]??"",unit=state.unit[x.id]??"";
 return `<div class="item-row">
 <button class="delete-item" type="button" data-delete="${esc(x.id)}" aria-label="Delete ${esc(x.name)}" title="Delete item">×</button>
 <label class="item-name ${isDone?"checked":""}"><input type="checkbox" data-check="${esc(x.id)}" ${isDone?"checked":""}><span>${esc(x.name)}</span></label>
 <select aria-label="Quantity for ${esc(x.name)}" data-qty="${esc(x.id)}"><option value="">—</option>${Array.from({length:10},(_,i)=>i+1).map(n=>`<option value="${n}" ${String(qty)===String(n)?"selected":""}>${n}</option>`).join("")}</select>
 <input aria-label="Unit price for ${esc(x.name)}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" data-unit="${esc(x.id)}" value="${esc(unit)}">
 <div class="item-price">R ${money(amount(x))}</div></div>`;
}
function render(){
 const list=$("list"),catFilter=$("category-filter").value,itemFilter=$("item-filter").value,sort=$("sort-mode").value;
 let items=allItems().filter(x=>(catFilter==="all"||String(x.ci)===catFilter)&&(itemFilter==="all"||(itemFilter==="checked"?checked(x):!checked(x))));
 if(sort==="az"){
  items.sort((a,b)=>a.name.localeCompare(b.name));
  list.innerHTML=items.length?`<div class="category-card"><div class="category-content"><div class="column-head"><span></span><span>Item</span><span>Qty</span><span>Unit price</span><span>Price</span></div>${items.map(x=>`<div>${itemMarkup(x)}<div class="az-category">${esc(CATEGORIES[x.ci].name)}</div></div>`).join("")}</div></div>`:`<div class="empty">No items match these filters.</div>`;
 }else{
  const groups=CATEGORIES.map((cat,ci)=>({cat,ci,items:items.filter(x=>x.ci===ci)})).filter(g=>g.items.length&&(catFilter==="all"||String(g.ci)===catFilter));
  list.innerHTML=groups.length?groups.map(g=>{
   const collapsed=!!state.collapsed[g.ci];
   return `<section class="category-card ${collapsed?"collapsed":""}">
    <button class="category-heading" type="button" data-collapse="${g.ci}" aria-expanded="${!collapsed}"><strong>${esc(g.cat.name)}</strong><span class="count">${g.items.filter(checked).length}/${g.items.length}</span><span class="chevron">⌄</span></button>
    <div class="category-content"><div class="column-head"><span></span><span>Item</span><span>Qty</span><span>Unit price</span><span>Price</span></div>
      ${g.items.map(itemMarkup).join("")}
      <div class="other-label">Add another item</div><form class="add-row" data-add="${g.ci}"><input name="item" maxlength="60" placeholder="Enter item name" required><button class="button" type="submit">+ Add</button></form>
    </div></section>`;
  }).join(""):`<div class="empty">No items match these filters.</div>`;
 }
 updateSummary();renderSavedLists();
}
function renderSavedLists(){
 const select=$("saved-list-select"),names=Object.keys(state.savedLists||{});
 const current=select.value;
 select.innerHTML='<option value="">Choose a saved list</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("");
 if(names.includes(current))select.value=current;
}
function saveNamedList(){
 const name=$("list-name").value.trim();
 if(!name){$("list-name").focus();$("list-name").setCustomValidity("Enter a name for this list.");$("list-name").reportValidity();$("list-name").setCustomValidity("");return}
 state.savedLists=state.savedLists||{};state.savedLists[name]=snapshot();save();$("list-name").value="";$("saved-list-select").value=name;renderSavedLists();$("save-status").textContent="List saved";
}
function loadNamedList(){
 const name=$("saved-list-select").value;if(!name||!state.savedLists[name])return;
 const saved=state.savedLists[name];state={...state,...JSON.parse(JSON.stringify(saved)),collapsed:defaultCollapsed(),savedLists:state.savedLists};save();render();
}
function deleteNamedList(){
 const name=$("saved-list-select").value;if(!name||!state.savedLists[name])return;
 if(!confirm(`Delete the saved list "${name}"?`))return;
 delete state.savedLists[name];save();renderSavedLists();
}
async function shareList(){
 const rows=allItems().map(x=>`${checked(x)?"[x]":"[ ]"} ${x.name} — Qty: ${state.qty[x.id]||"—"} — Unit price: R ${money(state.unit[x.id])} — Total: R ${money(amount(x))}`);
 const content=`${document.title}\nShopping budget: ${state.budget===""?"Not set":"R "+money(state.budget)}\nShopping total: R ${money(total())}\n\n${rows.join("\n")}`;
 if(navigator.share){
  try{await navigator.share({title:"My Cartiva shopping list",text:content})}catch(err){if(err.name!=="AbortError")alert("Sharing was not completed. Please try again.")}
 }else if(navigator.clipboard&&window.isSecureContext){
  try{await navigator.clipboard.writeText(content);alert("Shopping list copied. You can now paste it into WhatsApp, SMS or email.")}catch{fallbackCopy(content)}
 }else fallbackCopy(content);
}
function fallbackCopy(content){
 const area=document.createElement("textarea");area.value=content;area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.select();
 try{document.execCommand("copy");alert("Shopping list copied. You can now paste it into your messaging app.")}catch{alert("Sharing is not available in this browser. Please use a supported browser or install Cartiva.")}area.remove();
}
function reset(){if(!confirm("Reset the checklist? This clears the budget, checked items, quantities and unit prices. Custom and deleted items and saved lists will remain."))return;state.budget="";state.checked=[];state.qty={};state.unit={};state.collapsed=defaultCollapsed();save();render()}
$("budget").addEventListener("input",e=>{state.budget=e.target.value;save();updateSummary()});
$("category-filter").addEventListener("change",render);$("item-filter").addEventListener("change",render);$("sort-mode").addEventListener("change",render);
$("reset-top").addEventListener("click",reset);$("reset-bottom").addEventListener("click",reset);
$("save-list").addEventListener("click",saveNamedList);$("load-list").addEventListener("click",loadNamedList);$("delete-list").addEventListener("click",deleteNamedList);$("share-list").addEventListener("click",shareList);
$("list-name").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();saveNamedList()}});
$("list").addEventListener("change",e=>{
 const check=e.target.closest("[data-check]"),qty=e.target.closest("[data-qty]"),unit=e.target.closest("[data-unit]");
 if(check){const id=check.dataset.check;state.checked=check.checked?[...new Set([...state.checked,id])]:state.checked.filter(x=>x!==id);save();render()}
 if(qty){state.qty[qty.dataset.qty]=qty.value;save();render()}
 if(unit){state.unit[unit.dataset.unit]=unit.value;save();render()}
});
$("list").addEventListener("click",e=>{
 const collapse=e.target.closest("[data-collapse]"),del=e.target.closest("[data-delete]");
 if(collapse){const i=collapse.dataset.collapse;state.collapsed[i]=!state.collapsed[i];save();render()}
 if(del){const id=del.dataset.delete,item=allItems().find(x=>x.id===id);if(!item)return;if(!confirm(`Delete "${item.name}" from this shopping list?`))return;
  if(item.custom)state.custom[item.ci]=(state.custom[item.ci]||[]).filter(x=>x.id!==id);else state.deleted=[...new Set([...state.deleted,id])];
  state.checked=state.checked.filter(x=>x!==id);delete state.qty[id];delete state.unit[id];save();render();
 }
});
$("list").addEventListener("submit",e=>{const form=e.target.closest("[data-add]");if(!form)return;e.preventDefault();const ci=Number(form.dataset.add),name=new FormData(form).get("item").trim();if(!name)return;state.custom[ci]=state.custom[ci]||[];state.custom[ci].push({id:`custom-${ci}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,name});save();render()});
CATEGORIES.forEach((c,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=c.name;$("category-filter").append(o)});
document.documentElement.dataset.platform=/android/i.test(navigator.userAgent)?"android":(/iPad|iPhone|iPod/.test(navigator.userAgent)?"ios":"other");
render();
if("serviceWorker"in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}
