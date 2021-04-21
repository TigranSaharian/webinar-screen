function removePreloader() {
    PRELOADER.children().remove();
}

//#region UTC Time ///////////////////////////////////////////////////////////////////////////////////////////////
function convertUtcToLocal(date) {
    var local = moment.utc(date).toDate();
    return moment(local).format('HH:mm');
}

function convertUtcToLocalDateTime(date) {
    var local = moment.utc(date).toDate();
    return moment(local).format('YYYY-MM-DD HH:mm:ss');
}

function getUTCTime(dateTime) {
    return moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
}
//#endregion ! UTC Time //////////////////////////////////////////////////////////////////////////////////////////////

//#region Storage ////////////////////////////////////////////////////////////////////////////////////////////////
function setInStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

function removeStorageItem(name) {
    localStorage.removeItem(name);
}

function getStorageData(name) {
    var data = JSON.parse(localStorage.getItem(name));
    return data || null;
}
//#endregion ! Storage ///////////////////////////////////////////////////////////////////////////////////////////////

//#region Member activity timer functions /////////////////////////////////////////////////////////////////////////
var __setMemberSecondInterval = null;

function setMemberSecondInterval(currentUser, LecturerId, webinarCalendarId, second = 0) {
    clearTimeout(__setMemberSecondInterval);
    __setMemberSecondInterval = setTimeout(function () {
        if ($('#mindalay--modal').find(`.mindalay--modal-dialog[data-modalname="${MODAL_ACTIVITY_MEMBER}"]`)[0]) return
        if (LecturerId != null && currentUser != null && webinarCalendarId != null) {
            let lastActivityUTCDate = getUTCTime(new Date())
            connection.invoke('SetStudentSecond', LecturerId, currentUser.id, webinarCalendarId, lastActivityUTCDate).catch((err) => {
                errorAnalizer("SetStudentSecond : " + err);
            });
        }
    }, 1000);
}

function membersActivityTimer() {
    clearInterval(studentsTimersTimeout);
    studentsTimersTimeout = setInterval(function () {
        members.forEach(member => {
            try {
                var obj = document.getElementById('sec' + member.id);
                if (obj && document.getElementById(member.id).getAttribute('alt') == 'online') {
                    var className = 'mindalay--green-color-background mindlay--member-activity-timer';
                    var second = parseInt(obj.getAttribute('rel')) + 1;
                    if (second > 15) className = 'mindalay--orange-color-background mindlay--member-activity-timer';
                    if (second > 30) className = 'mindalay--red-color-background mindlay--member-activity-timer';
                    obj.setAttribute('rel', second);
                    obj.setAttribute('class', className)
                    obj.innerHTML = ('' + second).toHHMMSS();
                }
            } catch (e) {
                consoleError(e);
            }
        });
    }, 1000);
}

function setMemberActivityTimer() {
    if (signalR.HubConnectionState.Connected) {
        document.onmousemove = function () {
            setMemberSecondInterval(currentUser, lecturerData.id, webinarCalendarId, 0);
        }
        document.onkeypress = function () {
            setMemberSecondInterval(currentUser, lecturerData.id, webinarCalendarId, 0);
        }
    }
}

function updateActivityTimer(userId, newLastACtivityTime) {
    let memberTimerElement = document.getElementById('sec' + userId)
    members.forEach(member => {
        member.memberLastActivityTime = convertUtcToLocalDateTime(newLastACtivityTime)
    })
    memberTimerElement && memberTimerElement.setAttribute('rel', 0);
}

function toggleActivityTimer(selectedUser) {
    let element = $(`.mindalay--right-menu-item-wrapper[id="${selectedUser.id}"]`);
    if (selectedUser.isOnline && !element.children('.mindlay--item-options-wrapper')[0]) {
        let userOption = getMemberRules(selectedUser);
        element.append(userOption)
    } else {
        element.children('.mindlay--item-options-wrapper').remove()
    }
    element.attr('alt', getUserOnlineStatusStyle(selectedUser))
}

function removeAllMembersActivityTimers() {
    $('.mindalay--right-menu-item-wrapper').each(function () {
        $(this).find('.mindlay--item-options-wrapper').remove();
    })
}
//#endregion ! Member activity timer functions /////////////////////////////////////////////////////////////////////////

//#region Raise a hand actions //////////////////////////////////////////////////////////////////////////////////////
function RemoveRequestWindoe(userId) {
    $('.request-user-row').each(function () {
        if ($(this) && +$(this).attr('alt') === userId) {
            var index = requestList.findIndex(data => data.studentId === userId);
            requestList.splice(index, 1);
            $(this).remove();
        }
    });
    if ($('.request-user-row').length === 0) {
        $('.pop-up').css('display', 'none');
    }
}
//#endregion ! Raise a hand actions ////////////////////////////////////////////////////////////////////////////////////

