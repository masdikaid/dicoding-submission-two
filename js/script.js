document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
  const select = document.querySelectorAll('select');
  M.FormSelect.init(select);
  getCompetitions();
  getStanding();
});

function getStanding(){
  fetchData("/v2/competitions/2021/standings/").then(data => console.log(data));
}

function getCompetitions(){
  fetchData("/v2/competitions/")
  .then(data => {
    let competitions = data.competitions.filter(data => data.currentSeason);
    competitions = competitions.sort((a, b) => {
      return new Date(b.currentSeason.endDate) - new Date(a.currentSeason.endDate)
    });
    competitions.forEach((competition) => {
      const select = document.querySelector("select");
      const option = document.createElement("option");
      const text = `${competition.name} ${new Date(competition.currentSeason.endDate) < new Date() ? '<span class="white-text badge yellow darken-4">Finished</span>' : '<span class="badge">'+new Date(competition.currentSeason.endDate).getFullYear()+'</span>' }`;
      option.setAttribute("value", competition.id);
      if (competition.id === 2021){
        option.setAttribute("selected",true)
      }
      option.innerHTML = text;
      select.appendChild(option);
      M.FormSelect.init(select);
    });
  })
  .catch(error => {
    console.error(error)
  });
};

function fetchData(path, options=null){
  let optionsdata = { "headers":{ "X-Auth-Token":"4e9d2e97f7a64fce84dce406786a5d8b"}}
  if(options){
    optionsdata = { ...optionsdata, ...options}
  }
  return new Promise((resolve, reject) =>{
    fetch(`http://api.football-data.org${path}`, optionsdata)
    .then(response => {
      resolve(response.json())
    })
    .catch(error => {
      reject(error)
    })
  })
}