function removePreloader(){
    $('#preloader').children().remove();
}

function logError(error){
    console.log(error.toString());
}

function getInitialScreen(user) {
    // create more button
    createFooterIconButton(moreButtonContainer, more_icon, null, false, more_btn_name)
    // create chat button
    createFooterIconButton(moreButtonContainer, chat_icon, null, false, chat_name, true, false)
    // create more options popup
    createMoreOptionsPopup(popupIcons, user);
    // set specific buttons
    if(isLecturer) {
        getLecturerScreen();
    }else{
        getMemberScreen();
    } 
    // micarophone button rule
    getScreenSpeakerStatus()
    // speaker button rule
    getRTCMicrophoneButton()
    // video button rule
    getRTCVideoButton();

    //set initial translations
    setGlobalTranslationToHTML();
    return true;
}

function getUserOnlineStatusStyle(user){
    return user.isOnline == true ? 'online' : 'offline';
}

function getLanguagesFlags(){
    
}

function createDarkButton(buttonContainer, id){
    let button = new Button('', `${mindalayBtnDark} ${translation} max-content`, '', true, TRANSLATION_KEY_ID, id)
    buttonContainer.prepend(button);
}

function getLecturerScreen(){
    createDarkButton(footerLeftButtonContainer,'TR_WEBINAR_END')
}

function getMemberScreen(){
    createFooterIconButton(footerIconGroupContainer, raise_a_hand_icon, TR_RAISE_A_HAND, false, raise_a_hand_name, false, true);
}

// create footer icon button
function createFooterIconButton(elementContainer, icon, translationValue, isToggleable = false, id = '', hasNotification = false, title = false){
    let button = new Button(id, `${mindalayFooterBtn} ${translation}`, icon, true, TRANSLATION_KEY_ALT, translationValue)
    if(id === more_btn_name) button.addClass('more-options-button');
    title === true ? button.addClass('mindalay--element-title') : '';
    if(isToggleable){
        button.attr('data-toggle', isToggleable)
    }
    if(hasNotification) button.addClass('mindalay--button-has-notification');
    elementContainer.prepend(button);
}

// create more options popup button
function createPopupButton(icon, text, id, isShow, additionalClass = ''){
    let listRow = new HtmlElement('li', null, null);
    let button = new Button(id, `${popupButton} ${translation} ${additionalClass}`, icon, isShow, TRANSLATION_KEY_ID, text, popupPrefix);
    if(id === webinar_end_btn_name) button.addClass('red-color')
    if(id === chat_name) button.addClass('mindalay--button-has-notification')
    listRow.append(button);
    if(id === logout_btn_name || id === report_btn_name) {
        listRow.prepend(new HrLine());
    }
    morePopup.find(morePopupContainer).append(listRow);
}

// toggle footer button | P.M. the footer icons should always have data-alt attribute for transaltion 
function toggleFooterIconButton(button, icon, translationValue, translationKey = 'data-alt'){
    button.children('svg').remove()
    button.append(icon);
    getTranslation(button, translationKey, translationValue)
}

// toggle video button
function toggleVideoButton(videoStatus, button){
    if(videoStatus){
        toggleFooterIconButton(button, video_muted_icon, TR_OFF_VIDEO)
        isVideoMuted = false;
    }else{
        toggleFooterIconButton(button, video_unmute_icon, TR_ON_VIDEO)
        isVideoMuted = true;
    }
}

// toggle mic button
function toggleMicrophoneButton(microphoneStatus, button){
    if(microphoneStatus){
        toggleFooterIconButton(button, microphone_muted_icon, TR_MUTED)
        isMicrophoneMuted = false;
    }else{
        toggleFooterIconButton(button, microphone_unmute_icon, TR_UNMUTE)
        isMicrophoneMuted = true;
    }
}

// toggle speaker button
function toggleSpeakerButton(speakerState, button){
    if(speakerState){
        toggleFooterIconButton(button, speaker_muted_icon, TR_MUTED)
        isSpeakerMuted = false;
    }else{
        toggleFooterIconButton(button, speaker_unmute_icon, TR_UNMUTE)
        isSpeakerMuted = true;
    }
}

// create more options popup
function createMoreOptionsPopup(popup_icon_list, user){
    if(popup_icon_list.length){
        let popup = getMoreOptionsPopup(user);
        if(!popup.length) throw ''; 
        morePopup.append(popup);
        for (let index = 0; index < popup_icon_list.length; index++) {
            const element = popup_icon_list[index];
            switch (element) {
                case file_btn_name:
                    createPopupButton(file_icon, TR_FILE, file_btn_name, true, hasRightMenu)
                    break;
                case members_btn_name:
                    createPopupButton(members_icon, TR_MEMBERS, members_btn_name, true, hasRightMenu)
                    break;
                case webinar_end_btn_name:
                    if(isLecturer) createPopupButton(webinar_end_icon, TR_WEBINAR_END, webinar_end_btn_name, true)
                    break;
                case screen_share_btn_name:
                    createPopupButton(screen_share_icon, TR_SCREEN_SHARE, screen_share_btn_name, true, hasBoard)
                    break;
                case text_board_btn_name:
                    createPopupButton(text_board_icon, TR_TEXT_BOARD, text_board_btn_name, true, hasBoard)
                    break;
                case blackboard_btn_name:
                    createPopupButton(blackboard_icon, TR_BLACKBOARD, blackboard_btn_name, true, hasBoard)
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

function togglePopup(){
    morePopup.fadeToggle(100);
}

function openPopup(){
    morePopup.fadeIn(100)
}

// toggle right menu with animation
function toggleRightMenu(targetName){
    toggleMenuName(targetName)
    rightMenu = getRightMenu(targetName)
    if(rightMenu) openRightMenu(targetName);
}

function openRightMenu(targetName){
    removeRightMenu()
    let targetMenu = $( `div[data-toggle='${targetName}']`)
    targetMenu.addClass('transform-menu');
    mainContainer.addClass('move-container');
}

function hideRightMenu(targetName){
    $(`#${targetName}`).removeClass('transform-menu');
    if(targetName !== 'mindalay--right-chat-menu'){
        setTimeout(() => {
            $(`#${targetName}`).children().remove()
        }, 300)
    }
    mainContainer.removeClass('move-container');
}

function removeRightMenu(){
    right_menu_conatiner.children().each(function() {
        if($(this).attr('class').includes('transform-menu')){
            $(this).removeClass('transform-menu')
        }
    })
}