//#region Notification //////////////////////////////////////////////////////////////////////////////////////////////
function notifyOnlineUser(onlineUser) {
    if (onlineUser) {
        userOnlineAlert(onlineUser.fullName)
    }
}

function updateUserOnlineStatus(selectedUser) {
    let elements = $(`.member-online-status[rel="${selectedUser.id}"]`)
    elements.each(function () {
        let element = $(this);
        element.removeClass('online offline')
        element.addClass(getUserOnlineStatusStyle(selectedUser))
    })
    $('#header-content-count').text(` - ${webinarUsers.filter(x => x.isOnline).length}`)
}

function getUserOnlineStatusStyle(user) {
    return user.isOnline == true ? 'online' : 'offline';
}
//#endregion Notification //////////////////////////////////////////////////////////////////////////////////////////////

//#region Upload file actions ///////////////////////////////////////////////////////////////////////////////////////
function uploadFileValidation(file) {
    if (!isWebinarStarted) {
        return;
    }
    let validFile = false;
    let fileName = file.name;
    let lastDotIndex = fileName.lastIndexOf('.') + 1;
    for (let j = 0; j < VALID_FILE_TYPES.length; j++) {
        validFile = fileName.substr(lastDotIndex) === VALID_FILE_TYPES[j];
        if (validFile) {
            break;
        }
    }
    if (!validFile) {
        getSimpleAlert(ALERT_DANGER, '', TR_FILE_TYPE_ERROR)
        // errorAnalizer('FILE NOT VALID');
        return;
    }
    uploadFile(file);
}

function uploadFile(file) {
    if (!isWebinarStarted) {
        return;
    }
    if (!isLecturer) {
        return;
    }
    var videoTime;
    // if ($($('#lecturer').children()).children()[0].currentTime) {
    //   videoTime = Math.round($($('#lecturer').children()).children()[0].currentTime);
    // }

    videoTime ? videoTime.toString() : videoTime = '0';
    var data = new FormData();
    data.append('uploadedFile', file);
    data.append('webinarId', webinarId.toString());
    data.append('webinarCalendarId', webinarCalendarId.toString());
    data.append('videoTime', videoTime.toString());

    $.ajax({
        type: 'POST',
        url: `${API_URL_DOMAIN_KEY}/webinarFile/uploadFileToServer`,
        data: data,
        processData: false,
        contentType: false,
        headers: {
            "Authorization": `Bearer ${tokenData.accessToken}`,
        }
    }).done(() => {
        getSimpleAlert(ALERT_SUCCESS, '', TR_FILE_UPLOAD_SUCCESS)
        connection.invoke('UploadedFiles', webinarCalendarId).catch((err) => {
            errorAnalizer(err);
        });
    }).catch(error => {
        ConsoleLog(error)
    });
}

function zoomUploadedImage(elemSrc) {
    if (elemSrc) {
        let $fullSizeImage =
            `<button type="button" id="close-image" class="mindalay--btn">${clsoe_icon}</button>
            <img src="${elemSrc}" id="zoomed-image" class="" />`
        $('#full-size-img').append($fullSizeImage).removeClass('d-none');
        if (isLecturer) {
            connection.invoke('ZoomImagesToAll', elemSrc, webinarCalendarId).catch((err) => {
                errorAnalizer("ZoomImagesToAll : " + err.toString());
            });
        }
    }
}

function closeZoomedImage() {
    var image = $('#full-size-img');
    image.addClass('d-none').children().remove();
    if (image.length > 0 && isLecturer) {
        connection.invoke('CloseImagesToAll', webinarCalendarId).catch((err) => {
            errorAnalizer("CloseImagesToAll : " + err);
        });
    }
}
//#endregion ! Upload file actions /////////////////////////////////////////////////////////////////////////////////////

//#region board actions ////////////////////////////////////////////////////////////////////////////////////////
function boardToggleFullScreen(button) {
    CONTAINER_MAIN_BODY.toggleClass('mindalay--border-full-screen');
    boardToggleButton(button, CONTAINER_MAIN_BODY.hasClass('mindalay--border-full-screen'), minimize_bord_icon, full_screen_icon, TR_MINIMIZE_BOARD, TR_FULL_SCREEN)
}

function openTextboard(userId) {
    webinarResponseData.textboardUserId = userId
    webinarResponseData.isTextBoard = true;
    isLecturer === true ? getBoard(text_board_btn_name, true) : getBoard(text_board_btn_name, false);
}

function openBlackboard(userId) {
    webinarResponseData.blackboardUserId = userId
    webinarResponseData.isBlackboard = true;
    isLecturer === true ? getBoard(blackboard_btn_name, true) : getBoard(blackboard_btn_name, false);
}

