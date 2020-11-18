const db = idb.open("mydatabase", 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("team")) {
      upgradeDb.createObjectStore("team", {keyPath: 'id'});
    };
    if (!upgradeDb.objectStoreNames.contains("match")) {
      upgradeDb.createObjectStore("match", {keyPath: 'id'});
    };
  });


  function addFavTeam(data){
  return new Promise((resolve, reject)=>{
    db
    .then(db =>{
      const tx = db.transaction('team', 'readwrite');
      const store = tx.objectStore('team');
      const item = {
        id: data.id,
        ...data
      };
      store.add(item);
      resolve(tx.complete);
    })
    .catch(error=>{
      reject(error);
    });
  }); 
};

function addFavMatch(data){
    return new Promise((resolve, reject)=>{
      db
      .then(db =>{
        const tx = db.transaction('match', 'readwrite');
        const store = tx.objectStore('match');
        const item = {
          id: data.id,
          ...data
        };
        store.add(item);
        resolve(tx.complete);
      })
      .catch(error=>{
        reject(error);
      });
    }); 
  };

function deleteFavTeam(id){
  return new Promise((resolve, reject)=>{
    db
    .then(db =>{
      const tx = db.transaction('team', 'readwrite');
      const store = tx.objectStore('team');
      store.delete(id);
      resolve(tx.complete);
    })
    .catch(error=>{
      reject(error);
    });
  }); 
};

function deleteFavMatch(id){
    return new Promise((resolve, reject)=>{
      db
      .then(db =>{
        const tx = db.transaction('match', 'readwrite');
        const store = tx.objectStore('match');
        store.delete(id);
        resolve(tx.complete);
      })
      .catch(error=>{
        reject(error);
      });
    }); 
};

function isFavTeam(id){
  return db
  .then( db => {
    const tx = db.transaction('team');
    const store = tx.objectStore('team');
    return res = store.get(id);
  })
};

function isFavMatch(id){
  return db
  .then( db => {
    const tx = db.transaction('match');
    const store = tx.objectStore('match');
    return res = store.get(id);
  })
  .catch(error=>{
    reject(error);
  });
};

function getAllFavTeams(){
  return db
  .then( db=> {
    const tx = db.transaction('team', 'readonly');
    const store = tx.objectStore('team');
    return store.getAll();
  })
  .catch(error => {
    console.log(error)
  });
};

function getAllFavMatchs(){
  return db
  .then( db=> {
    const tx = db.transaction('match', 'readonly');
    const store = tx.objectStore('match');
    return store.getAll();
  })
  .catch(error => {
    console.log(error)
  });
};
