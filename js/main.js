$(document).ready(function(){

    // getPreloader(TR_PRELOADER_INITIAL_TEXT, 'index.html')
    setCookie('language', 'en', 5)
    getLanguages();
    getTranslations();
    
    ///////////////////////////////////////////////////////////////////

    // start webinar
    // $(document).on('click', '#start-webinar', function(){
        isWebinarStarted = true;
        let screenStatus = getInitialScreen(user);
        // if(screenStatus) removePreloader();
    // });
    
    // click video microphone or speacker button action
    $(document).on('click', '.mindalay--footer-btn', function(){
        let button = $(this);
        if(button.attr('data-toggle') == 'true'){
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

    // toggle more options menu
    $(document).on('click', '#more-popup', function(){
        togglePopup();
    })
    $(document).on('click', '#close-popup', function(){
        togglePopup();
    })

    // toggle chat
    $(document).on('click', '#mindalay-chat', function(){
        toggleChat = !toggleChat;
        getChat();
    })
    // get chat mobile screen
    $(document).on('click', '#popup--mindalay-chat', function(e){
        togglePopup();
        getChat();
    })

    // close right menu
    $(document).on('click', '.close-right-menu', function(){
        let targetName = $(this).closest('.mindalay--right-menu').attr('id')
        toggleMenuName()
        hideRightMenu(targetName);
    })
    
    // send message
    $(document).on('click', '#send-message-button', function(){
        let messageText = $(this).closest('.mindalay--chat-input-wrapper').find('input[type=text]').val();
        let message = {
            text : messageText,
            date : new Date().toLocaleString(),
            user : {
                id : 1,
                firstname: 'Jon',
                lastname: 'Smith',
                usertype: 'lecturer',
                fullname: 'Jon Smith',
                isOnline: true,
                avatarUrl: 'assets/image/profile-image.jpg'
            }}
        let messageWrapper = GetMessageWrapper(message);
        if(messageWrapper){
            clearInputValue($(this))
            $('#chat-message-container').append(messageWrapper);
            chatScrolToBottom()
        }
    })

    $(document).on('click', '.has-right-menu', function(){
        let targetName = $(this).attr('id').split('--')[1]
        let rightMenu;
        if($('#mindalay--right-menu').attr('data-toggle')){
            removeRightMenu()
            setTimeout(() => {
                $('#mindalay--right-menu').children().remove();
                toggleRightMenu(targetName)
            }, 300)
        }else{
            toggleRightMenu(targetName)
        }
        togglePopup();
    });

    /////////////////////////////////////////////
    $(document).on('keypress','#mindalay--chat-message', function (e) {
        var key = e.which;
        if(key == 13) 
         {
           $('#send-message-button').click();
           clearInputValue($(this))
           return false;  
         }
    });   
})