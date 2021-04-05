function getChatMenu(messages){
    let chatContent = getChatMessages(messages) // get existed messages
    let menuHeader = getRightMenuHeader(chat_name) // get side menu header
    
    let popupContainer = getRightMenuContainer();
    let popupBody = getRightMenuBody();
    popupContainer.append(menuHeader);

    let messageContainer = new HtmlElement('div', 'mindalay--chat-body-container')
    messageContainer.attr('id', 'chat-message-container')
    messageContainer.append(chatContent);
    popupBody.append(messageContainer);
    popupContainer.append(popupBody)

    let inputWrapper = new HtmlElement('div','mindalay--chat-input-wrapper');
    let sendButton = new HtmlElement('div', 'mindalay--chat-send-message-button');
    sendButton.attr('id', 'send-message-button');
    let input = $('<input>')
        .attr('class', 'mindalay--input translation')
        .attr('id', 'mindalay--chat-message')
        .attr('type', 'text')
        .attr('data-placeholder', TR_TYPEMESSAGE)
        .attr('placeholder', '')
    inputWrapper.append(sendButton.append(send_message_icon))
    inputWrapper.append(input)
    popupBody.append(inputWrapper)
    if(popupContainer) return popupContainer;
}

function getChatMessages(messages){
    let messageWrapper = '';
    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        messageWrapper += GetMessageWrapper(message)
    }
    return messageWrapper;
}

function GetMessageWrapper(message){
    let isOnline =  getUserOnlineStatusStyle(message.user)
    let isCurrentUser = message.user.id === user.id;
    let userAvatar;
    if(!message.user.avatarUrl){
        userAvatar = `<div class="member-online-status mindalay--member-default-image ${isOnline}">${default_user_icon}</div>`;
    }else{
        userAvatar = `<div class="mindalay--member member-online-status ${isOnline}" style="background-image: url(${message.user.avatarUrl});"></div>`;
    }
    let userImage = `<div class="mindalay--member-wrapper">${userAvatar}</div>`;
    let messageBody = 
        `<div class="mindalay--chat-message">
            <strong class="mindalay--chat-username">${message.user.firstname} ${message.user.lastname}</strong>
            <p class="mindalay--chat-message-text">${message.text}</p>
            <span class="mindalay--chat-message-date">${message.date}</span>
        </div>`;
    let messageWrapperStatus = isCurrentUser ? 'mindalay--currnet-user' : 'mindalay--other-user'
    let messageWrapper =
        `<div class="mindalay--chat-message-wrapper ${messageWrapperStatus}">
            ${!isCurrentUser ? userImage : ''}
            ${messageBody}
        </div>`;
    return messageWrapper;
}

function toggleChatMenu(){
    if($('#mindalay--right-menu').hasClass('transform-menu')){
        $('#mindalay--right-menu').removeClass('transform-menu')
        mainContainer.removeClass('move-container'); 
    }
    chat_RightMenu.toggleClass('transform-menu');
    mainContainer.toggleClass('move-container');
}

function clearInputValue(input){
    input.val('');
}

function chatScrolToBottom(){
    var element = document.getElementById("chat-message-container");
    element.scrollTop = element.scrollHeight;
}

function getChat(){
    if(chat_RightMenu.children().length === 0){
        var response = getChatMenu(messages);
        chat_RightMenu.append(response)
        toggleChatMenu()
    }else{
        toggleChatMenu()
    }
    chatScrolToBottom();
    getTranslation($('#mindalay--chat-message'), 'data-placeholder', TR_TYPEMESSAGE)
}