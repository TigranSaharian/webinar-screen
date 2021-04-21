// __________________
// getHTMLMediaElement.js

function getHTMLMediaElement(mediaElement, config) {
    config = config || {};

    if (!mediaElement.nodeName || (mediaElement.nodeName.toLowerCase() != 'audio' && mediaElement.nodeName.toLowerCase() != 'video')) {
        if (!mediaElement.getVideoTracks().length) {
            return getAudioElement(mediaElement, config);
        }

        var mediaStream = mediaElement;
        mediaElement = document.createElement(mediaStream.getVideoTracks().length ? 'video' : 'audio');

        try {
            mediaElement.setAttributeNode(document.createAttribute('autoplay'));
            mediaElement.setAttributeNode(document.createAttribute('playsinline'));
        } catch (e) {
            mediaElement.setAttribute('autoplay', true);
            mediaElement.setAttribute('playsinline', true);
        }

        if ('srcObject' in mediaElement) {
            mediaElement.srcObject = mediaStream;
        } else {
            mediaElement[!!navigator.mozGetUserMedia ? 'mozSrcObject' : 'src'] = !!navigator.mozGetUserMedia ? mediaStream : (window.URL || window.webkitURL).createObjectURL(mediaStream);
        }
    }

    if (mediaElement.nodeName && mediaElement.nodeName.toLowerCase() == 'audio') {
        return getAudioElement(mediaElement, config);
    }

    var buttons = config.buttons || ['mute-audio', 'mute-video', 'full-screen', 'volume-slider', 'stop'];
    buttons.has = function(element) {
        return buttons.indexOf(element) !== -1;
    };

    config.toggle = config.toggle || [];
    config.toggle.has = function(element) {
        return config.toggle.indexOf(element) !== -1;
    };
    var mediaElementContainer = document.createElement('div');
    mediaElementContainer.className = 'media-container';
    getmediaElementRules(mediaElementContainer, config);
    var mediaControls = document.createElement('div');
    // let $element = `<div class="video-user-data">
    //                     <p class="video-user-name">Jon smith</p>
    //                     <button type="button" class="video-audio-button audio-status-btn">
    //                         <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 43.61 38.86"><path d="M29.24,20.56V13.48L16.74,26a7.4,7.4,0,0,0,12.5-5.4Z"/><path d="M32.58,19.22a1.31,1.31,0,0,0-1.33,1.34A9.44,9.44,0,0,1,15.3,27.39L13.39,29.3a12,12,0,0,0,7.08,3.33v3.56H15.61a1.34,1.34,0,1,0,0,2.67H28a1.34,1.34,0,1,0,0-2.67H23.14V32.63A12.11,12.11,0,0,0,33.92,20.56,1.32,1.32,0,0,0,32.58,19.22Z"/><path d="M36.14.78a2,2,0,0,0-2.83,0L28.88,5.19A7.43,7.43,0,0,0,14.36,7.44V19.51c0,.06,0,.11,0,.16l-1.8,1.81a8.69,8.69,0,0,1-.21-1.92,1.34,1.34,0,1,0-2.67,0,12,12,0,0,0,.71,4.08L.8,33.23a2,2,0,0,0,2.82,2.83L36.13,3.61A2,2,0,0,0,36.14.78Z"/></svg>
    //                     </button>
    //                 </div>
    //                 <video src="assets/videos/test-video.mp4" class="audio-on"></video>`
    // mediaControls.className = 'media-controls';
    // AddAudioStatusButton(mediaElementContainer, config.type);
    // if(config.isStudent){
	// 	if(config.showVideoButton === true){
	// 		var closeBtn = document.createElement('button');
	// 		closeBtn.setAttribute("type", "button");
	// 		closeBtn.setAttribute("class", "video-close-btn");
	// 		var icon = document.createElement("i");
	// 		icon.setAttribute("class", "fas fa-times-circle");
	// 		closeBtn.appendChild(icon);
	// 		mediaElementContainer.prepend(closeBtn);

	// 	}
    //     // mediaElementContainer.setAttribute('hidden', true);
    // }
    // if(config.userData){
    //     GetLecturerName(config.userData, mediaElementContainer);
    // }

    // mediaElementContainer.appendChild(mediaControls);

    if (buttons.has('mute-audio')) {
        var muteAudio = document.createElement('div');
        muteAudio.className = 'control ' + (config.toggle.has('mute-audio') ? 'unmute-audio selected' : 'mute-audio');
        mediaControls.appendChild(muteAudio);
        
        muteAudio.onclick = function() {
            if (muteAudio.className.indexOf('unmute-audio') != -1) {
                muteAudio.className = muteAudio.className.replace('unmute-audio selected', 'mute-audio');
                mediaElement.muted = false;
                mediaElement.volume = 1;
                if (config.onUnMuted) config.onUnMuted('audio');
            } else {
                muteAudio.className = muteAudio.className.replace('mute-audio', 'unmute-audio selected');
                mediaElement.muted = true;
                mediaElement.volume = 0;
                if (config.onMuted) config.onMuted('audio');
            }
        };
    }

    if (buttons.has('mute-video')) {
        var muteVideo = document.createElement('div');
        muteVideo.className = 'control ' + (config.toggle.has('mute-video') ? 'unmute-video selected' : 'mute-video');
        mediaControls.appendChild(muteVideo);

        muteVideo.onclick = function() {
            if (muteVideo.className.indexOf('unmute-video') != -1) {
                muteVideo.className = muteVideo.className.replace('unmute-video selected', 'mute-video');
                mediaElement.muted = false;
                mediaElement.volume = 1;
                mediaElement.play();
                if (config.onUnMuted) config.onUnMuted('video');
            } else {
                muteVideo.className = muteVideo.className.replace('mute-video', 'unmute-video selected');
                mediaElement.muted = true;
                mediaElement.volume = 0;
                mediaElement.pause();
                if (config.onMuted) config.onMuted('video');
            }
        };
    }

    if (buttons.has('take-snapshot')) {
        var takeSnapshot = document.createElement('div');
        takeSnapshot.className = 'control take-snapshot';
        mediaControls.appendChild(takeSnapshot);

        takeSnapshot.onclick = function() {
            if (config.onTakeSnapshot) config.onTakeSnapshot();
        };
    }

    if (buttons.has('stop')) {
        var stop = document.createElement('div');
        stop.className = 'control stop';
        mediaControls.appendChild(stop);

        stop.onclick = function() {
            mediaElementContainer.style.opacity = 0;
            setTimeout(function() {
                if (mediaElementContainer.parentNode) {
                    mediaElementContainer.parentNode.removeChild(mediaElementContainer);
                }
            }, 800);
            if (config.onStopped) config.onStopped();
        };
    }

    var volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';

    if (buttons.has('record-audio')) {
        var recordAudio = document.createElement('div');
        recordAudio.className = 'control ' + (config.toggle.has('record-audio') ? 'stop-recording-audio selected' : 'record-audio');
        volumeControl.appendChild(recordAudio);

        recordAudio.onclick = function() {
            if (recordAudio.className.indexOf('stop-recording-audio') != -1) {
                recordAudio.className = recordAudio.className.replace('stop-recording-audio selected', 'record-audio');
                if (config.onRecordingStopped) config.onRecordingStopped('audio');
            } else {
                recordAudio.className = recordAudio.className.replace('record-audio', 'stop-recording-audio selected');
                if (config.onRecordingStarted) config.onRecordingStarted('audio');
            }
        };
    }

    if (buttons.has('record-video')) {
        var recordVideo = document.createElement('div');
        recordVideo.className = 'control ' + (config.toggle.has('record-video') ? 'stop-recording-video selected' : 'record-video');
        volumeControl.appendChild(recordVideo);

        recordVideo.onclick = function() {
            if (recordVideo.className.indexOf('stop-recording-video') != -1) {
                recordVideo.className = recordVideo.className.replace('stop-recording-video selected', 'record-video');
                if (config.onRecordingStopped) config.onRecordingStopped('video');
            } else {
                recordVideo.className = recordVideo.className.replace('record-video', 'stop-recording-video selected');
                if (config.onRecordingStarted) config.onRecordingStarted('video');
            }
        };
    }

    if (buttons.has('volume-slider')) {
        var volumeSlider = document.createElement('div');
        volumeSlider.className = 'control volume-slider';
        volumeControl.appendChild(volumeSlider);

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 100;
        slider.onchange = function() {
            mediaElement.volume = '.' + slider.value.toString().substr(0, 1);
        };
        volumeSlider.appendChild(slider);
    }

    if (buttons.has('full-screen')) {
        var zoom = document.createElement('div');
        zoom.className = 'control ' + (config.toggle.has('zoom-in') ? 'zoom-out selected' : 'zoom-in');

        if (!slider && !recordAudio && !recordVideo && zoom) {
            mediaControls.insertBefore(zoom, mediaControls.firstChild);
        } else volumeControl.appendChild(zoom);

        zoom.onclick = function() {
            if (zoom.className.indexOf('zoom-out') != -1) {
                zoom.className = zoom.className.replace('zoom-out selected', 'zoom-in');
                exitFullScreen();
            } else {
                zoom.className = zoom.className.replace('zoom-in', 'zoom-out selected');
                launchFullscreen(mediaElementContainer);
            }
        };

        function launchFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }

        function exitFullScreen() {
            if (document.fullscreen) {
                document.exitFullscreen();
            }

            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            }

            if (document.webkitIsFullScreen) {
                document.webkitExitFullscreen();
            }
        }

        function screenStateChange(e) {
            if (e.srcElement != mediaElementContainer) return;

            var isFullScreeMode = document.webkitIsFullScreen || document.mozFullScreen || document.fullscreen;

            mediaElementContainer.style.width = (isFullScreeMode ? (window.innerWidth - 20) : config.width) + 'px';
            mediaElementContainer.style.display = isFullScreeMode ? 'block' : 'inline-block';

            if (config.height) {
                mediaBox.style.height = (isFullScreeMode ? (window.innerHeight - 20) : config.height) + 'px';
            }

            if (!isFullScreeMode && config.onZoomout) config.onZoomout();
            if (isFullScreeMode && config.onZoomin) config.onZoomin();

            if (!isFullScreeMode && zoom.className.indexOf('zoom-out') != -1) {
                zoom.className = zoom.className.replace('zoom-out selected', 'zoom-in');
                if (config.onZoomout) config.onZoomout();
            }
            setTimeout(adjustControls, 1000);
        }

        document.addEventListener('fullscreenchange', screenStateChange, false);
        document.addEventListener('mozfullscreenchange', screenStateChange, false);
        document.addEventListener('webkitfullscreenchange', screenStateChange, false);
    }

    if (buttons.has('volume-slider') || buttons.has('full-screen') || buttons.has('record-audio') || buttons.has('record-video')) {
        mediaElementContainer.appendChild(volumeControl);
    }

    var mediaBox = document.createElement('div');
    mediaBox.className = 'media-box';
    mediaElementContainer.appendChild(mediaBox);

    if (config.title) {
        var h2 = document.createElement('h2');
        h2.innerHTML = config.title;
        h2.setAttribute('style', 'position: absolute;color:white;font-size:17px;text-shadow: 1px 1px black;padding:0;margin:0;text-align: left; margin-top: 10px; margin-left: 10px; display: block; border: 0;line-height:1.5;z-index:1;');
        mediaBox.appendChild(h2);
    }

    mediaBox.appendChild(mediaElement);
    // if (!config.width) config.width = 155;
    mediaElementContainer.style.width = config.width + 'px';

    // if (config.height) {
    //     mediaBox.style.height = config.height + 'px';
    // }

    // mediaBox.querySelector('video').style.height = config.width / 1.5 + 'px';

    var times = 0;

    function adjustControls() {
        // mediaControls.style.marginLeft = (mediaElementContainer.clientWidth - mediaControls.clientWidth - 2) + 'px';

        // if (slider) {
        //     slider.style.width = (mediaElementContainer.clientWidth / 3) + 'px';
        //     volumeControl.style.marginLeft = (mediaElementContainer.clientWidth / 3 - 30) + 'px';

        //     if (zoom) zoom.style['border-top-right-radius'] = '5px';
        // } else {
        //     volumeControl.style.marginLeft = (mediaElementContainer.clientWidth - volumeControl.clientWidth - 2) + 'px';
        // }

        // volumeControl.style.marginTop = (mediaElementContainer.clientHeight - volumeControl.clientHeight - 2) + 'px';

        // if (times < 10) {
        //     times++;
        //     setTimeout(adjustControls, 1000);
        // } else times = 0;
    }

    if (config.showOnMouseEnter || typeof config.showOnMouseEnter === 'undefined') {
        mediaElementContainer.onmouseenter = mediaElementContainer.onmousedown = function() {
            adjustControls();
            mediaControls.style.opacity = 1;
            volumeControl.style.opacity = 1;
        };

        mediaElementContainer.onmouseleave = function() {
            mediaControls.style.opacity = 0;
            volumeControl.style.opacity = 0;
        };
    } else {
        setTimeout(function() {
            adjustControls();
            setTimeout(function() {
                mediaControls.style.opacity = 1;
                volumeControl.style.opacity = 1;
            }, 300);
        }, 700);
    }

    // adjustControls();

    // mediaElementContainer.toggle = function(clasName) {
    //     if (typeof clasName != 'string') {
    //         for (var i = 0; i < clasName.length; i++) {
    //             mediaElementContainer.toggle(clasName[i]);
    //         }
    //         return;
    //     }

    //     if (clasName == 'mute-audio' && muteAudio) muteAudio.onclick();
    //     if (clasName == 'mute-video' && muteVideo) muteVideo.onclick();

    //     if (clasName == 'record-audio' && recordAudio) recordAudio.onclick();
    //     if (clasName == 'record-video' && recordVideo) recordVideo.onclick();

    //     if (clasName == 'stop' && stop) stop.onclick();

    //     return this;
    // };

    mediaElementContainer.media = mediaElement;

    return mediaElementContainer;
}

