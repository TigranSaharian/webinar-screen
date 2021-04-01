$(document).ready(function(){

    GetPreloader('TR_PRELOADER_TEXT', 'index.html', 'TR_START_WEBINAR')
    
    ///////////////////////////////////////////////////////////////////
    $(document).on('click', '.mindalay--footer-btn', function(){
        let button = $(this);
        if(button.attr('data-toggle') == 'true'){
            let button_action = button.attr('id')
            switch (button_action) {
                case microphone_muted_btn_name:
                case microphone_unmute_btn_name:
                    ToggleMicrophoneButton(isMicrophoneMuted, button)
                    break;
                case speaker_muted_btn_name:
                case speaker_unmute_btn_name:
                    ToggleSpeakerButton(isSpeakerMuted, button)
                    break;
                case video_muted_btn_name:
                case video_unmute_btn_name:
                    ToggleVideoButton(isVideoMuted, button)
                    break;
                default:
                    break;
            }
        }
    });
    $(document).on('click', '#more-popup', function(){
        TogglePopup();
    })
    $(document).on('click', '#close-popup', function(){
        TogglePopup()
    })
    $(document).on('click', '#start-webinar', function(){
        isWebinarStarted = true;
        let screenStatus = GetInitialScreen(user);
        if(screenStatus) RemovePreloader();
    });
    $(document).on('click', '#mindalay-chat', function(){
        GetChat();
    })
    $(document).on('click', '.close-right-menu', function(){
        HideRightMenu()
    })
    $(document).on('click', '#popup--mindalay-chat', function(){
        TogglePopup()
        GetChat()
    })
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
            ClearInput($(this))
            $('#chat-message-container').append(messageWrapper);
            ChatScrolToBottom()
        }
    })
    $(document).on('click', '#popup--members', function(){

    });

    /////////////////////////////////////////////
    $(document).on('keypress','#mindalay--chat-message', function (e) {
        var key = e.which;
        if(key == 13) 
         {
           $('#send-message-button').click();
           ClearInput($(this))
           return false;  
         }
    });   
})