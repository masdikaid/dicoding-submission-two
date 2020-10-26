document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
  const select = document.getElementById('competitions');
  M.FormSelect.init(select);
  const tabs = document.querySelector('#tabs-swipe');
  M.Tabs.init(tabs);
  getCompetitions();
});


function getStanding(id=2021){
  fetchData(`/v2/competitions/${id}/standings/`).then(data =>{
    const standingtitle = document.getElementById("standing-title")
    standingtitle.innerText = data.competition.name
    const standingdate = document.getElementById("standing-date")
    standingdate.innerText = data.season.startDate+" - "+data.season.endDate
    const standingarea = document.getElementById("standing-area")
    standingarea.innerText = data.competition.area.name
    const standing = document.getElementById("tab-standing")
    standing.innerText = `Standing (${data.standings[0].table.length})`
    const teamelement = document.getElementById("ul-team")
    teamelement.innerHTML = ""
    data.standings[0].table.forEach(team =>{
      const element = document.createElement("li")
      element.setAttribute("class", "collection-item row")
      element.innerHTML = `
        <img class="standing-team-img responsive-img col s12 m3 l2" src="${team.team.crestUrl}" alt="${team.team.name}">
        <div class="col s12 m9 l10 row">
          <h5 class="col s12 center">${team.team.name}</h5>
          <div class="col s4">
              <h6 class="center">Win</h6>
              <p class="center">${team.won}</p>
          </div>
          <div class="col s4">
              <h6 class="center">Lost</h6>
              <p class="center">${team.lost}</p>
          </div>
          <div class="col s4">
              <h6 class="center">Draw</h6>
              <p class="center">${team.draw}</p>
          </div>
          <div class="col s4">
              <a class="fav-team btn-floating btn-medium waves-effect waves-light grey lighten-4"><i id="${team.team.id}" class="material-icons grey-text lighten-4">star_border</i></a>
          </div>
        </div>
      `
      teamelement.appendChild(element)
    });
    
    document.querySelectorAll(".fav-team").forEach(elem =>{
      elem.addEventListener("click", event =>{
        const el = document.getElementById(event.target.id)
        switch (el.innerText) {
          case "star_border":
            el.innerText = "star"
            el.classList.replace("grey-text", "orange-text")
            el.classList.replace("lighten-4", "darken-4")
            break;
          case "star":
            el.innerText = "star_border"
            el.classList.replace("orange-text", "grey-text")
            el.classList.replace("darken-4", "lighten-4")
            break;
          default:
            el.innerText = "star_border"
            el.classList.replace("orange-text", "grey-text")
            el.classList.replace("darken-4", "lighten-4")
            break;
          };
      });
    }); 
    const select = document.getElementById('competitions')
    select.addEventListener("change", _ =>{
      getStanding(select.value);
      getMatch(select.value);
    });
  });
};

function getMatch(id=2021){
  fetchData(`/v2/competitions/${id}/matches`)
  .then(data =>{
    console.log(data)

    const match = document.getElementById("tab-match")
    match.innerText = `Match (${data.matches.length})`

    const matchelement = document.getElementById("ul-match")
    matchelement.innerHTML = ""

    data.matches.forEach(match =>{
      const element = document.createElement("div")
      element.setAttribute("class", "row match-item card")
      element.innerHTML = `
        <div class="card-title row col s12">
          <div class="col s12 l5">
            <p class="center">(Away)</p>
            <h5 class="center">${match.awayTeam.name}</h5>
          </div>
          <h5 class="center col s12 l2 material-icons">compare_arrows</h5>
          <div class="col s12 l5">
            <p class="center">(Home)</p>
            <h5 class="center">${match.homeTeam.name}</h5>
          </div>
        </div>
        <div class="col s12 card-content">
          <h6 class="yellow darken-2 white-text center">
            ${match.status}
          </h6>
          <p class="center">
            ${new Date(match.utcDate).toLocaleDateString() +" - "+ new Date(match.utcDate).toLocaleTimeString()}
          </p>
          <div class="col s4">
              <a class="fav-match btn-floating btn-medium waves-effect waves-light grey lighten-4"><i id="${match.id}" class="material-icons grey-text lighten-4">add_alert</i></a>
          </div>
        </div>
      `
      matchelement.appendChild(element)
    });

    document.querySelectorAll(".fav-match").forEach(elem =>{
      elem.addEventListener("click", event =>{
        const el = document.getElementById(event.target.id)
        switch (el.innerText) {
          case "add_alert":
            el.innerText = "indeterminate_check_box"
            el.classList.replace("grey-text", "orange-text")
            el.classList.replace("lighten-4", "darken-4")
            break;
          case "indeterminate_check_box":
            el.innerText = "add_alert"
            el.classList.replace("orange-text", "grey-text")
            el.classList.replace("darken-4", "lighten-4")
            break;
          default:
            el.innerText = "add_alert"
            el.classList.replace("orange-text", "grey-text")
            el.classList.replace("darken-4", "lighten-4")
            break;
          };
      });
    }); 
  })
}

function getCompetitions(){
  fetchData("/v2/competitions/")
  .then(data => {
    let competitions = data.competitions.filter(data => data.currentSeason);
    competitions = competitions.sort((a, b) => {
      return new Date(b.currentSeason.startDate) - new Date(a.currentSeason.startDate)
    });
    competitions.forEach((competition) => {
      const select = document.querySelector("select");
      const option = document.createElement("option");
      const text = `${competition.name} ${new Date(competition.currentSeason.endDate) < new Date() ? '<span class="white-text badge yellow darken-4">Finished</span>' : '<span class="badge">'+new Date(competition.currentSeason.startDate).getFullYear()+'</span>' }`;
      option.setAttribute("value", competition.id);
      if (competition.id === 2021){
        option.setAttribute("selected",true)
      }
      if (![2001, 2002, 2003, 2014, 2015, 2021].includes(competition.id)){
        option.setAttribute("disabled",true)
      }
      option.innerHTML = text;
      select.appendChild(option);
      M.FormSelect.init(select);
    });
    getStanding();
    getMatch();
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