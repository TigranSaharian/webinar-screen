function getMembersMenu(webinarMembers){
    let rightMenuBodyWrapper = new HtmlElement('div', 'mindalay--right-menu-items-wrapper')
    for (let index = 0; index < webinarMembers.length; index++) {
        const member = webinarMembers[index];
        let rightMenuItemWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
        let rightMenuItem = new HtmlElement('div', 'mindalay--right-menu-item');
        let rightMenuItemName = new HtmlElement('p', 'mindlay--right-menu-item-name', member.fullName)
        let isOnline =  getUserOnlineStatusStyle(member)
        let rightMenuItemImage = new HtmlElement('div', `mindalay--member member-online-status ${isOnline}`);
        rightMenuItemWrapper.attr('alt', isOnline).attr('id', member.id);
        rightMenuItemImage.addClass(isOnline);
        rightMenuItemImage.attr('style', `background-image: url(${member.avatarFilePath})`).attr('rel', member.id);

        rightMenuItem.append(rightMenuItemImage)
        rightMenuItem.append(rightMenuItemName)
        
        rightMenuItemWrapper.append(rightMenuItem)
        if(isLecturer && member.id !== lecturerData.id && member.isOnline) rightMenuItemWrapper.append(getMemberRules(member))
        rightMenuBodyWrapper.append(rightMenuItemWrapper);
        if(isLecturer) membersActivityTimer()
    }
    return rightMenuBodyWrapper;
}

function getFilesMenu(files){
    let rightMenuBodyWrapper = new HtmlElement('div', 'mindalay--right-menu-items-wrapper')
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        for (var i = 0; i < VALID_FILE_TYPES.length; i++) {
            if (VALID_IMAGE_EXTENTIONS.find(x => x === file[1])) {
                rightMenuBodyWrapper.prepend(getUploadedImageContainer(file));
              break;
            }else{
                rightMenuBodyWrapper.prepend(getUploadedFileContainer(file));
              break;
            }
        }
    }
    return rightMenuBodyWrapper;
}

function getUploadedImageContainer(file){
    let rightMenuItemWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
    let rightMenuItem = new HtmlElement('div', 'mindalay--right-menu-item');
    let rightMenuItemName = new HtmlElement('p', 'mindlay--right-menu-item-name', file[0])
    let rightMenuItemImage = new HtmlElement('div', 'mindalay--file');
    file[2] !== null ? rightMenuItemImage.attr('style', `background-image: url(${file[2]})`) : rightMenuItemImage.append(default_user_icon);

    rightMenuItem.append(rightMenuItemImage)
    rightMenuItem.append(rightMenuItemName)
    
    rightMenuItemWrapper.append(rightMenuItem)
    rightMenuItemWrapper.append(getFileRules(file))
    return rightMenuItemWrapper;
}

function getUploadedFileContainer(file){
    let fileExtension = file[1];
    let rightMenuItemWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
    let rightMenuItem = new HtmlElement('div', 'mindalay--right-menu-item');
    let rightMenuItemName = new HtmlElement('p', 'mindlay--right-menu-item-name', file[0])
    let rightMenuItemImage = new HtmlElement('div', 'mindalay--file');
    file[2] !== null ? rightMenuItemImage.attr('style', `background-image: url(../assets/icons/${fileExtension}.png)`) : rightMenuItemImage.append(default_user_icon);

    rightMenuItem.append(rightMenuItemImage)
    rightMenuItem.append(rightMenuItemName)
    
    rightMenuItemWrapper.append(rightMenuItem)
    rightMenuItemWrapper.append(getFileRules(file))
    return rightMenuItemWrapper;
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
                rightMenuContent = getMembersMenu(webinarUsers)
                break;
            case file_btn_name:
                rightMenuContent = getFilesMenu(webinarFiles)
                rightMenuBody.attr('id', 'uploadRegion')
                break;
            default:
                break;
        }
    }

    rightMenuBody.append(rightMenuContent);
    rightMenuContainer.append(rightMenuHeader);
    rightMenuContainer.append(rightMenuBody);
    RIGHT_MENU_DEFAULT.append(rightMenuContainer);
    getTranslation(RIGHT_MENU_DEFAULT.find('label'), 'data-id', TR_ONLINE);
    return true;
}

