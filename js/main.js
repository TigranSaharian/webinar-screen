$(document).ready(function(){
    var user = {
        firstname: 'Jon',
        lastname: 'Smith',
        usertype: 'lecturer',
        fullname: 'Jon Smith',
        isOnline: true,
        avatarUrl: null // /assest/image/profile-image.jpg
    }

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

    $(document).on('click', '#chat-button', function(){
        ToggleRightMenu()
    })

    $(document).on('click', '.close-right-menu', function(){
        ToggleRightMenu()
    })

    $(document).on('click', '#popup--chat-button', function(){
        TogglePopup()
        OpenRightMenu()
    })
})