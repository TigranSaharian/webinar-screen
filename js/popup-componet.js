function GetMoreOptionsPopupHTML(user) {
    let isOnline = user.isOnline == true ? 'online' : 'offline';
    let userAvatar = ''
    if(!user.avatarUrl){
        userAvatar = `<div class="${isOnline} member-online-status mindalay--more-popup-default-image">${user.firstname.charAt(0)}</div>`
    }else{
        userAvatar = `<div class="${isOnline} member-online-status mindalay--more-popup-user-image" style="background-image: url(${user.avatarUrl});"></div>`;
    }
    let popup = 
    `<div class="mindalay--popup-container">
        <div class="mindalay--popup-header">` + userAvatar +
            `<div class="mindalay--more-popup-user-info">
                <p class="mindalay--more-popup-user-name">${user.fullname}</p>
                <small class="mindalay--more-popup-user-type">${user.usertype}</small>
            </div>
            <div id="close-popup" class="mindalay--popup-close-button">${clsoe_icon}</div>
        </div>
        <ul id="mindalay--more-popup-container" class="mindalay--popup-body"></ul>
    </div>`;
    return popup;
}