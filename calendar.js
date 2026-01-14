const DOW = ["D","S","T","Q","Q","S","S"];

function iso(d){
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth()+1).padStart(2,"0");
  const da = String(x.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}

export function mountCalendar({
  getSelectedISO,
  setSelectedISO,
  onChange
}){
  const grid = document.getElementById("calGrid");
  const title = document.getElementById("calTitle");
  const prev = document.getElementById("calPrev");
  const next = document.getElementById("calNext");

  let view = new Date(getSelectedISO() + "T00:00:00");
  view = new Date(view.getFullYear(), view.getMonth(), 1);

  function render(){
    grid.innerHTML = "";

    // DOW header
    for(const d of DOW){
      const el = document.createElement("div");
      el.className = "cal-dow";
      el.textContent = d;
      grid.appendChild(el);
    }

    title.textContent = view.toLocaleDateString("pt-BR",{ month:"long", year:"numeric" });

    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay()); // domingo

    const selected = getSelectedISO();
    const todayISO = iso(new Date());

    // 6 semanas * 7 dias
    for(let i=0;i<42;i++){
      const day = new Date(start);
      day.setDate(start.getDate()+i);

      const dayISO = iso(day);
      const el = document.createElement("div");
      el.className = "cal-day";
      el.textContent = day.getDate();

      if(day.getMonth() !== view.getMonth()) el.classList.add("muted");
      if(dayISO === todayISO) el.classList.add("today");
      if(dayISO === selected) el.classList.add("active");

      el.onclick = () => {
        setSelectedISO(dayISO);
        onChange?.(dayISO);
        render();
      };

      grid.appendChild(el);
    }
  }

  prev.onclick = () => {
    view = new Date(view.getFullYear(), view.getMonth()-1, 1);
    render();
  };
  next.onclick = () => {
    view = new Date(view.getFullYear(), view.getMonth()+1, 1);
    render();
  };

  render();

  return { rerender: render };
}
