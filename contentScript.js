(() => {
    let yt_player, current_videoId;
    const pin_img = browser.runtime.getURL("./assets/pin.png");

    browser.runtime.onMessage.addListener((msg, sender, res) => {

        if (msg.type === 'new_yt') {
            current_videoId = msg.videoID;

            newYtpVideoLoaded();
        }

        if (msg.type === "play") {
            if (current_videoId === msg.videoID) {
                let yt_player = document.getElementsByClassName("video-stream")[0];
                yt_player.currentTime = msg.timestamp;
            }
        }
    });

    const newYtpVideoLoaded = async () => {
        let bm_btn_exists = document.getElementsByClassName('ytp-bm-btn')[0];

        if(bm_btn_exists === undefined) {
            let bm_btn = document.createElement('button');
            bm_btn.className += 'ytp-button';
            bm_btn.style.width = '100%';
            bm_btn.style.height = '100%'
            $(".ytp-left-controls").append(bm_btn);
            
            let bm_img = document.createElement('img');
            bm_img.src = browser.runtime.getURL("./assets/images/AddBookmark.png");
            bm_img.className += "ytp-bm-btn";
            bm_img.style.width = '25px';
            bm_img.style.height = '25px';
            bm_img.style.position = 'relative';
            bm_img.style.top = '13%';

            $(bm_btn).append(bm_img);

            if ($(".ytp-chapter-container") !== undefined) {
                $(".ytp-chapter-container").css("max-width", "max-content");
                $(".ytp-chapter-title").css("max-width", "max-content")
            }


            bm_img.addEventListener('click', bmBtnClickEvent);
        }
    }

    const bmBtnClickEvent = (e) => {
        yt_player =  document.getElementsByClassName("video-stream")[0];
        let current_sec =  yt_player.currentTime.toFixed(3);

        browser.runtime.sendMessage({
            type: "addData",
            videoID: current_videoId,
            timestamp: current_sec
        })
    }

})();

