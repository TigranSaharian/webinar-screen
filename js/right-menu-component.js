function GetChatContainer(messages){
    let chatContent = GetChatMessages(messages) // get existed messages
    let menuHeader = GetSideMenuHeader() // get side menu header
    
    let popupContainer = new HtmlElement('div', 'mindalay--popup-container', null)
    // popupContainer.attr('data-toggle', menuName).attr('id', 'mindalay--popup-container');
    popupContainer.append(menuHeader);

    let popupBody = new HtmlElement('div', 'mindalay--popup-body', null)
    let messageContainer = new HtmlElement('div', 'mindalay--chat-message-container', null)
    messageContainer.attr('id', 'chat-message-container')
    messageContainer.append(chatContent);
    popupBody.append(messageContainer);
    popupContainer.append(popupBody)

    let inputWrapper = new HtmlElement('div','mindalay--chat-input-wrapper', null);
    let sendButton = new HtmlElement('div', 'mindalay--chat-send-message-button', null);
    sendButton.attr('id', 'send-message-button');
    let input = $('<input>')
        .attr('class', 'mindalay--input translation')
        .attr('id', 'mindalay--chat-message')
        .attr('type', 'text')
        .attr('data-placeholder', TR_TYPEMESSAGE)
        .attr('placeholder', 'Type a message...')
    inputWrapper.append(sendButton.append(send_message_icon))
    inputWrapper.append(input)
    popupBody.append(inputWrapper)
    if(popupContainer) return popupContainer;
}

function GetSideMenuHeader(sideMenuName){
    var header = new HtmlElement('div', 'mindalay--popup-header', null);
    var headerChildDiv = new HtmlElement('div', 'mindalay--popup-close-button close-right-menu', null)
    header.append(headerChildDiv.append(right_arrow_icon));
    return header;
}

function GetChatMessages(messages){
    let messageWrapper = '';
    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        messageWrapper += GetMessageWrapper(message)
    }
    return messageWrapper;
}

function GetMessageWrapper(message){
    let isOnline =  GetUserOnlineStyle(message.user)
    let isCurrentUser = message.user.id === user.id;
    let userAvatar;
    if(!message.user.avatarUrl){
        userAvatar = `<div class="member-online-status mindalay--chat-member-default-image ${isOnline}">${message.user.firstname.charAt(0)}</div>`;
    }else{
        userAvatar = `<div class="mindalay--chat-member member-online-status ${isOnline}" style="background-image: url(${message.user.avatarUrl});"></div>`;
    }
    let userImage = `<div class="mindalay--chat-member-wrapper">${userAvatar}</div>`;
    let messageBody = 
        `<div class="mindalay--chat-message">
            <strong class="mindalay--chat-username">${message.user.firstname} ${message.user.lastname}</strong>
            <p class="mindalay--chat-message-text">${message.text}</p>
            <span class="mindalay--chat-message-date">${message.date}</span>
        </div>`;
    let messageWrapperStatus = isCurrentUser ? 'mindalay--currnet-user' : ''
    let messageWrapper =
        `<div class="mindalay--chat-message-wrapper ${messageWrapperStatus}">
            ${!isCurrentUser ? userImage : ''}
            ${messageBody}
        </div>`;
    return messageWrapper;
}