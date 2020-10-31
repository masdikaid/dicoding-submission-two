function permissionHandler() {
    switch (Notification.permission) {
      case "default":
        Notification.requestPermission()
        break;
      case "granted":
        break;
      default:
        console.warn("Notification denied, cannot show your notification !")
        break;
    };
};

function navHandler(){
    document.querySelectorAll(".nav-item").forEach(item =>{
        item.addEventListener("click", event =>{
            event.preventDefault()
            const sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
        
            const page = event.target.href.substr(event.target.origin.length+1)
            switch (page) {
                case "competitions.html":
                    getCompetitionPage()
                    break;
                case "fav-teams.html":
                    getFavTeamsPage()
                    break;
                case "schedule.html":
                    getFavMatchsPage()
                    break;
                default:
                    getPage(page)
                    .then(response => {
                        document.getElementById("content").innerHTML = response;
                    })
                    .catch(error =>{
                        document.getElementById("content").innerHTML = error;
                    });
                    break;
            };
        });
    });
};

function getCompetitionPage(){
    getPage("competitions.html")
    .then(response => {
      document.getElementById("content").innerHTML = response;
      const select = document.getElementById('competitions');
      M.FormSelect.init(select);
      const tabs = document.querySelector('#tabs-swipe');
      M.Tabs.init(tabs);
      getCompetitions();
    })
    .catch(error =>{
      document.getElementById("content").innerHTML = error;
    });
};

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
        let text = `${competition.name} ${new Date(competition.currentSeason.endDate) < new Date() ? '<span class="white-text badge yellow darken-4">Finished</span>' : '<span class="badge">'+new Date(competition.currentSeason.startDate).getFullYear()+'</span>' }`;
        option.setAttribute("value", competition.id);
        if (competition.id === 2021){
            option.setAttribute("selected",true)
        };
        if (![2001, 2002, 2003, 2014, 2015, 2021].includes(competition.id)){
            option.setAttribute("disabled",true)
            text = `${competition.name} '<span class="white-text badge red darken-4">Disable</span>' ${new Date(competition.currentSeason.endDate) < new Date() ? '<span class="white-text badge yellow darken-4">Finished</span>' : '<span class="badge">'+new Date(competition.currentSeason.startDate).getFullYear()+'</span>' }`;
        };
        option.innerHTML = text;
        select.appendChild(option);
        M.FormSelect.init(select);
        });
        const select = document.getElementById('competitions')
        select.addEventListener("change", () => {
        getStanding(select.value);
        getMatch(select.value);
        });
        getStanding();
        getMatch();
    })
    .catch(error => {
        console.error(error)
    });
};

function getStanding(id=2021){
    fetchData(`/v2/competitions/${id}/standings/`)
    .then(data =>{
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
                    <a class="fav-team btn-floating btn-medium waves-effect waves-light grey lighten-4">${"<i id='"+team.team.id+"' class='material-icons grey-text lighten-4'>star_border</i>"}</a>
                </div>
                </div>
            `
            teamelement.appendChild(element)
            isFavTeam(team.team.id.toString())
            .then(res => {
                if(res){
                    const el = document.getElementById(res.id)
                    el.classList.replace("grey-text", "orange-text")
                    el.classList.replace("lighten-4", "darken-4")
                    el.innerText = "star"
                };
            });
        });
        
        document.querySelectorAll(".fav-team").forEach(elem =>{
            elem.addEventListener("click", event =>{
                const el = document.getElementById(event.target.id)
                switch (el.innerText) {
                case "star_border":
                    const data ={
                    id: event.target.id,
                    name:event.path[3].children[0].innerText,
                    icon:event.path[4].children[0].currentSrc,
                    matchs:{
                        win: event.path[3].children[1].children[1].innerText,
                        lost: event.path[3].children[2].children[1].innerText,
                        draw: event.path[3].children[3].children[1].innerText,
                    }
                    };
                    addFavTeam(data)
                    .then( () => {
                        el.innerText = "star"
                        el.classList.replace("grey-text", "orange-text")
                        el.classList.replace("lighten-4", "darken-4")
                    });
                    break;
                case "star":
                    deleteFavTeam(event.target.id)
                    .then( () =>{
                        el.innerText = "star_border"
                        el.classList.replace("orange-text", "grey-text")
                        el.classList.replace("darken-4", "lighten-4")
                    });
                    break;
                default:
                    el.innerText = "star_border"
                    el.classList.replace("orange-text", "grey-text")
                    el.classList.replace("darken-4", "lighten-4")
                    break;
                };
            });
        }); 
    });
};

function getMatch(id=2021){
    fetchData(`/v2/competitions/${id}/matches`)
    .then(data =>{
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
                    ${new Date(match.utcDate).toUTCString()}
                </p>
                <div class="col s4">
                    <a class="fav-match btn-floating btn-medium waves-effect waves-light grey lighten-4"><i id="${match.id}" class="material-icons grey-text lighten-4">add_alert</i></a>
                </div>
                </div>
            `
            matchelement.appendChild(element);
            isFavMatch(match.id.toString())
            .then(res => {
                if(res){
                    const el = document.getElementById(res.id)
                    el.innerText = "indeterminate_check_box"
                    el.classList.replace("grey-text", "orange-text")
                    el.classList.replace("lighten-4", "darken-4")
                };
            });
        });



        document.querySelectorAll(".fav-match").forEach(elem =>{
            elem.addEventListener("click", event =>{
                const el = document.getElementById(event.target.id)
                switch (el.innerText) {
                case "add_alert":
                    const data ={
                        id: event.target.id,
                        awayteam: event.path[4].children[0].children[0].children[1].innerText,
                        hometeam: event.path[4].children[0].children[2].children[1].innerText,
                        status: event.path[4].children[1].children[0].innerText,
                        date: new Date(event.path[4].children[1].children[1].innerText)
                    };
                    addFavMatch(data)
                    .then( () => {
                        el.innerText = "indeterminate_check_box"
                        el.classList.replace("grey-text", "orange-text")
                        el.classList.replace("lighten-4", "darken-4")
                    });
                    break;
                case "indeterminate_check_box":
                    deleteFavMatch(event.target.id)
                    .then( () => {
                        el.innerText = "add_alert"
                        el.classList.replace("orange-text", "grey-text")
                        el.classList.replace("darken-4", "lighten-4")
                    });
                    break;
                default:
                    el.innerText = "add_alert"
                    el.classList.replace("orange-text", "grey-text")
                    el.classList.replace("darken-4", "lighten-4")
                    break;
                };
            });
        }); 
    });
};

