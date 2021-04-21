$(document).ready(async function () {
    setCookie('language', 'en', 5) 
    getLanguages();
    tokenData = getStorageData(TOKEN_KEY);
    await getTranslations();
    if (tokenData) {
        currentUser = getStorageData(USER_KEY);
        webinarData = getStorageData(WEBINAR_DATA_KEY);

        if (currentUser && currentUser.userTypeId === LECTURER_USER_TYPE) {
            isLecturer = true;
        }

        getPreloader('index.html')

        if (webinarData) {
            webinarId = webinarData.webinarId;
            webinarCalendarId = webinarData.webinarCalendarId;
            InitSignalR();
        } else {
            // window.location.href = "/";
            // return;
        }
    } else {
        // window.location.href = "/";
        return;
    }

    // window.onbeforeunload = function (event) {
    //     var message = 'Important: Please click on \'Save\' button to leave this page.';
    //     if (typeof event == 'undefined') {
    //         event = window.event;
    //     }
    //     if (event) {
    //         event.returnValue = message;
    //         setMemberSecondInterval(currentUser, lecturerData.id, webinarCalendarId, 0);
    //     }
    //     return message;
    // };

    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }
    ///////////////////////////////////////////////////////////////////
    // start webinar
    $(document).on('click', '#start-webinar', function () {
        StartWebinar()
    });

    // click video microphone or speacker button action
    $(document).on('click', '.mindalay--footer-btn', function () {
        let button = $(this);
        if (button.attr('data-toggle') == 'true') {
            let button_action = button.attr('id')
            switch (button_action) {
                case microphone_muted_name || microphone_unmute_name:
                    toggleMicrophoneButton(isMicrophoneMuted, button)
                    break;
                case speaker_muted_name || speaker_unmute_name:
                    toggleSpeakerButton(isSpeakerMuted, button)
                    break;
                case video_muted_name || video_unmute_name:
                    toggleVideoButton(isVideoMuted, button)
                    break;
                default:
                    break;
            }
        }
    });

    // popup menu ////////////////////////////////////////////////////////////////////
    $(document).on('click', '#more-popup', function () {
        togglePopup();
    })
    $(document).on('click', '#close-popup', function () {
        togglePopup();
    })
    // ! popup menu ////////////////////////////////////////////////////////////////////

    // right menu ////////////////////////////////////////////////////////////////////
    $(document).on('click', '.has-right-menu', function () {
        let targetName = $(this).attr('id').split('--')[1]
        toggleRightMenu(targetName)
    });
    $(document).on('change', '#is-online-list', function () {
        $('.mindalay--right-menu-item-wrapper').each(function () {
            if ($(this).attr('alt') === 'offline') $(this).toggleClass('d-none')
        })
    });
    $(document).on('click', '.close-right-menu', function () {
        let targetName = $(this).closest('.mindalay--right-menu').attr('id')
        toggleMenuName()
        hideRightMenu(targetName);
    })
    // ! right menu ////////////////////////////////////////////////////////////////////

    // chat ////////////////////////////////////////////////////////////////////
    $(document).on('click', '#mindalay-chat', function () {
        getChat(webinarMessages);
    })
    $(document).on('click', '#popup--mindalay-chat', function () {
        togglePopup();
        getChat(webinarMessages);
    })
    $(document).on('click', '#send-message-button', function () {
        SendMessage()
    })
    // ! chat //////////////////////////////////////////////////////////////////

    // file image menu actions //////////////////////////////////////////////////
    $(document).on('drop', '#uploadRegion', (event) => {
        event.preventDefault();
        if(event.originalEvent.dataTransfer.files.length > 1){
            getSimpleAlert(ALERT_DANGER, '', TR_UPLOAD_FILE_LIMIT)
            return;
        }
        uploadFileValidation(event.originalEvent.dataTransfer.files[0]);
    });
    $(document).on("dragover", '#uploadRegion', function (event) {
        if (!isWebinarStarted) {
            return;
        }
        $(this).addClass('drag-over-style')
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).on("dragleave", '#uploadRegion', function (event) {
        $(this).removeClass('drag-over-style')
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).on('click', '.uploaded-file', function () {
        if (!isWebinarStarted) {
            return;
        }
        var elemSrc = $(this).closest('.mindlay--item-options-wrapper').find('a').attr('href');
        zoomUploadedImage(elemSrc);
    });
    $(document).on('click', '#close-image', function () {
        closeZoomedImage();
    });
    // ! file image menu actions ///////////////////////////////////////////////

    // rich text ///////////////////////////////////////////////////////////////
    $(document).on('click', '#yseditor button', function(){
        $(this).toggleClass('toolBar-active');
    });
    $(document).on('input propertychange paste', '.yseditor-content', function() {
        getTextBoardContent($(this))
    });
    $(document).on('click', '#save-text-file', function() {
        var data = $('.yseditor-content').text();
        if(data){
            saveAsElementContentToFile('', data);
        }
    });
    $(document).on('click', '#clear-textarea', function() {
        let textarea = $('#yseditor').find('.yseditor-content');
        textarea.text('');
        getTextBoardContent(textarea)
    });
    // ! rich text ///////////////////////////////////////////////////////////////

    // member activation modal actions ////////////////////////////////////////// 
    $(document).on('click', '#close-modal', function () {
        RemoveModal();
        let modalName = getModalName($(this))
        console.log(modalName, MODAL_ACTIVITY_MEMBER);
        if(modalName === MODAL_ACTIVITY_MEMBER) setMemberSecondInterval(currentUser, lecturerData.id, webinarCalendarId, 0);
    });
    $(document).on('click', '#im-active', function () {
        RemoveModal();
        setMemberSecondInterval(currentUser, lecturerData.id, webinarCalendarId, 0);
    });
    $(document).on('click', '.member-activity-button', function(){
        let memberId = $(this).attr('data-member');
        if(memberId){
            connection.invoke("CheckStudentActivity", +memberId, webinarCalendarId).then(() =>{
                getSimpleAlert(ALERT_SUCCESS, '', TR_REQUEST_SENT)
                $(this).addClass('d-none')
            }).catch((err) => {
              errorAnalizer("CheckStudentActivity : " + err);
            });
        }
    })
    // ! member activation modal actions ////////////////////////////////////////// 
    
    // board actions /////////////////////////////////////////////////////////////
    $(document).on('click', '.has-board', function () {
        let targetName = $(this).attr('id').split('--')[1]
        togglePopup()
        if($('.mindalay--board-wrapper').attr('data-toggle') == targetName) return
        switch (targetName) {
            case text_board_btn_name:
                if(!webinarResponseData.isTextBoard){
                    if(isOpenedBoards()) foldExistedBoards(TEXT_BOARD)
                    openLocalTextBoard(targetName);
                }
                break;
            case blackboard_btn_name:
                if(isOpenedBoards())foldExistedBoards(BLACK_BOARD)
                break;
            case screen_share_btn_name:
                if(!webinarResponseData.isScreenShare){
                    if(isLecturer){
                        openScreenShareRoom();
                    }else{
                        askRequest('ask-share')
                    }
                } 
                break;
        }
    });
    $(document).on('click', '.full-screen', function(){
        boardToggleFullScreen($(this));
    })
    $(document).on('click', '.close-board', function(){
        let boardType
        $('.mindalay--board-wrapper').each(function(){
            if($(this).attr(DATA_BOARD_FOLDED) !== 'folded') boardType = $(this).attr(DATA_BOARD_ID)
        })
        switch (+boardType) {
            case TEXT_BOARD:
                webinarResponseData.isTextBoard = false;
                connection.invoke("CloseBoard", webinarCalendarId, TEXT_BOARD).then(() => {
                    closeCurrentBoard(boardType)
                    textBoard = null;
                }).catch((err) => {
                    errorAnalizer("CloseBoard : " + err);
                });
                break;
            case BLACK_BOARD:
                break;
            default:
                break;
        }
    });
    $(document).on('click', '.close-local-screen-share', function(){
        stopScreenShare()
    })
    $(document).on('click', '.fold-board', function(){
        let thisBoard = $(this).closest('.mindalay--board-wrapper')
        foldBoard(thisBoard);
    });
    $(document).on('click', '.maximize-board', function(){
        let boardIdentificationId = getFoldedBoardType($(this))
        boardToMaximize(boardIdentificationId);
    });
    $(document).on('click', '#close-share-window', function(){
        StopSharing();
    });
    // ! board actions /////////////////////////////////////////////////////////////
    
    // modal window ////////////////////////////////////////////////////////////////
    $(document).on('click', '.cancel-request', function(){
        let userId = $(this).attr('rel');
        let purpose = $(this).closest('.mindalay--ask-request').attr('data-modalname');
        let request = $(this).closest('.mindalay--modal-body-wrapper');
        if($('.mindalay--modal-body-wrapper').length > 1){
            request.remove()
        }else{
            RemoveModal('ask-share')
        }
        cancelMemberRequest(+userId, purpose);
    })
    $(document).on('click', '.accept-request', function(){
        let userId = $(this).attr('rel');
        let purpose = $(this).closest('.mindalay--ask-request').attr('data-modalname');
        let request = $(this).closest('.mindalay--modal-body-wrapper');
        let Modalname = getModalName($(this))
        if(Modalname === 'ask-share'){
            RemoveModal('ask-share')
        }else{
            if($('.mindalay--modal-body-wrapper').length > 1){
                request.remove()
            }else{
                RemoveModal('ask-share')
            }
        }
        acceptMemberRequest(+userId, purpose);
    })
    // ! modal window /////////////////////////////////////////////////////////////

    // key events /////////////////////////////////////////////////////////////////
    $(document).on('keypress', '#mindalay--chat-message', function (event) {
        var key = event.which;
        if (key == 13) {
            $('#send-message-button').click();
            clearInputValue($(this))
            return false;
        }
    });
})