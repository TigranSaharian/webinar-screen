function GetRTCVideoButton(){
    if(isVideoMuted){
        CreateFooterIconButton(footerIconGroupContainer, video_unmute_icon,'TR_VIDEO', true, video_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, video_muted_icon,'TR_VIDEO', true, video_muted_btn_name)
    }
}

function GetRTCMicrophoneButton(){
    if(isSpeakerMuted){
        CreateFooterIconButton(footerIconGroupContainer, speaker_unmute_icon,'TR_SPEAKER', true, speaker_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, speaker_muted_icon,'TR_SPEAKER', true, speaker_muted_btn_name)
    }
}

function GetScreenSpeakerStatus(){
    if(isMicrophoneMuted){
        CreateFooterIconButton(footerIconGroupContainer, microphone_unmute_icon,'TR_MICROPHONE', true, microphone_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, microphone_muted_icon, 'TR_MICROPHONE', true, microphone_muted_btn_name)
    }
}