function getFavTeamsPage(){
    getPage("fav-teams.html")
    .then( response => {
        document.getElementById("content").innerHTML = response;
        favTeams();
    });
};

function getFavMatchsPage(){
    getPage("schedule.html")
    .then( response => {
        document.getElementById("content").innerHTML = response;
        favMatchs();
    });
};

function favTeams(){
    getAllFavTeams()
    .then(res => {
        const teamelement = document.getElementById("ul-fav-team")
        teamelement.innerHTML = ""
        res.forEach( team =>{
            const element = document.createElement("li")
            element.setAttribute("class", "collection-item row")
            element.innerHTML = `
            <img class="standing-team-img responsive-img col s12 m3 l2" src="${team.icon}" alt="${team.name}">
            <div class="col s12 m9 l10 row">
                <h5 class="col s12 center">${team.name}</h5>
                <div class="col s4">
                    <h6 class="center">Win</h6>
                    <p class="center">${team.matchs.win}</p>
                </div>
                <div class="col s4">
                    <h6 class="center">Lost</h6>
                    <p class="center">${team.matchs.lost}</p>
                </div>
                <div class="col s4">
                    <h6 class="center">Draw</h6>
                    <p class="center">${team.matchs.draw}</p>
                </div>
                <div class="col s4">
                    <a class="fav-team btn-floating btn-medium waves-effect waves-light grey lighten-4">${"<i id='"+team.id+"' class='material-icons red-text lighten-4'>delete_forever</i>"}</a>
                </div>
            </div>
            `
            teamelement.appendChild(element);
        });
        document.querySelectorAll(".fav-team").forEach(elem =>{
            elem.addEventListener("click", event =>{
                deleteFavTeam(event.target.id)
                .then( () =>{
                    event.path[4].remove()
                });
            });
        }); 
    });
};

function favMatchs(){
    getAllFavMatchs()
    .then(res => {
        const matchelement = document.getElementById("ul-fav-match")
        matchelement.innerHTML = ""
        res.forEach(match =>{
            const element = document.createElement("div")
            element.setAttribute("class", "row match-item card")
            element.innerHTML = `
                <div class="card-title row col s12">
                <div class="col s12 l5">
                    <p class="center">(Away)</p>
                    <h5 class="center">${match.awayteam}</h5>
                </div>
                <h5 class="center col s12 l2 material-icons">compare_arrows</h5>
                <div class="col s12 l5">
                    <p class="center">(Home)</p>
                    <h5 class="center">${match.hometeam}</h5>
                </div>
                </div>
                <div class="col s12 card-content">
                <h6 class="yellow darken-2 white-text center">
                    ${match.status}
                </h6>
                <p class="center">
                    ${new Date(match.date).toUTCString()}
                </p>
                <div class="col s4">
                    <a class="fav-match btn-floating btn-medium waves-effect waves-light grey lighten-4"><i id="${match.id}" class="material-icons red-text lighten-4">delete_forever</i></a>
                </div>
                </div>
            `
            matchelement.appendChild(element);
        });
        document.querySelectorAll(".fav-match").forEach(elem =>{
            elem.addEventListener("click", event =>{
                deleteFavMatch(event.target.id)
                .then( () => {
                    event.path[4].remove()
                });
            });
        }); 
    });
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}