function closeCurrentBoard(boardType) {
    switch (boardType) {
        case TEXT_BOARD:
            webinarResponseData.isTextBoard = false;
            webinarResponseData.textboardUserId = null;
            break;
        case BLACK_BOARD:
            webinarResponseData.isBlackboard = false;
            webinarResponseData.blackboardUserId = null;
            break;
        case SCREEN_SHARE_BOARD:
            if (screenShareConnection) stopScreenShare();
            break;
        default:
            break;
    }
    __closeCurrentBoard(boardType);
}

function __closeCurrentBoard(boardType) {
    try {
        $(`.mindalay--board-wrapper[${DATA_BOARD_ID}="${boardType}"]`).remove();
        removeFoldedButtonsGroup(boardType);
        if ($(`.mindalay--board-wrapper[${DATA_BOARD_ID}="${boardType}"]`)[0]) throw '';
    } catch {
        setTimeout(() => {
            __closeCurrentBoard(boardType)
        }, 1000)
    }
}

function foldExistedBoards(newBoardType) {
    $('.mindalay--board-wrapper').each(function () {
        let board = $(this);
        if (+board.attr(DATA_BOARD_ID) !== newBoardType) {
            let boardUserId = getBoardUserId(board)
            console.log(boardUserId);
            foldBoard(board, boardUserId)
        }
    })
    return true;
}

let boardUserId
function getBoardUserId(board) {
    if (+board.attr(DATA_BOARD_ID) === SCREEN_SHARE_BOARD) boardUserId = webinarResponseData.screenSharedUserId
    if (+board.attr(DATA_BOARD_ID) === TEXT_BOARD) boardUserId = webinarResponseData.textboardUserId
    if (+board.attr(DATA_BOARD_ID) === BLACK_BOARD) boardUserId = webinarResponseData.blackboardUserId
    return boardUserId;
}

function foldBoard(board, boardUserId = '') {
    let boardIdentificator = board.attr(DATA_BOARD_ID);
    let isShowCloseButton

    if (boardUserId) {
        isShowCloseButton = true ? (boardUserId === currentUser.id || isLecturer && webinarResponseData.screenSharedUserId !== boardUserId) : false;
    } else {
        isShowCloseButton = false;
    }

    if (board.attr('data-board-folded') !== 'folded') {
        board.addClass('d-none').attr('data-board-folded', 'folded')
    }
    foldBoardToButtom(boardIdentificator, isShowCloseButton)
}

function isOpenedBoards() {
    return $(`.mindalay--board-wrapper[${DATA_BOARD_FOLDED}="open"]`).length ? true : false;
}

function getFoldedBoardType(element) {
    return element.closest('.board-buttons-group').attr(DATA_BOARD_ID)
}

function boardToMaximize(boardType) {
    if (CONTAINER_MAIN_BODY.hasClass('mindalay--border-full-screen')) {
        return;
    }

    let board = $(`.mindalay--board-wrapper[${DATA_BOARD_ID}="${boardType}"]`)
    if (board[0]) {
        if (isOpenedBoards()) foldExistedBoards(boardType)
        removeFoldedButtonsGroup(boardType)
        board.removeClass('d-none');
        board.attr(DATA_BOARD_FOLDED, 'open')
    }
}

function removeFoldedButtonsGroup(boardType) {
    let boardFoldedButtonsGroup = $(`.board-buttons-group[${DATA_BOARD_ID}="${boardType}"]`)
    if (boardFoldedButtonsGroup[0]) {
        boardFoldedButtonsGroup.remove();
    }
}

function foldBoardToButtom(boardIdentificator, isShowCloseButton) {
    switch (+boardIdentificator) {
        case TEXT_BOARD:
            buttonGroup = getBoardFoldButtonGroup(text_board_icon, TR_TEXT_BOARD, TEXT_BOARD, isShowCloseButton)
            break;
        case SCREEN_SHARE_BOARD:
            buttonGroup = getBoardFoldButtonGroup(screen_share_icon, TR_SCREEN_SHARE, SCREEN_SHARE_BOARD, isShowCloseButton)
            break;
        case BLACK_BOARD:
            buttonGroup = getBoardFoldButtonGroup(blackboard_icon, TR_BLACKBOARD, BLACK_BOARD, isShowCloseButton)
            break;
        default:
            break;
    }
    boardToggleButton($('#board--full-screen'), true, full_screen_icon, minimize_bord_icon, TR_FULL_SCREEN, TR_MINIMIZE_BOARD)
    CONTAINER_MAIN_BODY.removeClass('mindalay--border-full-screen')
}

