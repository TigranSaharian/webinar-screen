function GetRTCVideoButton(){
    if(isVideoMuted){
        CreateFooterIconButton(footerIconGroupContainer, video_unmute_icon,'TR_VIDEO_UNMUTE', true, video_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, video_muted_icon,'TR_VIDEO_MUTED', true, video_muted_btn_name)
    }
}

function GetRTCMicrophoneButton(){
    if(isSpeakerMuted){
        CreateFooterIconButton(footerIconGroupContainer, speaker_unmute_icon,'TR_SPEAKER_UNMUTE', true, speaker_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, speaker_muted_icon,'TR_SPEAKER_MUTED', true, speaker_muted_btn_name)
    }
}

function GetScreenSpeakerStatus(){
    if(isMicrophoneMuted){
        CreateFooterIconButton(footerIconGroupContainer, microphone_unmute_icon,'TR_MIC_UNMUTE', true, microphone_unmute_btn_name)
    }else{
        CreateFooterIconButton(footerIconGroupContainer, microphone_muted_icon, 'TR_MIC_MUTED', true, microphone_muted_btn_name)
    }
}