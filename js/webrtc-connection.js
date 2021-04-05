function getRTCVideoButton(){
    if(isVideoMuted){
        createFooterIconButton(footerIconGroupContainer, video_unmute_icon, TR_ON_VIDEO, true, video_unmute_name, false, true)
    }else{
        createFooterIconButton(footerIconGroupContainer, video_muted_icon, TR_OFF_VIDEO, true, video_muted_name, false, true)
    }
}

function getRTCMicrophoneButton(){
    if(isSpeakerMuted){
        createFooterIconButton(footerIconGroupContainer, speaker_unmute_icon, TR_UNMUTE, true, speaker_unmute_name, false, true)
    }else{
        createFooterIconButton(footerIconGroupContainer, speaker_muted_icon, TR_MUTED, true, speaker_muted_name, false, true)
    }
}

function getScreenSpeakerStatus(){
    if(isMicrophoneMuted){
        createFooterIconButton(footerIconGroupContainer, microphone_unmute_icon, TR_UNMUTE, true, microphone_unmute_name, false, true)
    }else{
        createFooterIconButton(footerIconGroupContainer, microphone_muted_icon, TR_MUTED, true, microphone_muted_name, false, true)
    }
}