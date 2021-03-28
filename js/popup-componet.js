function GetMoreOptionsPopupHTML(user) {
    let isOnline = GetUserOnlineStyle(user)
    let userAvatar = ''
    if(!user.avatarUrl){
        userAvatar = `<div class="${isOnline} member-online-status mindalay--more-popup-default-image">${user.firstname.charAt(0)}</div>`
    }else{
        userAvatar = `<div class="${isOnline} member-online-status mindalay--more-popup-user-image" style="background-image: url(${user.avatarUrl});"></div>`;
    }
    let popup = 
    `<div class="mindalay--popup-container">
        <div class="mindalay--popup-header">${userAvatar}
            <div class="mindalay--more-popup-user-info">
                <p class="mindalay--more-popup-user-name">${user.fullname}</p>
                <small class="mindalay--more-popup-user-type">${user.usertype}</small>
            </div>
            <div id="close-popup" class="mindalay--popup-close-button">${clsoe_icon}</div>
        </div>
        <ul id="mindalay--more-popup-container" class="mindalay--popup-body"></ul>
    </div>`;
    return popup;
}

function GetChatContainer(chat, menuName){
    let sideMenu = GetSideMenuHeader(menuName);
    let chatContainer = 
    `<div class="mindalay--popup-body">
        <div class="mindalay--chat-message-container">
            ${chat}
            <div class="mindalay--chat-input-wrapper">
                <div class="mindalay--chat-send-button">${send_message_icon}</div>
                <label for="mindalay--chat-message"></label>
                <input type="text" id="mindalay--chat-message" class="mindalay--input" placeholder="type text">
            </div>
        </div>
    </div>`
    sideMenu.append(chatContainer);
    return sideMenu;
}
    
function GetSideMenuHeader(menuName){
    let rightSidemenu = 
    `<div class="mindalay--popup-container" data-toggle="${menuName}">
        <div class="mindalay--popup-header">
            <div class="mindalay--popup-close-button close-right-menu">${right_arrow_icon}</div>
        </div>
    </div>`
    return rightSidemenu;
}

function GetChat(message, isCurrentUser){
    let isOnline =  GetUserOnlineStyle(message.user)
    let userAvatar = ''
    if(!user.avatarUrl){
        userAvatar = `<div class="member-online-status mindalay--chat-member-default-image ${isOnline}">${message.user.firstname.charAt(0)}</div>`;
    }else{
        userAvatar = `<div class="mindalay--chat-member member-online-status ${isOnline}" style="background-image: url(${message.user.avatarUrl});"></div>`;
    }
    
    let userImage = `<div class="mindalay--chat-member-wrapper">${userAvatar}</div>`;
    let messageBody = 
    `<div class="mindalay--chat-message">
        <p class="mindalay--chat-message-text">${message.text}</p>
        <span class="mindalay--chat-message-date">${message.date}</span>
    </div>`;

    let messageWrapper = 
    `<div class="mindalay--chat-message-wrapper mindalay--chat-other-message">
        ${userImage ? isCurrentUser : ''}
        ${messageBody}
    </div>`
}