function boardToggleButton(button, isToggled, newIcon, toggledIcon, newIconName, toggledIconName) {
    if (isToggled) {
        button.children().remove()
        button.append(newIcon)
        button.attr(TRANSLATION_KEY_TITLE, newIconName)
        getTranslation(button, TRANSLATION_KEY_TITLE, newIconName)
    } else {
        button.children().remove()
        button.append(toggledIcon)
        button.attr(TRANSLATION_KEY_TITLE, toggledIconName)
        getTranslation(button, TRANSLATION_KEY_TITLE, toggledIconName)
    }
}
//#endregion ! board actions ////////////////////////////////////////////////////////////////////////////////////////

//#region  ask reuqest ////////////////////////////////////////////////////////////////////////////////////////
function askRequest(purpose) {
    // if (currentUserStreamId === undefined || currentUserStreamId === null) return;
    if (!isWebinarStarted) {
        return;
    }

    if (purpose === 'ask-video' && !isLecturer) {
        if (isVideoRequestSend) {
            return;
        }

        isVideoRequestSend = true;
        connection.invoke('MemberVideoAccessRequest', lecturerData.id, currentUser.id, currentUserStreamId, webinarCalendarId);
    }

    if (purpose === 'ask-share' && !isLecturer) {
        if (isScreenShareRequestSend) {
            return;
        }

        isScreenShareRequestSend = true;
        connection.invoke('MemberScreenShareRequest', lecturerData.id, currentUser.id, webinarCalendarId).catch((err) => {
            errorAnalizer(err)
        });
    }
}

function cancelMemberRequest(memberId, purpose) {
    try {
        if (purpose === 'ask-video') {
            connection.invoke('CancelMemberAskRequest', memberId, REQUEST_ASK_VIDEO, webinarCalendarId).catch(err => {
                errorAnalizer(err);
            });
        }

        if (purpose === 'ask-share') {
            connection.invoke('CancelMemberAskRequest', memberId, REQUEST_ASK_SCREEN_SHARE, webinarCalendarId).catch(err => {
                errorAnalizer(err);
            });
        }
    } catch (ex) {
        consoleError(ex)
        setTimeout(() => {
            cancelMemberRequest(memberId, purpose)
        }, 1000);
    }
}

function acceptMemberRequest(memberId, purpose) {
    try {
        if (purpose === 'ask-video') {
            let memberStramId = getMemberStreamIdFromModal(memberId)
            connection.invoke('AcceptMemberVideoRequest', studentId, webinarCalendarId, memberStramId).catch(err => {
                errorAnalizer(err);
            });
        }

        if (purpose === 'ask-share') {
            connection.invoke('AcceptMemberScreenShareRequest', memberId, webinarCalendarId).catch(err => {
                errorAnalizer(err);
            });
        }
    } catch (ex) {
        consoleError(ex)
        setTimeout(() => {
            acceptMemberRequest(memberId, purpose)
        }, 1000);
    }
}
//#endregion ! ask request ////////////////////////////////////////////////////////////////////////////////////////

//#region text baord ////////////////////////////////////////////////////////////////////////////////////////
function openLocalTextBoard(targetName) {
    connection.invoke("OpenBoard", webinarCalendarId, TEXT_BOARD, currentUser.id, '')
        .then(() => {
            getBoard(targetName, true)
            webinarResponseData.textboardUserId = currentUser.id
            webinarResponseData.isTextBoard = true;
        }).catch((err) => {
            errorAnalizer("OpenBoard : " + err);
        });
}

function getTextBoardContent(textarea) {
    clearTimeout(textTimeout);
    textTimeout = setTimeout(() => {
        webinarResponseData.textBoardData = textarea.html()
        sendText(textarea.html());
    }, 500);
}

function saveAsElementContentToFile(mimeType = '', data) {
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    link.setAttribute('download', 'blackboard-text.txt');
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(data));
    link.click();
}

// TODO : not completed yet
function restoreTextareaDate() {
    try {
        let textarea = $('#yseditor').find('.yseditor-content');
        if (textarea && webinarResponseData.textBoardData) {
            textarea.text(webinarResponseData.textBoardData)
            getTextBoardContent(textarea)
        } else {
            throw ''
        }
    } catch {
        setTimeout(() => {
            restoreTextareaDate()
        }, 500)
    }
}
//#endregion ! text baord ////////////////////////////////////////////////////////////////////////////////////////

//#region ! Error handling ////////////////////////////////////////////////////////////////////////////////////////
function logError(error) {
    console.log(error.toString());
}

function consoleError() {
    if (consoleLog) {
        var log = "";
        for (var index = 0; index < arguments.length; index++) {
            log += arguments[index] + " "
        }

        console.error(log);
    }
}