// get files rules
function getFileRules(file){
    let itemRulesWrapper = new HtmlElement('div', 'mindlay--item-options-wrapper');
    if(VALID_IMAGE_EXTENTIONS.find(x => x === file[1])){
        let zoomIn = new Button('', 'uploaded-file', zoom_in_icon, true, TRANSLATION_KEY_TITLE, TR_ZOOM, PREFIX_MEMBER_MENU)
        itemRulesWrapper.append(zoomIn)
        getTranslation(zoomIn, TRANSLATION_KEY_TITLE, TR_ZOOM)
    }
    let downloadLink = new HtmlElement('a')
    downloadLink.attr('href', `${file[2]}/download`)
                .attr(TRANSLATION_KEY_TITLE, TR_DOWNLOAD)
                .attr('target', '_blank')
                .attr('hidden', true);
    downloadLink.append(download_icon)
    itemRulesWrapper.append(downloadLink)
    getTranslation(downloadLink, TRANSLATION_KEY_TITLE, TR_DOWNLOAD)
    return itemRulesWrapper;
}

// get memebr rules
function getMemberRules(member){
    let itemRulesWrapper = new HtmlElement('div', 'mindlay--item-options-wrapper');
    if(member.isVideo){
        let removeVideoButton = new Button(close_btn_name, '', clsoe_icon, true, TRANSLATION_KEY_TITLE, '', PREFIX_MEMBER_MENU)
        removeVideoButton.attr('title', '')
        itemRulesWrapper.append(removeVideoButton)
        getTranslation(removeVideoButton, TRANSLATION_KEY_TITLE, TR_REMOVE_VIDEO)
    }

    if(isLecturer){
        let checkActivityButton = new Button('', 'member-activity-button', activity_icon, true, TRANSLATION_KEY_TITLE, TR_CHECK_MEMBER_ACTIVITY, PREFIX_MEMBER_MENU)
        checkActivityButton.attr('title', '')
        checkActivityButton.attr('data-member', `${member.id}`)
        itemRulesWrapper.append(checkActivityButton);
        getTranslation(checkActivityButton, TRANSLATION_KEY_TITLE, TR_CHECK_MEMBER_ACTIVITY)
    }
    
    if(member.memberLastActivityTime){
        let activityTimer = new HtmlElement('span', 'mindlay--member-activity-timer d-none')

        let currentDateTime = (new Date()).getTime();
        let memberLastActivityTime = (new Date(member.memberLastActivityTime)).getTime();

        const diff = currentDateTime - memberLastActivityTime;
        activityTimer.attr('id', `sec${member.id}`)
                    .attr('rel', diff / 1000)
        itemRulesWrapper.append(activityTimer)
        getTranslation(activityTimer, TRANSLATION_KEY_TITLE, TR_ACTIVITY_TIMER)
    }

    return itemRulesWrapper;
}

//right menu header
function getRightMenuHeader(menuName = ''){
    var header = new HtmlElement('div', 'mindalay--right-menu-header');
    var headerCloseButton = new HtmlElement('div', 'mindalay--popup-close-button close-right-menu')
    let headerContent;

    if(menuName){
        switch (menuName) {
            case members_btn_name:
                headerContent = getRightMenuHeaderContent(TR_MEMBERS, webinarUsers.length)
                let checkbox = `<div class="checkbox" id="is-online-list">
                                    <label class="${TRANSLATION}" data-id="${TR_ONLINE}" for="online-members"></label>
                                    <input type="checkbox" id="online-members">
                                </div>`
                headerContent.append(checkbox)
                break;
            case file_btn_name:
                headerContent = getRightMenuHeaderContent(TR_FILE, webinarFiles.length)
                break;
            case chat_name:
                headerContent = getRightMenuHeaderContent(TR_ONLINE_MEMBERS, webinarUsers.filter(x => x.isOnline).length)
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
    menuName !== '' ? RIGHT_MENU_DEFAULT.attr('data-toggle', menuName) : RIGHT_MENU_DEFAULT.removeAttr('data-toggle') 
}

function getRightMenuHeaderContent(translationKey, content){
    let headerTitleWrapper = new HtmlElement('div', 'mindalay--right-menu-title-wrapper');
    let headerContent = new HtmlElement('p');
    headerContent.append(`<strong class='${TRANSLATION}' data-id='${translationKey}'></strong><span id="header-content-count"> - ${content}</span>`)
    headerTitleWrapper.append(headerContent)
    let HeaderTitle = headerContent.find('strong')
    getTranslation(HeaderTitle, 'data-id', translationKey)
    return headerTitleWrapper;
}
