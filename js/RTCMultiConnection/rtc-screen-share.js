var screenShareConnection = null;

function stopScreenShare(){ 
    var sharedScreenContainer = ''
    if(isLocalScreenShare){
        let container = document.getElementById('screen-share-local-container');
        sharedScreenContainer = document.querySelector('#screen-share-local-container > video');
        container.classList.add('d-none')
        container.innerHTML = ''
    }else{
        sharedScreenContainer = document.querySelector('#screen-share-container > video');
    }

    if (sharedScreenContainer !== null) {
        var stream = sharedScreenContainer.srcObject;
        var tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        screenShareConnection.closeSocket();
        isLocalScreenShare = false
        getConfigScreenShareData(false)
    }
}

function getScreenShareRoom() {
    screenShareConnection = new RTCMultiConnection();
    screenShareConnection.enableLogs = false;
    screenShareConnection.socketURL = SOCKET_URL_KEY;

    screenShareConnection.session = {
        screen: true,
        oneway: true
    }

    screenShareConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };

    screenShareConnection.onstreamended = function (event) {
        stopScreenShare();
        if (event.type === 'local') {
            connection.invoke('CloseBoard', webinarCalendarId, SCREEN_SHARE_BOARD).catch((err) => {
                errorAnalizer(err);
            });
        }
        screenShareConnection = null;
    };

    screenShareConnection.onSocketDisconnect = function () {
        isScreenShareRequestSend = false;
    }
}

function openScreenShareRoom() {
    getScreenShareRoom();
    let screenShareContainer = document.getElementById('screen-share-local-container')
    var screenShareRoomid = btoa(webinarCalendarId.toString())
    screenShareConnection.videosContainer = screenShareContainer;
    screenShareConnection.open(screenShareRoomid, () => {
        getLocalScreenShare($(screenShareContainer))
        // remove the video controls
        screenShareConnection.videosContainer.firstChild.controls = false
        if (screenShareConnection.socket.connected) {
            getConfigScreenShareData(true, currentUser.id)
            connection.invoke("OpenBoard", webinarCalendarId, SCREEN_SHARE_BOARD, currentUser.id, screenShareRoomid).catch((err) => {
                errorAnalizer("OpenBoard : " + err);
            });
            isLocalScreenShare = true;
        } else {
            return;
        }
    });
}

function getLocalScreenShare(screenShareContainer){
    let buttonGroup = new HtmlElement('div', 'mindalay--board-tool-buttons local-screen-share-buttons-group')
    let screenShareClose = getBoardButton(TR_CLOSE, close_btn_name, clsoe_icon, PREFIX_BOARD_BUTTONS_GROUP, 'close-local-screen-share')
    buttonGroup.append(screenShareClose)
    screenShareContainer.append(buttonGroup);
    screenShareContainer.removeClass('d-none')
}

var count = 0;

function joinScreenShareStream(screenShareRoomId, screenSharedUserId) {
    try{
        if (screenShareRoomId) {
            getScreenShareRoom()

            getConfigScreenShareData(true, screenSharedUserId)
            getBoard(screen_share_btn_name, false)
            var videoContainer = document.getElementById('screen-share-container');
            screenShareConnection.videosContainer = videoContainer;
            screenShareConnection.join(screenShareRoomId, function (isJoinedRoom, screenShareRoomid, error) {
                if(isJoinedRoom) hideVideoControls(videoContainer)
            });
        }
    }catch{
        setTimeout(() => {joinScreenShareStream(screenShareRoomId, screenSharedUserId)}, 1000)
    }
};

function getConfigScreenShareData(isScreenShare, screenSharedUserId = null) {
    if (isScreenShare) {
        webinarResponseData.screenSharedUserId = screenSharedUserId;
        webinarResponseData.isScreenShare = true;
    } else {
        webinarResponseData.screenSharedUserId = null;
        webinarResponseData.isScreenShare = false;
    }
}

function hideVideoControls(videoContainer){
    try{
        if(videoContainer.querySelector('video') !== null){
            screenShareConnection.videosContainer.firstChild.controls = false
        }else{
            throw '';
        }

    }catch{
        setTimeout(() => {hideVideoControls(videoContainer)}, 1000)
    }
}