function consoleLog() {
    if (consoleLog) {
        var log = "";
        for (var index = 0; index < arguments.length; index++) {
            log += arguments[index] + " "
        }

        console.log(log);
    }
}

function errorAnalizer(err) {
    console.log(err);
    if (err == undefined) {}
    if (connection.state && connection.state === signalR.HubConnectionState.Disconnected) {
        ReconnectionTimer(InitSignalR(1000))
    }
    //if(connectionWebRTC.status) {}
    //if(globalConnection.status) {}
}
//#endregion ! Error handling ////////////////////////////////////////////////////////////////////////////////////////

function getInitialScreen(currentUser, webinarData) {
    getWebinarScreenStaticItems(currentUser)

    // get specific user buttons
    if (isLecturer) {
        getLecturerScreen();
    } else {
        getMemberScreen();
    }

    // get existed chat content
    appendChatContent(webinarMessages);


    // micarophone button rule
    getScreenSpeakerStatus()
    // speaker button rule
    getRTCMicrophoneButton()
    // video button rule
    getRTCVideoButton();

    //set initial translations
    setGlobalTranslationToHTML();

    // is text board
    if (webinarData && webinarData.isTextBoard) restoreTextBoard(webinarData)

    if (webinarData && webinarData.isScreenShare) restoreScreenShare(webinarData)

    removePreloader();
    getConnectionLostAlert()
    openVideoConnection()
    // if(webinarData && webinarData.webinarEndTime) getWebinarEndTimer(webinarData.webinarEndTime)
    isInitialScreenReady = true;
}

function restoreScreenShare(webinarData) {
    if (isOpenedBoards()) {
        foldExistedBoards(SCREEN_SHARE_BOARD);
        joinScreenShareStream(webinarData.screenShareRoomId, webinarData.screenSharedUserId)
    } else {
        joinScreenShareStream(webinarData.screenShareRoomId, webinarData.screenSharedUserId)
    }
}

function restoreTextBoard(webinarData) {
    (webinarData.textboardUserId === currentUser.id || isLecturer) ? getBoard(text_board_btn_name, true): getBoard(text_board_btn_name, false);
    $('#yseditor').find('.yseditor-content').append(webinarData.textBoardData)
}

function getWebinarScreenStaticItems(currentUser) {
    createFooterIconButton(CONTAINER_FOOTER_RIGHT_BUTTONS, more_icon, null, false, more_btn_name)
    createFooterIconButton(CONTAINER_FOOTER_RIGHT_BUTTONS, chat_icon, null, false, chat_name, false)
    createMoreOptionsPopup(MINDALAY_POPUP_ICONS, currentUser);
}

function getLanguagesFlags() {

}

function getLecturerScreen() {
    let button = new Button('', `${MINDALAY_BUTTON_DARK} ${TRANSLATION} max-content`, '', true, TRANSLATION_KEY_ID, TR_WEBINAR_END)
    CONTAINER_FOOTER_LEFT_BUTTONS.prepend(button);
}

function getMemberScreen() {
    createFooterIconButton(CONTAINER_FOOTER_ICONS, raise_a_hand_icon, TR_RAISE_A_HAND, false, raise_a_hand_name, true);
}

// create footer icon button
function createFooterIconButton(elementContainer, icon, translationValue, isToggleable = false, id = '', title = false) {
    let button = new Button(id, `${MINDALAY_FOOTER_BUTTON} ${TRANSLATION}`, icon, true, TRANSLATION_KEY_ALT, translationValue)
    if (id === more_btn_name) button.addClass('more-options-button');
    title === true ? button.addClass('mindalay--element-title') : '';
    if (isToggleable) {
        button.attr('data-toggle', isToggleable)
    }
    elementContainer.prepend(button);
}

// create more options popup button
function createPopupButton(icon, text, id, isShow, additionalClass = '') {

    let hrLine = '';
    if (id === logout_btn_name || id === report_btn_name) hrLine = '<hr>';

    let listRow =
        `<li class="mindalay--popup-menu-item-wrapper ${additionalClass}" id="${PREFIX_POPUP + id}">
        ${hrLine}
        <div class="mindalay--popup-button">
            ${icon}
            <button type="button" class="${TRANSLATION}" data-id="${text}"></button>
        </div>
    </li>`;

    MINDALAY_POPUP.find(POPUP_CONTAINER).append(listRow);
}

// toggle footer button | P.M. the footer icons should always have data-alt attribute for transaltion 
function toggleFooterIconButton(button, icon, translationValue, translationKey = 'data-alt') {
    button.children('svg').remove()
    button.append(icon);
    getTranslation(button, translationKey, translationValue)
}

