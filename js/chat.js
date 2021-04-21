function getChatMenu(messages) {
    let chatContent = getChatMessages(messages) // get existed messages
    let menuHeader = getRightMenuHeader(chat_name) // get side menu header

    let chatMenuContainer = getRightMenuContainer();
    let chatMenuBody = getRightMenuBody();
    chatMenuContainer.append(menuHeader);

    let messageContainer = new HtmlElement('div', 'mindalay--chat-body-container')
    messageContainer.attr('id', 'chat-message-container')
    messageContainer.append(chatContent);
    chatMenuBody.append(messageContainer);
    chatMenuContainer.append(chatMenuBody)

    let inputWrapper = new HtmlElement('div', 'mindalay--chat-input-wrapper');
    let sendButton = new HtmlElement('div', 'mindalay--chat-send-message-button');
    sendButton.attr('id', 'send-message-button');
    let input = $('<input>')
        .attr('class', `mindalay--input ${TRANSLATION}`)
        .attr('id', 'mindalay--chat-message')
        .attr('type', 'text')
        .attr('data-placeholder', TR_TYPEMESSAGE)
        .attr('placeholder', '')
    inputWrapper.append(sendButton.append(send_message_icon))
    inputWrapper.append(input)
    chatMenuBody.append(inputWrapper)
    if (chatMenuContainer) return chatMenuContainer;
}

function getChatMessages(messages) {
    let messageWrapper = '';
    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        const isSameUser = messages[index - 1] && messages[index - 1].senderId === messages[index].senderId;
        messageWrapper += getMessageWrapper(message, isSameUser)
    }
    return messageWrapper;
}

function getMessageWrapper(message, isSameUser) {
    let senderUser = webinarUsers.find(x => x.id === message.senderId)
    var time = convertUtcToLocal(message.time);
    let isOnline = getUserOnlineStatusStyle(senderUser)
    var loggedInUser = message.senderId === currentUser.id;

    let userAvatar = '';
    if (!message.avatarFilePath) {
        userAvatar = `<div class="member-online-status mindalay--member-default-image ${isOnline}" rel="${message.senderId}">${default_user_icon}</div>`;
    } else {
        userAvatar = `<div class="mindalay--member member-online-status ${isOnline}" rel="${message.senderId}" style="background-image: url(${message.avatarFilePath});"></div>`;
    }

    let currentUserName = ''
    if (!loggedInUser) {
        currentUserName = `<small class="mindalay--chat-username">${senderUser.firstname}</small>`
    }
    let messageBody = ''
    let userImage = '';
    if (isSameUser) {
        messageBody =
            `<div class="mindalay--chat-message">
                <p class="mindalay--chat-message-text">${message.message}</p>
                <span class="mindalay--chat-message-date">${time}</span>
            </div>`;
    } else {
        userImage = `<div class="mindalay--right-menu-item">${userAvatar}</div>`
        messageBody =
            `<div>
                ${currentUserName}
                <div class="mindalay--chat-message mindalay--chat-main-message">
                    <p class="mindalay--chat-message-text">${message.message}</p>
                    <span class="mindalay--chat-message-date">${time}</span>
                </div>
            </div>`;
    }

    let messageWrapperStatus = loggedInUser ? 'mindalay--currnet-user' : 'mindalay--other-user'
    let isSameUserMessageStyle = isSameUser ? 'mindalay--same-user-message-wrapper' : 'mindalay--chat-message-wrapper';
    let messageWrapper =
        `<div class="${messageWrapperStatus} ${isSameUserMessageStyle}">
            ${!loggedInUser ? userImage : ''}
            ${messageBody}
        </div>`;

    messagesArr.push({
        senderId: message.senderId,
        username: message.userName,
        message: message.message,
        avatarFilePath: message.avatarFilePath,
        time: time,
        loggedInUser: loggedInUser
    });
    return messageWrapper;
}

function getNewMessageWrapper(userId, messageSendername, message, avatarFilePath) {
    var time = convertUtcToLocal(new Date());
    var loggedInUser = currentUser.id === userId;

    let userAvatar = `<div class="mindalay--member member-online-status online" rel="${userId}" style="background-image: url(${avatarFilePath});"></div>`;
    let currentUserName = ''

    let isCurrentUser = true ? currentUser.id === userId : false;
    let isSameUser = true ? messagesArr[messagesArr.length - 1].senderId === userId : false;

    if (!isCurrentUser) {
        currentUserName = `<small class="mindalay--chat-username">${messageSendername}</small>`
    }
    let messageBody = ''
    let userImage = '';
    if (isSameUser) {
        messageBody =
            `<div class="mindalay--chat-message">
                <p class="mindalay--chat-message-text">${message}</p>
                <span class="mindalay--chat-message-date">${time}</span>
            </div>`;
    } else {
        userImage = `<div class="mindalay--right-menu-item">${userAvatar}</div>`
        messageBody =
            `<div>
                ${currentUserName}
                <div class="mindalay--chat-message mindalay--chat-main-message">
                    <p class="mindalay--chat-message-text">${message}</p>
                    <span class="mindalay--chat-message-date">${time}</span>
                </div>
            </div>`;
    }

    let messageWrapperStatus = isCurrentUser ? 'mindalay--currnet-user' : 'mindalay--other-user'
    let isSameUserMessageStyle = isSameUser ? 'mindalay--same-user-message-wrapper' : 'mindalay--chat-message-wrapper';
    let messageWrapper =
        `<div class="${messageWrapperStatus} ${isSameUserMessageStyle}">
            ${!isCurrentUser ? userImage : ''}
            ${messageBody}
        </div>`;

    messagesArr.push({
        senderId: userId,
        username: messageSendername,
        message: message,
        avatarFilePath: avatarFilePath,
        time: time,
        loggedInUser: loggedInUser
    });
    return messageWrapper;
}

function toggleChatMenu() {
    if ($('#mindalay--right-menu').hasClass('transform-menu')) {
        $('#mindalay--right-menu').removeClass('transform-menu')
        CONTAINER_MAIN_BODY.removeClass('move-container');
        RIGHT_MENU_DEFAULT.children().remove();
    }
    RIGHT_MENU_CHAT.toggleClass('transform-menu');
    CONTAINER_MAIN_BODY.toggleClass('move-container');
    isChatMenuOpen = !isChatMenuOpen;
}

function clearInputValue(input) {
    input.val('');
}

function chatScrolToBottom() {
    var element = document.getElementById("chat-message-container");
    element.scrollTop = element.scrollHeight;
}

function getChat(webinarChatContent) {
    if (RIGHT_MENU_CHAT.children().length === 0) {
        appendChatContent(webinarChatContent) === true ? toggleChatMenu() : appendChatContent(webinarChatContent)
    } else {
        toggleChatMenu()
    }
    chatScrolToBottom();
    if(isHasChatNotificationStyle){
        removeNotifyStyleFromPopupElement(getPopupElement(chat_name))
        isHasChatNotificationStyle = false;
    }
    $('#mindalay-chat').removeClass('mindalay--button-has-notification')
    getTranslation($('#mindalay--chat-message'), TRANSLATION_KEY_PLACEHOLDER, TR_TYPEMESSAGE)
}

function appendChatContent(webinarChatContent) {
    var response = getChatMenu(webinarChatContent);
    RIGHT_MENU_CHAT.append(response)
    return true;
}

function playAudio() {
    var audio = new Audio(MESSAGE_NOTIFICATION_SOUND);
    audio.loop = false;
    audio.play(); 
}