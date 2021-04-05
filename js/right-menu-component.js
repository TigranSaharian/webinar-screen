function getMembersMenu(members){
    let rightMenuBodyWrapper = new HtmlElement('div', 'mindalay--right-menu-items-wrapper')
    for (let index = 0; index < members.length; index++) {
        const member = members[index];
        let rightMenuItemWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
        let rightMenuItem = new HtmlElement('div', 'mindalay--right-menu-item');
        let rightMenuItemName = new HtmlElement('p', 'mindlay--right-menu-item-name', member.fullname)
        let isOnline =  getUserOnlineStatusStyle(member)
        let rightMenuItemImage = new HtmlElement('div', `mindalay--member member-online-status ${isOnline}`);
        rightMenuItemWrapper.attr('alt', isOnline);
        rightMenuItemImage.addClass(isOnline);
        member.avatarUrl !== null ? rightMenuItemImage.attr('style', `background-image: url(${member.avatarUrl})`) : rightMenuItemImage.append(default_user_icon);

        rightMenuItem.append(rightMenuItemImage)
        rightMenuItem.append(rightMenuItemName)
        
        rightMenuItemWrapper.append(rightMenuItem)
        rightMenuItemWrapper.append(getMemberRules(member))
        rightMenuBodyWrapper.append(rightMenuItemWrapper);
    }
    return rightMenuBodyWrapper;
}

function getFilesMenu(files){
    let rightMenuBodyWrapper = new HtmlElement('div', 'mindalay--right-menu-items-wrapper')
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        let rightMenuItemWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
        let rightMenuItem = new HtmlElement('div', 'mindalay--right-menu-item');
        let rightMenuItemName = new HtmlElement('p', 'mindlay--right-menu-item-name', file.fileName)
        let rightMenuItemImage = new HtmlElement('div', 'mindalay--file');
        file.filePath !== null ? rightMenuItemImage.attr('style', `background-image: url(${file.filePath})`) : rightMenuItemImage.append(default_user_icon);

        rightMenuItem.append(rightMenuItemImage)
        rightMenuItem.append(rightMenuItemName)
        
        rightMenuItemWrapper.append(rightMenuItem)
        rightMenuItemWrapper.append(getFileRules(file))
        rightMenuBodyWrapper.append(rightMenuItemWrapper);
    }
    return rightMenuBodyWrapper;
}

///////////////////////////////////////////////////

// get right menu
function getRightMenu(nameMenu){
    let rightMenuContainer = getRightMenuContainer();
    let rightMenuHeader = getRightMenuHeader(nameMenu);
    let rightMenuBody = getRightMenuBody();
    let rightMenuContent;

    if(nameMenu){
        switch (nameMenu) {
            case members_btn_name:
                rightMenuContent = getMembersMenu(users)
                break;
            case file_btn_name:
                rightMenuContent = getFilesMenu(files)
                break;
            default:
                break;
        }
    }

    rightMenuBody.append(rightMenuContent);
    rightMenuContainer.append(rightMenuHeader);
    rightMenuContainer.append(rightMenuBody);
    default_RightMenu.append(rightMenuContainer);
    getTranslation(default_RightMenu.find('label'), 'data-id', TR_ONLINE);
    return true;
}

// get files rules
function getFileRules(file){
    let itemRulesWrapper = new HtmlElement('div', 'mindlay--item-options-wrapper');
    let zoomIn = new Button(file.id, '', zoom_in_icon, true, 'data-title', TR_ZOOM, membersMenuPrefix)
    let downloadLink = new HtmlElement('a')
    downloadLink.attr('href', file.filePath)
                .attr('data-title', TR_DOWNLOAD)
                .attr('target', '_blank')
                .attr('hidden', true);
    downloadLink.append(download_icon)
    itemRulesWrapper.append(zoomIn)
    itemRulesWrapper.append(downloadLink)
    getTranslation(zoomIn, 'data-title', TR_ZOOM)
    getTranslation(downloadLink, 'data-title', TR_DOWNLOAD)
    return itemRulesWrapper;
}

// get memebr rules
function getMemberRules(member){
    let itemRulesWrapper = new HtmlElement('div', 'mindlay--item-options-wrapper');
    if(member.isVideo){
        let removeVideoButton = new Button(close_btn_name, '', clsoe_icon, true, 'data-title', '', membersMenuPrefix)
        removeVideoButton.attr('title', '')
        itemRulesWrapper.append(removeVideoButton)
        getTranslation(removeVideoButton, 'data-title', TR_REMOVE_VIDEO)
    }

    let raseHandButton = new Button(raise_a_hand_name, '', raise_a_hand_icon, true, 'data-title', TR_CHECK_STUDENT_ACTIVITY, membersMenuPrefix)
    raseHandButton.attr('title', '')
    itemRulesWrapper.append(raseHandButton);
    getTranslation(raseHandButton, 'data-title', TR_CHECK_STUDENT_ACTIVITY)
    
    if(member.activityTime){
        let activityTimer = new HtmlElement('span', 'mindlay--member-activity-timer', member.activityTime)
        itemRulesWrapper.append(activityTimer)
        getTranslation(activityTimer, 'data-title', TR_ACTIVITY_TIMER)
    }
    return itemRulesWrapper;
}

//right menu header
function getRightMenuHeader(menuName = ''){
    var header = new HtmlElement('div', 'mindalay--right-menu-header mindalay--brand-color-background');
    var headerCloseButton = new HtmlElement('div', 'mindalay--popup-close-button close-right-menu')
    let headerContent;

    if(menuName){
        switch (menuName) {
            case members_btn_name:
                headerContent = getRightMenuHeaderContent(TR_MEMBERS, users.length)
                let checkbox = `<div class="checkbox" id="is-online-list">
                                    <label class="translation" data-id="${TR_ONLINE}" for="online-members"></label>
                                    <input type="checkbox" id="online-members">
                                </div>`
                headerContent.append(checkbox)
                break;
            case file_btn_name:
                headerContent = getRightMenuHeaderContent(TR_FILE, files.length)
                break;
            case chat_name:
                let onlineuUsersCount = users.filter(x => x.isOnline)
                headerContent = getRightMenuHeaderContent(TR_ONLINE_STUDENTS, onlineuUsersCount && onlineuUsersCount.length)
                break;
            default:
                break;
        }
    }
    header.append(headerCloseButton.append(right_arrow_icon));
    headerContent != '' ? header.append(headerContent) : '';
    return header;
}

function getRightMenuBody(){
    return new HtmlElement('div', 'mindalay--right-menu-body');
}

function getRightMenuContainer(){
    return new HtmlElement('div', 'mindalay--right-menu-container')
}

function toggleMenuName(menuName = ''){
    menuName !== '' ? default_RightMenu.attr('data-toggle', menuName) : default_RightMenu.removeAttr('data-toggle') 
}

function getRightMenuHeaderContent(translationKey, content){
    let headerTitleWrapper = new HtmlElement('div', 'mindalay--right-menu-title-wrapper');
    let headerContent = new HtmlElement('p');
    headerContent.append(`<strong class='translation' data-id='${translationKey}'></strong> (<span>${content}</span>)`)
    headerTitleWrapper.append(headerContent)
    let HeaderTitle = headerContent.find('strong')
    getTranslation(HeaderTitle, 'data-id', translationKey)
    return headerTitleWrapper;
}
