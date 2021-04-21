function openVideoConnection() {
    connectionWebRTC.userid = currentUser.id
    connectionWebRTC.openOrJoin(webinarCalendarId, function(isRoomExist, roomid, error) {
      if(error) {
        connectionWebRTC.open(webinarCalendarId, function(isRoomOpened, roomid, error) {
          if (error === 'Room not available' && isRoomOpened === false) {
            openVideoConnection();
          }
        });
      }
      else if (connectionWebRTC.isInitiator === true) {
        consoleLog("room doesn't exist, it means that current user will create the room");
      }
    });
  };

function createBlackboard(){
    designer.appendTo(document.getElementById('widget-container'), function() {
        openVideoConnection();
    });
}

function ReconnectConnectionWebRTC() {
    setTimeout(() => {
        if (!connectionWebRTC.socket.connected) {
            $('#connection-timer').addClass('connection-timer-show');
            clearInterval(interval)
            Timer(ReconnectConnectionWebRTC());
        } else {
            $('#connection-timer').removeClass('connection-timer-show')
        }
    }, 2e3)
}

function  createVideoElement(event, video) {
    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    };

    if (event.type === 'local') {
        video.volume = 0;
        try {
            video.setAttributeNode(document.createAttribute('muted'));
        } catch (e) {
            video.setAttribute('muted', true);
        };
    };
}

function AppendMediaElement(container, mediaElement) {
    // if ($(`#${mediaElement.id}`)) $(`#${mediaElement.id}`).remove();
    container.append(mediaElement);
  }

function SetStreamQuality(minWidth, maxWidth, minHeight, maxHeight, minFrameRate, maxFrameRate, maxAspetRatio) {
    if (DetectRTC.browser.name == 'Firefox') {
        connectionWebRTC.mediaConstraints = {
            audio: true,
            video: {
                width: maxWidth * multiple,
                height: maxHeight * multiple,
                frameRate: minFrameRate,
                // aspectRatio: aspectRatio,
                facingMode: 'user' // or "application"
            }
        };
    } else {
        connectionWebRTC.mediaConstraints = {
            audio: true,
            video: {
                mandatory: {
                    minWidth: minWidth * multiple,
                    maxWidth: maxWidth * multiple,
                    minHeight: minHeight * multiple,
                    maxHeight: maxHeight * multiple,
                    minFrameRate: minFrameRate,
                    maxFrameRate: maxFrameRate,
                    // minAspectRatio: minAspectRatio,
                    aspectRatio: maxAspetRatio
                },
                optional: [{
                    facingMode: 'user' // or "application"
                }]
            }
        };
    }
}

function defaultMediaElementRuls(event) {
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;
  }

  //#region the current stream video/audio on/off actions
  function videoOff() {
    connectionWebRTC.attachStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'video') {
          track.enabled = false;
        };
      });
    });
  };
  
  function videoOn() {
    connectionWebRTC.attachStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'video') {
          track.enabled = true;
          // StartStreamRecording(stream);
        };
      });
    });
  };
  
  function audioMute() {
    connectionWebRTC.attachStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'audio') {
          track.enabled = false;
        };
      });
    });
  };
  
  function audioUnmuted() {
    connectionWebRTC.attachStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'audio') {
          track.enabled = true;
        };
      });
    });
  };
  //#endregion
  