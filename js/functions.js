function GetTranslation(){
    return;
}

function RemovePreloader(){
    $('#preloader').children().remove();
}

function LogError(error){
    console.log(error.toString());
}

function GetInitialScreen(user) {
    // create more button
    CreateFooterIconButton(moreButtonContainer, more_icon, null, false, more_btn_name)
    // create chat button
    CreateFooterIconButton(moreButtonContainer, chat_icon, null, false, chat_btn_name, true)
    // create more options popup
    CreateMoreOptionsPopup(popupIcons, user);
    // set specific buttons
    if(isLecturer) {
        GetLecturerScreen();
    }else{
        GetMemberScreen();
    } 
    // micarophone button rule
    GetScreenSpeakerStatus()
    // speaker button rule
    GetRTCMicrophoneButton()
    // video button rule
    GetRTCVideoButton();
    return true;
}

function GetUserOnlineStyle(user){
    return user.isOnline == true ? 'online' : 'offline';
}

function CreateDarkButton(buttonContainer, text){
    let button = new Button(mindalayBtnDark, null, text, null, false, text);
    buttonContainer.prepend(button[0]);
}

function GetLecturerScreen(){
    CreateDarkButton(footerLeftButtonContainer,'TR_WEBINAR_END')
}

function GetMemberScreen(){
    CreateFooterIconButton(footerIconGroupContainer, raise_a_hand_icon,'TR_HAND', false, raise_a_hand_btn_name);
}

function CreateFooterIconButton(buttonContainer, icon, translation, isToggleable, buttonName, hasNotification = false){
    let button = new Button(mindalayFooterBtn, icon, buttonName, null, false, null)
    if(buttonName === more_btn_name) button.addClass('more-options-button');
    if(isToggleable){
        button.addClass('mindalay--element-title');
        button.attr('data-toggle', isToggleable)
        button.attr('rel', translation);
    }
    if(hasNotification) button.addClass('mindalay--button-has-notification');
    buttonContainer.prepend(button);
}

function CreatePopupButton(icon, text, name, isHidden){
    let listRow = new HtmlElement('li', null, null);
    let button = new Button(popupButton, icon, name, popupPrefix, isHidden, text)
    button.attr('data-toggle', name);
    if(name === webinar_end_btn_name) button.addClass('red-color')
    if(name === chat_btn_name) button.addClass('mindalay--button-has-notification')
    listRow.append(button);
    if(name === logout_btn_name || name === report_btn_name) {
        listRow.prepend(new HrLine());
    }
    morePopup.find(morePopupContainer).append(listRow);
}

// toggle footer button
function ToggleFooterIconButton(button, icon, btn_title){
    button.children('svg').remove()
    button.attr('rel', btn_title);
    button.append(icon);
    GetTranslation();
}

// toggle video button
function ToggleVideoButton(videoStatus, button){
    if(videoStatus){
        ToggleFooterIconButton(button, video_muted_icon, 'TR_VIDEO_MUTED')
        isVideoMuted = false;
    }else{
        ToggleFooterIconButton(button, video_unmute_icon, 'TR_VIDEO_UNMUTE')
        isVideoMuted = true;
    }
}

// toggle mic button
function ToggleMicrophoneButton(microphoneStatus, button){
    if(microphoneStatus){
        ToggleFooterIconButton(button, microphone_muted_icon, 'TR_MICROPHONE_MUTED')
        isMicrophoneMuted = false;
    }else{
        ToggleFooterIconButton(button, microphone_unmute_icon, 'TR_MICROPHONE_UNMUTE')
        isMicrophoneMuted = true;
    }
}

// toggle speaker button
function ToggleSpeakerButton(speakerState, button){
    if(speakerState){
        ToggleFooterIconButton(button, speaker_muted_icon, 'TR_SPEAKER_MUTED')
        isSpeakerMuted = false;
    }else{
        ToggleFooterIconButton(button, speaker_unmute_icon, 'TR_SPEAKER_UNMUTE')
        isSpeakerMuted = true;
    }
}

// create more options popup
function CreateMoreOptionsPopup(popup_icon_list, user){
    if(popup_icon_list.length){
        try {
            let popup = GetMoreOptionsPopupHTML(user);
            if(!popup.length) throw ''; 
            morePopup.append(popup);
            for (let index = 0; index < popup_icon_list.length; index++) {
                const element = popup_icon_list[index];
                console.log(element);
                switch (element) {
                    case file_btn_name:
                        CreatePopupButton(file_icon, 'TR_FILE', file_btn_name, false)
                        break;
                    case members_btn_name:
                        CreatePopupButton(members_icon, 'TR_MEMBERS', members_btn_name, false)
                        break;
                    case webinar_end_btn_name:
                        if(isLecturer) CreatePopupButton(webinar_end_icon, 'TR_WEBINAR_END', webinar_end_btn_name, false)
                        break;
                    case screen_share_btn_name:
                        CreatePopupButton(screen_share_icon, 'TR_SCREEN_SHARE', screen_share_btn_name, false)
                        break;
                    case text_board_btn_name:
                        CreatePopupButton(text_board_icon, 'TR_TEXT_BOARD', text_board_btn_name, false)
                        break;
                    case blackboard_btn_name:
                        CreatePopupButton(blackboard_icon, 'TR_BLACKBOARD', blackboard_btn_name, false)
                        break;
                    case report_btn_name:
                        CreatePopupButton(report_icon, 'TR_REPORT', report_btn_name, false)
                        break;
                    case settings_btn_name:
                        CreatePopupButton(settings_icon, 'TR_SETTINGS', settings_btn_name, false)
                        break;
                    case logout_btn_name:
                        CreatePopupButton(logout_icon, 'TR_LOGOUT', logout_btn_name, false)
                        break;
                    case chat_btn_name:
                        CreatePopupButton(chat_icon, 'TR_CHAT', chat_btn_name, false)
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            setTimeout(() => {CreateMoreOptionsPopup(popup_icon_list, user)}, 1000)
        }
    }
}

function TogglePopup(){
    morePopup.fadeToggle(100);
}

function OpenPopup(){
    morePopup.fadeIn(100)
}

function ToggleRightMenu(){ 
    chat_RightMenu.toggleClass('transform-menu');
    mainContainer.toggleClass('move-container');
}

function OpenRightMenu(){
    chat_RightMenu.addClass('transform-menu');
    mainContainer.addClass('move-container');
}

function HideRightMenu(){
    chat_RightMenu.removeClass('transform-menu');
    mainContainer.removeClass('move-container');
}

function ClearInput(input){
    input.val('');
}

function ChatScrolToBottom(){
    var element = document.getElementById("chat-message-container");
    element.scrollTop = element.scrollHeight;
}

function GetChat(){
    var response = GetChatContainer(messages, 'mindalay--chat');
    if(response && chat_RightMenu.children().length === 0){
        console.log(response);
        chat_RightMenu.append(response)
        ToggleRightMenu()
    }else{
        ToggleRightMenu()
    }
    console.log(response[0]);
    ChatScrolToBottom();
}