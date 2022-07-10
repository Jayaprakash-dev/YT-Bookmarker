import {getCurrentUrl} from './util/url.js';

document.addEventListener('DOMContentLoaded', async () => {

    const url_props = await getCurrentUrl();
    let url_params = url_props[0].url.split("?")[1];
    let videoID = new URLSearchParams(url_params).get('v');

    if (url_props[0].url.includes('youtube.com/watch')) {

        browser.runtime.sendMessage({
            type: 'getall',
            videoID: videoID
        });

        browser.runtime.onMessage.addListener((msg, sender, res) => {
            if (msg.type === 'post') {
                msg.data.forEach(e => {
                    renderData(e);
                });
            }
            else if (msg.type === "nodata") {
                const main_container = document.getElementsByClassName("main-container")[0];
                main_container.innerHTML = "There are no bookmarks added for this video.";

                main_container.style.height = "fit-content";
                main_container.style.fontSize = '0.9em';
                main_container.style.fontWeight = '500';
                main_container.style.paddingTop = '12px';
            }
        });

        $("body").on("click", ".play-btn", (e) => {
            let current_elem = e.currentTarget.parentNode.parentNode;
            let timestamp = $(current_elem)[0].children[0].children[0];
            timestamp = $(timestamp).val();

            browser.tabs.sendMessage(url_props[0].id, {
                type: "play",
                videoID: videoID,
                timestamp: timestamp
            });
        });

        $("body").on("click", '.delete-btn', (e) => {
            let current_elem = e.currentTarget.parentNode.parentNode.parentNode;
            let timestamp = $(current_elem)[0].children[0].children[0];
            timestamp = $(timestamp).val();

            $(current_elem).remove();

            browser.runtime.sendMessage({
                type: "delete",
                videoID: videoID,
                timestamp: timestamp
            });
        });

    } else {
        const main_container = document.getElementsByClassName("main-container")[0];
        main_container.innerHTML = "There is no youtube video playing in this page";

        main_container.style.height = "fit-content";
        main_container.style.fontSize = '0.9em';
        main_container.style.fontWeight = '500';
        main_container.style.paddingTop = '12px';
    }
})

async function renderData(data) {
    let time = 0;
    
    if (data) {

        if (data >= 3600) {
            time = (data/3600).toFixed(2);
            time = time.split('.').join(':');

            if (time[0] == 1) {
            time  = time + ' hr';
            } else {
                time  = time + ' hrs';
            }

        } else{
            time = (data/60).toFixed(2);
            time = time.split('.').join(':');
            time += ' min';
        }
    } 

    $("#bm-list").append(
        `<div class="yt-bm" id=yt-bm-${time}>`
        + '<div class="bm-btns">'
        + '<input type="hidden" name="timestamp-value" value=' + data + '>'
        + '<img src="../assets/images/play.png" alt="" class="play-btn">'
        + `<span class="time-stamp">${time}</span>`
        + '<div class="bm-actions btn">'
        // + '<img src="./assets/images/edit.svg" alt="" class="edit-btn">'
        + '<img src="./assets/images/trash.svg" alt="" class="delete-btn">'
        + '</div></div></div>'
    );
}