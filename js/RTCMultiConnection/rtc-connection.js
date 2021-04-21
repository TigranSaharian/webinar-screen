$(document).ready(function () {
    connectionWebRTC = new RTCMultiConnection();
    connectionWebRTC.enableLogs = false;
    connectionWebRTC.socketURL = SOCKET_URL_KEY;
    connectionWebRTC.socketMessageEvent = SOCKET_MESSAGE_EVENT_KEY;

    SetStreamQuality(MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT, MIN_FRAME_RATE, MAX_FRAME_RATE, MAX_ASPECT_RATIO);

    designer = new CanvasDesigner();
    designer.widgetHtmlURL = WIDGET_HTML_KEY;
    designer.widgetJsURL = WIDGET_JS_KEY;

    designer.addSyncListener(function (data) {
        connectionWebRTC.send(data);
    });

    designer.setTools({
        pencil: true,
        text: true,
        undo: true,
        arrow: true,
        arc: true,
        rectangle: true,
        marker: true,
        eraser: true,
        dragMultiple: true,
    });

    connectionWebRTC.session = {
        audio: true,
        video: true,
        // data: true,
    };

    var bitrates = 512;
    var resolutions = 'Standart';
    var videoConstraints = {};

    if(resolutions == 'Standart'){
        videoConstraints = {
            width: {
                ideal: 300
            },
            height: {
                ideal: 180
            },
            frameRate: 30
        };
    }

    if (resolutions == 'HD') {
        videoConstraints = {
            width: {
                ideal: 1280
            },
            height: {
                ideal: 720
            },
            frameRate: 30
        };
    }

    if (resolutions == 'Ultra-HD') {
        videoConstraints = {
            width: {
                ideal: 1920
            },
            height: {
                ideal: 1080
            },
            frameRate: 30
        };
    }

    connectionWebRTC.mediaConstraints = {
        video: videoConstraints,
        audio: true
    };

    connectionWebRTC.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    var CodecsHandler = connectionWebRTC.CodecsHandler;

    connectionWebRTC.processSdp = function (sdp) {
        var codecs = 'vp8';
        if (codecs.length) {
            sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
        }

        if (resolutions == 'Standart') {
            sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                audio: 128,
                video: bitrates,
                screen: bitrates
            });
        }

        if (resolutions == 'HD') {
            sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                audio: 128,
                video: bitrates,
                screen: bitrates
            });
        }

        if (resolutions == 'Ultra-HD') {
            sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                audio: 128,
                video: bitrates,
                screen: bitrates
            });
        }
        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });

        return sdp;
    };

    connectionWebRTC.studentVideoContainer = document.getElementById('users-video-container');
    connectionWebRTC.onstream = function (event) {
        // videoOff();
        // audioMute();
        var video = document.createElement('video');
        video.srcObject = event.stream;
        
        defaultMediaElementRuls(event);
         createVideoElement(event, video);
        
        mediaElement = getHTMLMediaElement(video, {
            isAudio: event.stream.isAudio,
            isVideo: event.stream.isVideo,
            userData: webinarUsers.find(x => x.id == event.userid),
            buttons: [],
            type: event.type
        });
        
        mediaElement.id = event.streamid;
        AppendMediaElement(connectionWebRTC.studentVideoContainer, mediaElement);

        // if (event.type === 'local') {
        //     currentUserStreamId = event.streamid;
        //     if (isLecturer) {
        //         onAudio = true
        //         AudioRuleVizualization(onAudio, event.streamid);
        //         connection.invoke('JoinNewUser', webinarCalendarId, currentUser.id, event.stream.isVideo, event.streamid).catch((err) => {
        //             ErrorAnalizer(err);
        //         });
        //     } else {
        //         connection.invoke('JoinNewUser', webinarCalendarId, currentUser.id, false, event.streamid).catch((err) => {
        //             ErrorAnalizer(err);
        //         });
        //     }
        //     //   connection.invoke('JoinExistedScreenShare', webinarCalendarId).catch((err) => {
        //     //     ErrorAnalizer(err);
        //     //   });

        //     //   checkResendVideoRequest();
        // }

        // if (localStorage.getItem(screenSize)) {
        //   $('.media-container').removeProp('width');
        //   MakeElementHeightWidth(localStorage.getItem(screenSize), '.media-container')
        // }

        // to keep room-id in cache
        localStorage.setItem(connectionWebRTC.socketMessageEvent, connectionWebRTC.sessionid);

        if (event.type === 'local') {
            connectionWebRTC.socket.on('disconnect', function () {
                if (!connectionWebRTC.socket.connected) {
                    ReconnectConnectionWebRTC();
                }
            });
        }
    }

    // designer.appendTo(document.getElementById('widget-container'), function() {
    //   });

})



















function getRTCVideoButton() {
    if (isVideoMuted) {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, video_unmute_icon, TR_ON_VIDEO, true, video_unmute_name, true)
    } else {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, video_muted_icon, TR_OFF_VIDEO, true, video_muted_name, true)
    }
}

function getRTCMicrophoneButton() {
    if (isSpeakerMuted) {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, speaker_unmute_icon, TR_UNMUTE, true, speaker_unmute_name, true)
    } else {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, speaker_muted_icon, TR_MUTED, true, speaker_muted_name, true)
    }
}

function getScreenSpeakerStatus() {
    if (isMicrophoneMuted) {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, microphone_unmute_icon, TR_UNMUTE, true, microphone_unmute_name, true)
    } else {
        createFooterIconButton(CONTAINER_FOOTER_ICONS, microphone_muted_icon, TR_MUTED, true, microphone_muted_name, true)
    }
}


function reconnectWebRTC() {
    setTimeout(() => {
        if (!connectionWebRTC.socket.connected) {
            $('#connection-timer').addClass('connection-timer-show');
            clearInterval(interval)
            ReconnectionTimer(reconnectWebRTC());
        } else {
            $('#connection-timer').removeClass('connection-timer-show')
        }
    }, 2e3)
}