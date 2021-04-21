function getMoreOptionsPopup(user) {
    let userAvatar = `<div class="online member-online-status mindalay--more-popup-user-image" rel="${user.id}" style="background-image: url(${user.avatarFilePath});"></div>`;
    let popup = 
    `<div class="mindalay--popup-container">
        <div class="mindalay--popup-header">
            ${userAvatar}
            <div class="mindalay--more-popup-user-info">
                <p class="mindalay--more-popup-user-name">${user.fullName}</p>
                <small class="mindalay--more-popup-user-type">${user.userTypeName}</small>
            </div>
            <div id="close-popup" class="mindalay--popup-close-button">${clsoe_icon}</div>
        </div>
        <ul id="popup-body" class="mindalay--popup-body"></ul>
    </div>`;
    return popup;
}