// toggle video button
function toggleVideoButton(videoStatus, button) {
    if (videoStatus) {
        toggleFooterIconButton(button, video_muted_icon, TR_OFF_VIDEO)
        isVideoMuted = false;
    } else {
        toggleFooterIconButton(button, video_unmute_icon, TR_ON_VIDEO)
        isVideoMuted = true;
    }
}

// toggle mic button
function toggleMicrophoneButton(microphoneStatus, button) {
    if (microphoneStatus) {
        toggleFooterIconButton(button, microphone_muted_icon, TR_MUTED)
        isMicrophoneMuted = false;
    } else {
        toggleFooterIconButton(button, microphone_unmute_icon, TR_UNMUTE)
        isMicrophoneMuted = true;
    }
}

// toggle speaker button
function toggleSpeakerButton(speakerState, button) {
    if (speakerState) {
        toggleFooterIconButton(button, speaker_muted_icon, TR_MUTED)
        isSpeakerMuted = false;
    } else {
        toggleFooterIconButton(button, speaker_unmute_icon, TR_UNMUTE)
        isSpeakerMuted = true;
    }
}

// create more options popup
function createMoreOptionsPopup(popup_icon_list, user) {
    if (popup_icon_list.length) {
        let popup = getMoreOptionsPopup(user);
        if (!popup.length) throw '';
        MINDALAY_POPUP.append(popup);
        for (let index = 0; index < popup_icon_list.length; index++) {
            const element = popup_icon_list[index];
            switch (element) {
                case file_btn_name:
                    createPopupButton(file_icon, TR_FILE, file_btn_name, true, HAS_RIGHT_MENU)
                    break;
                case members_btn_name:
                    createPopupButton(members_icon, TR_MEMBERS, members_btn_name, true, HAS_RIGHT_MENU)
                    break;
                case webinar_end_btn_name:
                    if (isLecturer) createPopupButton(webinar_end_icon, TR_WEBINAR_END, webinar_end_btn_name, true)
                    break;
                case screen_share_btn_name:
                    createPopupButton(screen_share_icon, TR_SCREEN_SHARE, screen_share_btn_name, true, HAS_BOARD)
                    break;
                case text_board_btn_name:
                    createPopupButton(text_board_icon, TR_TEXT_BOARD, text_board_btn_name, true, HAS_BOARD)
                    break;
                case blackboard_btn_name:
                    createPopupButton(blackboard_icon, TR_BLACKBOARD, blackboard_btn_name, true, HAS_BOARD)
                    break;
                case report_btn_name:
                    createPopupButton(report_icon, TR_REPORT, report_btn_name, true)
                    break;
                case settings_btn_name:
                    createPopupButton(settings_icon, TR_SETTINGS, settings_btn_name, true)
                    break;
                case logout_btn_name:
                    createPopupButton(logout_icon, TR_LOG_OUT, logout_btn_name, true)
                    break;
                case chat_name:
                    createPopupButton(chat_icon, TR_CHAT, chat_name, true)
                    break;
                default:
                    break;
            }
        }
    }
}

function togglePopup() {
    MINDALAY_POPUP.fadeToggle(100);
}

function openPopup() {
    MINDALAY_POPUP.fadeIn(100)
}

function hideRightMenu(targetName) {
    $(`#${targetName}`).removeClass('transform-menu');
    if (targetName !== 'mindalay--right-chat-menu') {
        setTimeout(() => {
            $(`#${targetName}`).children().remove()
        }, 150)
    }
    isChatMenuOpen = false;
    CONTAINER_MAIN_BODY.removeClass('move-container');
}

function toggleRightMenu(targetName) {
    RIGHT_MENU_CONTAINER.children().each(function () {
        if ($(this).attr('class').includes('transform-menu')) {
            $(this).removeClass('transform-menu')
            if ($(this).attr('data-toggle') !== chat_name) {
                $(this).children().remove();
            } else {
                isChatMenuOpen = !isChatMenuOpen
            }
            CONTAINER_MAIN_BODY.removeClass('move-container');
        }
    })
    let rightMenu = getRightMenu(targetName)

    if (rightMenu) {
        togglePopup()
        toggleMenuName(targetName)
        let targetMenu = $(`div[data-toggle='${targetName}']`)
        setTimeout(() => {
            CONTAINER_MAIN_BODY.addClass('move-container');
            targetMenu.addClass('transform-menu');
        }, 150)
    }
}

function togglChatIconAnimation(targetName) {
    if (targetName === 'mindalay--right-chat-menu') {
        isChatMenuOpen = !isChatMenuOpen
    }
}

/////////////////////////////////////////////////////////////////////////

function getPopupElement(targetName){
    let element = $('#popup-body').find(`.mindalay--popup-menu-item-wrapper[id=${PREFIX_POPUP}${targetName}]`);
    console.log(element[0]);
    return element;
}