// __________________
// getAudioElement.js

function getAudioElement(mediaElement, config) {
    config = config || {};

    if (!mediaElement.nodeName || (mediaElement.nodeName.toLowerCase() != 'audio' && mediaElement.nodeName.toLowerCase() != 'video')) {
        var mediaStream = mediaElement;
        mediaElement = document.createElement('audio');

        try {
            mediaElement.setAttributeNode(document.createAttribute('autoplay'));
            mediaElement.setAttributeNode(document.createAttribute('controls'));
        } catch (e) {
            mediaElement.setAttribute('autoplay', true);
            mediaElement.setAttribute('controls', true);
        }

        if ('srcObject' in mediaElement) {
            mediaElement.mediaElement = mediaStream;
        } else {
            mediaElement[!!navigator.mozGetUserMedia ? 'mozSrcObject' : 'src'] = !!navigator.mozGetUserMedia ? mediaStream : (window.URL || window.webkitURL).createObjectURL(mediaStream);
        }
    }

    config.toggle = config.toggle || [];
    config.toggle.has = function(element) {
        return config.toggle.indexOf(element) !== -1;
    };

    var mediaElementContainer = document.createElement('div');
    mediaElementContainer.className = 'media-container';

    var mediaControls = document.createElement('div');
    mediaControls.className = 'media-controls';
    mediaElementContainer.appendChild(mediaControls);

    var muteAudio = document.createElement('div');
    muteAudio.className = 'control ' + (config.toggle.has('mute-audio') ? 'unmute-audio selected' : 'mute-audio');
    mediaControls.appendChild(muteAudio);

    muteAudio.style['border-top-left-radius'] = '5px';

    muteAudio.onclick = function() {
        if (muteAudio.className.indexOf('unmute-audio') != -1) {
            muteAudio.className = muteAudio.className.replace('unmute-audio selected', 'mute-audio');
            mediaElement.muted = false;
            if (config.onUnMuted) config.onUnMuted('audio');
        } else {
            muteAudio.className = muteAudio.className.replace('mute-audio', 'unmute-audio selected');
            mediaElement.muted = true;
            if (config.onMuted) config.onMuted('audio');
        }
    };

    if (!config.buttons || (config.buttons && config.buttons.indexOf('record-audio') != -1)) {
        var recordAudio = document.createElement('div');
        recordAudio.className = 'control ' + (config.toggle.has('record-audio') ? 'stop-recording-audio selected' : 'record-audio');
        mediaControls.appendChild(recordAudio);

        recordAudio.onclick = function() {
            if (recordAudio.className.indexOf('stop-recording-audio') != -1) {
                recordAudio.className = recordAudio.className.replace('stop-recording-audio selected', 'record-audio');
                if (config.onRecordingStopped) config.onRecordingStopped('audio');
            } else {
                recordAudio.className = recordAudio.className.replace('record-audio', 'stop-recording-audio selected');
                if (config.onRecordingStarted) config.onRecordingStarted('audio');
            }
        };
    }

    var volumeSlider = document.createElement('div');
    volumeSlider.className = 'control volume-slider';
    volumeSlider.style.width = 'auto';
    mediaControls.appendChild(volumeSlider);

    var slider = document.createElement('input');
    slider.style.marginTop = '11px';
    slider.style.width = ' 200px';

    if (config.buttons && config.buttons.indexOf('record-audio') == -1) {
        slider.style.width = ' 241px';
    }

    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 100;
    slider.onchange = function() {
        mediaElement.volume = '.' + slider.value.toString().substr(0, 1);
    };
    volumeSlider.appendChild(slider);

    var stop = document.createElement('div');
    stop.className = 'control stop';
    mediaControls.appendChild(stop);

    stop.onclick = function() {
        mediaElementContainer.style.opacity = 0;
        setTimeout(function() {
            if (mediaElementContainer.parentNode) {
                mediaElementContainer.parentNode.removeChild(mediaElementContainer);
            }
        }, 800);
        if (config.onStopped) config.onStopped();
    };

    stop.style['border-top-right-radius'] = '5px';
    stop.style['border-bottom-right-radius'] = '5px';

    var mediaBox = document.createElement('div');
    mediaBox.className = 'media-box';
    mediaElementContainer.appendChild(mediaBox);

    var h2 = document.createElement('h2');
    h2.innerHTML = config.title || 'Audio Element';
    h2.setAttribute('style', 'position: absolute;color: rgb(160, 160, 160);font-size: 20px;text-shadow: 1px 1px rgb(255, 255, 255);padding:0;margin:0;');
    mediaBox.appendChild(h2);

    mediaBox.appendChild(mediaElement);

    mediaElementContainer.style.width = '329px';
    mediaBox.style.height = '90px';

    h2.style.width = mediaElementContainer.style.width;
    h2.style.height = '50px';
    h2.style.overflow = 'hidden';

    var times = 0;

    function adjustControls() {
        mediaControls.style.marginLeft = (mediaElementContainer.clientWidth - mediaControls.clientWidth - 7) + 'px';
        mediaControls.style.marginTop = (mediaElementContainer.clientHeight - mediaControls.clientHeight - 6) + 'px';
        if (times < 10) {
            times++;
            setTimeout(adjustControls, 1000);
        } else times = 0;
    }

    if (config.showOnMouseEnter || typeof config.showOnMouseEnter === 'undefined') {
        mediaElementContainer.onmouseenter = mediaElementContainer.onmousedown = function() {
            adjustControls();
            mediaControls.style.opacity = 1;
        };

        mediaElementContainer.onmouseleave = function() {
            mediaControls.style.opacity = 0;
        };
    } else {
        setTimeout(function() {
            adjustControls();
            setTimeout(function() {
                mediaControls.style.opacity = 1;
            }, 300);
        }, 700);
    }

    adjustControls();

    mediaElementContainer.toggle = function(clasName) {
        if (typeof clasName != 'string') {
            for (var i = 0; i < clasName.length; i++) {
                mediaElementContainer.toggle(clasName[i]);
            }
            return;
        }

        if (clasName == 'mute-audio' && muteAudio) muteAudio.onclick();
        if (clasName == 'record-audio' && recordAudio) recordAudio.onclick();
        if (clasName == 'stop' && stop) stop.onclick();

        return this;
    };

    mediaElementContainer.media = mediaElement;

    return mediaElementContainer;
}

