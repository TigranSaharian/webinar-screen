function webinarScreen() {
    if (!webinarId && !webinarCalendarId) {
        // window.location.href = "/";
        return;
    }
    try {
       connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_URL_DOMAIN_KEY}/webinarscreen`, {
                accessTokenFactory: () => tokenData
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.serverTimeoutInMilliseconds = 1000 * 60 * 10;
        
        Start();

        connection.onclose((err) => {
            errorAnalizer(err)
        });
        
    } catch (ex) {
        errorAnalizer(ex)
        return;
    }

    connection.on('showError', (err) => {
        // console.error(err);
        if (err == 'reconnect') {
            setTimeout(() => {
                Start()
            }, 500);
        } else {
            console.log(err);
        }
    })

    connection.on('onConnected', (webinarData) => {
        webinarResponseData = webinarData;
        webinarUsers = [...webinarData.connectedUserResponseModels];

        if(webinarOnlineUsers?.length){
            webinarOnlineUsers.forEach(data => {
                let user = webinarUsers.find(user => user.id = data.userId)
                user.isOnline = data?.isOnline;
            })
        }
        
        webinarMessages = webinarResponseData.webinarChatResponseModels;
        webinarFiles = webinarResponseData.webinarFilesResponseModels;
        isWebinarStarted = webinarResponseData.isWebinarStarted;

        webinarUsers.forEach(member => {  member.memberLastActivityTime = convertUtcToLocalDateTime(member.memberLastActivityTime)});
        members = webinarUsers.filter(user => user.userTypeId !== LECTURER_USER_TYPE);
        currentUser = webinarUsers.find(user => user.id === currentUser.id);
        lecturerData = webinarResponseData.connectedUserResponseModels.find(data => data.userTypeId === LECTURER_USER_TYPE);
        
        !isLecturer && setMemberActivityTimer()
        if (isWebinarStarted) {
            setInStorage('isWebinarStarted', true);
            !isInitialScreenReady && getInitialScreen(currentUser, webinarResponseData)
        }
    });

    connection.on('notify', (userId, isOnline) => {
        if(!webinarUsers.length){
            webinarOnlineUsers.push({ userId, isOnline });
        }else{
            let selectedUser = webinarUsers.find(user => user.id === userId);
            if(selectedUser){
                selectedUser.isOnline = isOnline;
                toggleActivityTimer(selectedUser)
                updateUserOnlineStatus(selectedUser)
            }
            if(isOnline) notifyOnlineUser(selectedUser)
        }
        // TODO : open when raise a hand action will be ready 
        // if (!isOnline) { 
        //     RemoveRequestWindoe(userId);
        // }
    });

    connection.on('webinarStarted', (webinarStartedStatus) => {
        isWebinarStarted = webinarStartedStatus;
        if (!isInitialScreenReady) AddPreloaderText(TR_PRELOADER_INITIAL_MEMBER_TEXT)
        setInStorage('isWebinarStarted', true);
        if (isWebinarStarted) {
            if (!isInitialScreenReady) getInitialScreen(currentUser)
        }
    });

    connection.on('receiveMessage', (userId, name, message, avatarFilePath) => {
        let messageWrapper = getNewMessageWrapper(userId, name, message, avatarFilePath);
        if (messageWrapper) {
            if(userId === currentUser.id){
                clearInputValue($(this))
            }else{
                if(!isHasChatNotificationStyle){
                    addNotifyStyleToPopupElement(getPopupElement(chat_name));
                    isHasChatNotificationStyle = true;
                } 
            }
            $('#chat-message-container').append(messageWrapper);
            chatScrolToBottom()
        }

        if (currentUser.id !== userId && !isChatMenuOpen) {
            $('#mindalay-chat').addClass('mindalay--button-has-notification')
            if (allowPlayMessageSound) playAudio()
        }
    });

    connection.on('checkActivity', (studentId) => {
        _modalWindow('im-active', TR_CHECK_ATTANTION_TITLE, TR_CHECK_ATTANTION_TEXT, false, TR_CLOSE, '', studentId, MODAL_ACTIVITY_MEMBER)
    });

    connection.on('studentSec', function (userId, newLastACtivityTime) {
        try {
            updateActivityTimer(userId, newLastACtivityTime)
            $(`.member-activity-button[data-member="${userId}"]`).removeClass('d-none')
        } catch (e) {
            consoleError(e);
        }
    });

    connection.on('showUploadedFile', (file) => {
        var $imagesContainer = $('.mindalay--right-menu-items-wrapper');
        webinarFiles.unshift(file);
        if ($imagesContainer) {
            for (var i = 0; i < VALID_FILE_TYPES.length; i++) {
                if (VALID_IMAGE_EXTENTIONS.find(x => x === file[1])) {
                    $imagesContainer.prepend(getUploadedImageContainer(file));
                    break;
                } else {
                    $imagesContainer.prepend(getUploadedFileContainer(file));
                    break;
                }
            }
            $('#mindalay--right-menu').find('#header-content-count').text(` - ${webinarFiles.length}`)
        }
    });

    connection.on('zoomImage', (imageSrc) => {
        if (imageSrc) {
            zoomUploadedImage(imageSrc)
        }
    });

    connection.on('closeImage', () => {
        closeZoomedImage()
    });

    connection.on('sendRichTextData', (suffix) => {
        $('#yseditor').find('.yseditor-content').html(suffix);
    });

    connection.on('openBoardToAll', (boardType, userId, screenShareRoomId) => {
        foldExistedBoards(boardType)
        switch (boardType) {
            case TEXT_BOARD:
                openTextboard(userId, boardType)
                break;
            case BLACK_BOARD:
                openBlackboard(userId, boardType)
                break;
            case SCREEN_SHARE_BOARD:
                joinScreenShareStream(screenShareRoomId, userId, boardType)
                break;
            default:
                break;
        }
    });

    connection.on('closeBoardToAll', (boardType) => {
        closeCurrentBoard(boardType);
    });

    connection.on('getMemberVideoAccessRequest', (memberId, memberStreamId) => {
        if (!isWebinarStarted) {
            return;
        }
        var memberData = members.find(data => data.id === memberId);
        _askModalWindow('ask-video', memberData, memberStreamId, TR_VIDEO_REQUEST);
    })

    connection.on('getMemberScreenShareRequest', (memberId) => {
        if (!isWebinarStarted) {
            return;
        }
        var memberData = members.find(data => data.id === memberId);
        _askModalWindow('ask-share', memberData,'', TR_SCREEN_SHARE);
    })

    connection.on('acceptMemberScreenShare', () => {
        if(!webinarResponseData.isScreenShare){
            openScreenShareRoom();
        } 
    })
    
    connection.on('acceptMemberVideoRequest', () => {

    })

    connection.on('declineMemberRequest', (memberId, cancelId) => {
        if (currentUser.id === memberId) {
          if (cancelId === REQUEST_ASK_SCREEN_SHARE) {
            isScreenShareRequestSend = false;
          } 
          if(cancelId === REQUEST_ASK_VIDEO){
            isVideoRequestSend = false;
            removeStorageItem(isVideoOn);
          }
          getSimpleAlert(ALERT_DANGER, '', TR_REQUEST_FAILD)
        }
    })
}