function addNotifyStyleToPopupElement(element){
    element && element.find('.mindalay--popup-button').addClass('mindalay--button-has-notification')
}

function removeNotifyStyleFromPopupElement(element){
    element && element.find('.mindalay--popup-button').removeClass('mindalay--button-has-notification')
}

//#region count down timer ///////////////////////////////////////////////////////////////////////////
function setCountDown(date) {
    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
    const countDown = new Date(date).getTime();
        console.log(countDown, new Date(date));
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDown - now;
        let hours = Math.floor((distance % (day)) / (hour));
        let minutes = Math.floor((distance % (hour)) / (minute));
        let seconds = Math.floor((distance % (minute)) / second) + 1;
        if (distance < 0) {
            clearInterval(interval);
        }

        if (seconds.toString().length === 1) seconds = `0${seconds.toString()}`;
        if (minutes.toString().length === 1) minutes = `0${minutes.toString()}`;
        if (hours.toString().length === 1) hours = `0${hours.toString()}`;
        if (seconds === 60) {
            ++minutes
            seconds = 0;
            seconds = `0${seconds.toString()}`;
        }
        if (minutes === 60) {
            ++hours;
            minutes = 0;
            minutes = `0${minutes.toString()}`;
        }

        if (hours < 1 && minutes <= 10) $('#webinar-end-timer').addClass('red-border');
        $('#webinar-end-timer').find('.timer').text(hours + ':' + minutes + ':' + seconds)
        if (hours < 0) $('#webinar-end-timer').find('.timer').text('00:00:00')
    }, 1000);
};

function ReconnectionTimer(recursivMethod) {
    if (reconnectionTimerCount <= 10) {
        reconnectionTimerInterval = setInterval(() => {
            // console.log(connection.state, signalR.HubConnectionState.Disconnected);
            if (connection.state && connection.state === signalR.HubConnectionState.Connecting) {
                console.log(reconnectionTimerCount);
                ++reconnectionTimerCount;
                ++reconnectiontDots;
                if (reconnectiontDots > 3) {
                    $('.connection-dots').text('');
                    reconnectiontDots = 0;
                }
                $('.connection-dots').append('.');
                console.log(reconnectionTimerCount);
                if (reconnectionTimerCount === 10) {
                    reconnectionTimerCount = 0;
                    recursivMethod();
                }
            } else {
                // console.log(reconnectionTimerInterval);
                clearInterval(reconnectionTimerInterval);
                // location.reload();
                return;
            }
        }, 1000);
    }
}

function getWebinarEndTimer(webinarEndTime){
    let $timerWrapper = `<div id="webinar-end-timer" class="webinar-end-timer d-flex">
                            <span class="timer" data-title="${TR_WEBINAR_IS_ENDED}" title=""></span>
                        </div>`
    $('body').append($timerWrapper);
    setCountDown(webinarEndTime);
    getTranslation($('#webinar-end-timer').find('.timer'), TRANSLATION_KEY_TITLE, TR_WEBINAR_IS_ENDED)
}
//#endregion ! count down timer ///////////////////////////////////////////////////////////////////////////

//#region Modal window ///////////////////////////////////////////////////////////////////////////
function OpenModal() {
    $('#mindalay--modal-backdrop').addClass('mindalay--modal-backdrop');
    MINDALAY_MODAL_WINDOW.addClass('show-mindalay--modal')
}

function RemoveModal(modalName = '') {
    $('#mindalay--modal-backdrop').removeClass('mindalay--modal-backdrop');
    if (modalName) {
        MINDALAY_MODAL_WINDOW.each(function () {
            let request = $(this).find('.mindalay--ask-request');
            if (request.length === 1) {
                MINDALAY_MODAL_WINDOW.removeClass('show-mindalay--modal')
                setTimeout(() => {
                    MINDALAY_MODAL_WINDOW.children().remove()
                }, 300)
            } else {
                let __request = $(this).find(`.mindalay--ask-request[data-modalname="${modalName}"]`)
                __request.remove();
            }
        })
    } else {
        MINDALAY_MODAL_WINDOW.removeClass('show-mindalay--modal')
        setTimeout(() => {
            MINDALAY_MODAL_WINDOW.children().remove()
        }, 300)
    }
}