function getmediaElementRules(mediaElementContainer, config){
    var mediaElementUserContainer = document.createElement('div');
    mediaElementUserContainer.className = 'video-user-data'
    
    var mediaElementUserName = document.createElement('p');
    mediaElementUserName.className = 'video-user-name';
    if(config.userData) mediaElementUserName.innerText = config.userData.fullName;

    
    var mediaElementRulesContainer = document.createElement('div')
    mediaElementRulesContainer.className = 'd-flex align-items-center'
    
    // `<div class="mindalay--member member-online-status online" rel="4170" style="background-image: url(https://localhost:44300/file/2036/4170);"></div>`
    if(config.userData.id === currentUser.id || isLecturer){
        var mediaElementVideoButton = document.createElement('button');
        mediaElementVideoButton.setAttribute('type', 'button');
        mediaElementVideoButton.className = 'video-button';
        
        var mediaElementAudioButton = document.createElement('button');
        mediaElementAudioButton.setAttribute('type', 'button');
        mediaElementAudioButton.className = 'audio-button';
        
        if(config.isAudio){
            mediaElementAudioButton.innerHTML = microphone_unmute_icon;
            mediaElementContainer.classList.add('audio-on');
        }else{
            mediaElementAudioButton.innerHTML = microphone_muted_icon;
            mediaElementContainer.classList.add('audio-off'); 
        } 
    
        if(config.isVideo && isLecturer){
            mediaElementVideoButton.innerHTML = video_unmute_icon;
            mediaElementContainer.classList.add('audio-on');
        }else{
            mediaElementVideoButton.innerHTML = video_muted_icon;
            mediaElementContainer.classList.add('audio-off'); 
        }
        mediaElementRulesContainer.append(mediaElementAudioButton)
        mediaElementRulesContainer.append(mediaElementVideoButton)
    }

    mediaElementUserContainer.append(mediaElementUserName)
    mediaElementUserContainer.append(mediaElementRulesContainer)
    mediaElementContainer.append(mediaElementUserContainer);
}

function GetLecturerName(currentUser, container){
    let div = document.createElement('div');
    div.setAttribute('class', 'user-name-wrapper');
    let p = document.createElement('p');
    p.setAttribute('class', 'username');
    div.appendChild(p);
    if(currentUser.middlename === null){currentUser.middlename = "";}
    if(currentUser.lastname === null){currentUser.lastname = "";}
    if(currentUser.firstname === null){currentUser.firstname = "";}
    const lecturerName = `${currentUser.lastname} ${currentUser.firstname} ${currentUser.middlename}`;
    p.innerHTML = lecturerName;
    container.appendChild(div);
}

function AddAudioStatusButton(mediaElementContainer, isLocal){
    var span = document.createElement('span');
    if(isLocal){
        span.setAttribute('class', 'audio-button audio-status-btn');
    }else{
        span.setAttribute('class', 'audio-button');
    }
    var i = document.createElement('i')
    i.setAttribute('class', 'fas fa-microphone-alt');
    span.appendChild(i);
    mediaElementContainer.prepend(span);
}
