// Add public/authorized live data here, or replace loadChannels() with your own permitted API.
const demo = Array.from({length: 16}, (_,i)=>({
  id:i+1,
  name:`Channel ${i+1}`,
  title:["Live show","Chatting now","Music & talk","New live stream"][i%4],
  viewers: Math.floor(120+Math.random()*4800),
  category: i<5 ? "popular" : i>11 ? "new" : "all",
  thumbnail:`https://picsum.photos/seed/live${i+1}/640/360`,
  url:"#"
}));

let channels=[], filter="all";
const grid=document.querySelector("#grid"), search=document.querySelector("#search");
const status=document.querySelector("#status"), empty=document.querySelector("#empty");

async function loadChannels(){
  status.textContent="Refreshing...";
  // Safe default: demo/public placeholder data.
  // To connect a source, return only data you are authorized to display.
  channels=[...demo];
  render();
}

function render(){
  const q=search.value.trim().toLowerCase();
  const list=channels.filter(x=>{
    const matchesFilter=filter==="all" || x.category===filter;
    const matchesSearch=(x.name+" "+x.title).toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
  grid.innerHTML=list.map(x=>`
    <article class="card">
      <a href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer">
        <div class="thumb">
          <img src="${escapeHtml(x.thumbnail)}" alt="" loading="lazy">
          <span class="badge">● LIVE</span>
          <span class="viewers">👁 ${Number(x.viewers).toLocaleString()}</span>
        </div>
        <div class="info">
          <div class="title">${escapeHtml(x.title)}</div>
          <div class="name">${escapeHtml(x.name)}</div>
        </div>
      </a>
    </article>`).join("");
  status.textContent=`${list.length} live`;
  empty.classList.toggle("hidden",list.length!==0);
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); filter=b.dataset.filter; render();
});
search.addEventListener("input",render);
document.querySelector("#refreshBtn").onclick=loadChannels;
loadChannels();
setInterval(loadChannels,60000);