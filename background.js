browser.tabs.onUpdated.addListener(handleUpdatedEvent);
var count = 0;

function handleUpdatedEvent(tabID, changeInfo, tab) {

    if (changeInfo.status == "complete" && tab.url && tab.url.includes('youtube.com/watch')) {
        const query_params = tab.url.split('?')[1];
        const params = new URLSearchParams(query_params);

        browser.tabs.sendMessage(tabID, 
        {
            type: 'new_yt',
            videoID: params.get('v') 
        });
    }
}

browser.runtime.onMessage.addListener(async (msg, sender, res) => {

    if (msg.type === "addData") {
        await addData(msg.videoID, msg.timestamp);
    }
    else if (msg.type === "getall") {

        await getData(msg.videoID)
        .then((data) => {
            if (data.length <= 0) {
                browser.runtime.sendMessage({
                    type: "nodata"
                });
            } else {
                browser.runtime.sendMessage({
                    type: "post",
                    data: data
                });
            }
        })
        .catch((e) => console.log(e));
    }
    else if (msg.type === "delete") {
        await deleteData(msg.videoID, msg.timestamp);
    }
})
// https://www.youtube.com/watch?v=tltRWZy0Hs4