function _modalWindow(actionName, title, bodyText, isShowCancelBtn, confirmBtnName, cancelBtnName = '', id, modalName) {
    let cancelBtn = ''
    cancelBtnName === '' ? cancelBtnName = TR_NO : cancelBtnName;
    if (isShowCancelBtn) cancelBtn = `<button type="button" class="mindalay--btn-blue mindalay--btn ${TRANSLATION}" data-id="${cancelBtnName}" id="modal-no-button"></button>`;
    let titleContent = ''
    if (title) titleContent = `<h5 class="mindalay--modal-title ${TRANSLATION}" id="modal-title" data-id="${title}"></h5>`;
    let bodyConetnt = ''
    if (bodyText) bodyConetnt = `<p class="${TRANSLATION}" id="modal-text" data-id="${bodyText}"></p>`

    let $modalWindow =
        `<div class="mindalay--modal-dialog" data-modalname="${modalName}">
            <div class="mindalay--modal-content">
                <div class="mindalay--modal-header">
                    ${titleContent}
                    <button type="button" class="close" rel="${id}" id="close-modal"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="mindalay--modal-body">
                    ${bodyConetnt}
                </div>
                <div class="mindalay--modal-footer">
                    <button type="button" class="mindalay--btn-dark mindalay--btn ${TRANSLATION}" id="${actionName}" rel="${id}" data-id="${confirmBtnName}"></button>
                    ${cancelBtn}
                </div>
            </div>
        </div>`
    MINDALAY_MODAL_WINDOW.append($modalWindow);
    OpenModal()
    if (title) getTranslation($('#modal-title'), TRANSLATION_KEY_ID, title)
    if (bodyText) getTranslation($('#modal-text'), TRANSLATION_KEY_ID, bodyText)
    if (isShowCancelBtn) getTranslation($('#modal-no-button'), TRANSLATION_KEY_ID, cancelBtnName)
    getTranslation($(`#${actionName}`), TRANSLATION_KEY_ID, confirmBtnName)
}

function _askModalWindow(modalName, member, memberStreamId, actionName) {
    console.log(modalName, member, memberStreamId, actionName);
    let actionNameElement = `<h5 class="mindalay--modal-title ${TRANSLATION}" id="modal-title" data-id="${actionName}"></h5>`;
    let $modalBodyWrapper = _getAskModalBody(modalName, member, memberStreamId)
    if (MINDALAY_MODAL_WINDOW.find('.mindalay--modal-body-wrapper')[0]) {
        let modalContainer = MINDALAY_MODAL_WINDOW.find('.mindalay--modal-body-container');
        modalContainer.append($modalBodyWrapper)
    } else {
        let $modalWindow =
            `<div class="mindalay--modal-dialog mindalay--ask-request" data-modalname="${modalName}">
                <div class="mindalay--modal-content">
                    <div class="mindalay--modal-header mindalay--brand-color-background">
                        ${actionNameElement}
                    </div>
                    <div class="mindalay--modal-body-container">
                        ${$modalBodyWrapper}
                    </div>
                </div>
            </div>`
        MINDALAY_MODAL_WINDOW.append($modalWindow);
        OpenModal()
    }
    getTranslation($(`#accept--${modalName}-${member.id}`), TRANSLATION_KEY_ID, TR_ACCEPT)
    getTranslation($('#modal-title'), TRANSLATION_KEY_ID, actionName)
    getTranslation($(`#cancel--${modalName}-${member.id}`), TRANSLATION_KEY_ID, TR_CANCEL)
}

function _getAskModalBody(modalName, member, memberStreamId) {
    let $bodyConetnt = `<div class="mindalay--modal-member-wrapper">
                            <div class="mindalay--member" style="background-image: url(${member.avatarFilePath})"></div>
                            <p id="modal-text">${member.fullName}</p>
                        </div>`;

    let $modalFooter = `<div class="mindalay--modal-footer">
                            <button type="button" class="mindalay--btn-dark mindalay--btn accept-request ${TRANSLATION}" id="accept--${modalName}-${member.id}" rel="${member.id}" data-id="${TR_ACCEPT}"></button>
                            <button type="button" class="mindalay--btn-blue mindalay--btn cancel-request ${TRANSLATION}" id="cancel--${modalName}-${member.id}" rel="${member.id}" data-id="${TR_CANCEL}"></button>
                        </div>`;

    let $modalBodyWrapper = `<div class="mindalay--modal-body-wrapper" rel="${memberStreamId}" alt="${member.id}">
                                ${$bodyConetnt}
                                ${$modalFooter}
                            </div>`;
    return $modalBodyWrapper;
}

function getModalWindowName() {
    return $('#mindalay--modal').find('.mindalay--modal-dialog').attr('data-modalname')
}

function getMemberStreamIdFromModal(memberId) {
    let memberStreamId = $(`.mindalay--modal-body-wrapper[alt="${memberId}"]`).attr('data-stramURL');
    if (memberStreamId) return memberStreamId;
}

function getModalName(button) {
    let modalName = button.closest('.mindalay--modal-dialog').attr('data-modalname');
    if (modalName) return modalName;
}
//#endregion ! Modal window ///////////////////////////////////////////////////////////////////////////