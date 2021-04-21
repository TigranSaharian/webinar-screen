function Start() {
    connection.start().then(() => {
        connection.invoke('Connect', currentUser.id, webinarCalendarId, webinarId).then(() => {
            if (isLecturer && !isWebinarStarted) {
                AddPreloaderButton();
                AddPreloaderText(TR_PRELOADER_INITIAL_LECTURER_TEXT)
            } else if (!isLecturer && !isWebinarStarted) {
                AddPreloaderText(TR_PRELOADER_INITIAL_MEMBER_TEXT)
            }
            if(connection.state === signalR.HubConnectionState.Connected){
                toggleRecconectionAlert(true);
            }
        }).catch((err) => {
            errorAnalizer(err)
        });
    }).catch((err) => {
        errorAnalizer(err)
    })
    if(connection.state === signalR.HubConnectionState.Connecting){
        toggleRecconectionAlert(false);
    }
}


function toggleRecconectionAlert(isConnected){
    if(isConnected){
        $('#connection-timer').removeClass('connection-timer-show');
    }else{
        $('#connection-timer').addClass('connection-timer-show');
    }
}
// function startStopWebinar() {
//     if (!webinarStart) {
//         connection.invoke('WebinarStart', webinarId, webinarCalendarId, currentUser.id).catch((err) => {
//             errorAnalizer(err);
//         });

//     } else {
//         connection.invoke('WebinarEnd', webinarCalendarId, currentUser.organizationId, 'ru').catch((err) => {
//             errorAnalizer(err);
//         });
//     }
// }

function WebinarStart() {
    if (!isWebinarStarted) {
        console.log(currentUser);
        return connection.invoke('WebinarStart', webinarCalendarId, currentUser.id)
            .then(() => {
                return isWebinarStarted;
            })
            .catch((err) => {
                throw err;
            });
    }
}

function StartWebinar() {
    WebinarStart().then((response) => {
        if (!response) {
            setTimeout(() => {
                StartWebinar();
            }, 1000)
        }
    });
}

function SendMessage() {
    if (!isWebinarStarted) {
        return;
    }
    let messageText = $('#mindalay--chat-message').val();
    if (messageText) {
        connection.invoke('sendMessageTo', messageText.toString(), webinarCalendarId, 0).catch((err) => {
            errorAnalizer("sendMessageTo : " + err.toString());
        });
    }
}

function sendText(text) {
    connection.invoke("GetRichTextData", webinarCalendarId, text).catch((err) => {
      errorAnalizer(err);
    });
}