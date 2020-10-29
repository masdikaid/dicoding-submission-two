
function fetchData(path, options=null){
    let optionsdata = { "headers":{ "X-Auth-Token":"4e9d2e97f7a64fce84dce406786a5d8b"}}
    if(options){
      optionsdata = { ...optionsdata, ...options}
    }
    return new Promise((resolve, reject) =>{
      fetch(`https://api.football-data.org${path}`, optionsdata)
      .then(response => {
        resolve(response.json())
      })
      .catch(error => {
        reject(error)
      });
    });
};

function getPage(page){
    return new Promise((resolve, reject)=>{
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          resolve(xhttp.responseText);
        }
        if (xhttp.status === 404) {
          reject("Something Went Wrong !")
        }
      };
      xhttp.open("GET", `pages/${page}`, true);
      xhttp.send();
    });
  };
  