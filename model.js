const db_req = indexedDB.open("yt_bm");
var db;

db_req.onupgradeneeded = event => {

    let db = db_req.result;

    if (!db.objectStoreNames.contains("yt_bookmarks")) {
        let objStore = db.createObjectStore("yt_bookmarks", {keyPath: "id", autoIncrement: true});

        objStore.createIndex("timeStamp", "timeStamp", {unique: true});
        objStore.createIndex("videoID", "videoID", {unique: false});
    }
}

db_req.onerror = err => {
    console.log(err);
}

db_req.onsuccess = event => {
    db = db_req.result;
}

async function addData(videoID, timeStamp) {
    let obj_tnx = db.transaction('yt_bookmarks', "readwrite");
    let obj_store = obj_tnx.objectStore('yt_bookmarks');

    await obj_store.add({"videoID": videoID, 
                    "timeStamp": timeStamp, 
                    "title": "New Bookmark",
                    "description": "Bookmark added at" + timeStamp});
}

async function getData(videoID) {

    return new Promise((res) => {
        let obj_tnx= db.transaction("yt_bookmarks");
        let obj_store = obj_tnx.objectStore("yt_bookmarks");
        let data = []

        let req = obj_store.index("videoID").openCursor()
        req.onsuccess = (e) => {
            let cursor = e.target.result;

            if (cursor && cursor.key === videoID) {
                data.push(cursor.value.timeStamp);
                cursor.continue();
            } else if(cursor !== null) {
                cursor.continue();
            } else if(cursor === null) {
                res(data);
            }
        }
    });
}

async function deleteData(videoID, timestamp) {

    let obj_store = db.transaction("yt_bookmarks", "readwrite").objectStore("yt_bookmarks");

    let req = obj_store.index("videoID").openCursor();
    req.onsuccess = e => {
        let cursor = e.target.result;

        console.log(cursor.key, cursor.value);
        console.log(videoID, timestamp)

        if (cursor && cursor.key === videoID) {
            if (cursor.value.timeStamp === timestamp) {
                cursor.delete();
                console.log("d");
                return;
            }
        } else if (cursor !== null) {
            cursor.continue();
        }
    }
}