function getMembersMenu(members){
    let bodyWrapper = new HtmlElement('div', 'mindalay--right-menu-item-wrapper')
    
    for (let index = 0; index < members.length; index++) {
        const member = members[index];
        let memberBody = new HtmlElement('div', 'mindalay--member-body')
        let memberWrapper = new HtmlElement('div', 'mindalay--member-wrapper');
        let userName = new HtmlElement('p', 'mindlay--member-fullname', member.fullname)
        let isOnline =  getUserOnlineStatusStyle(member)
        let memberAvatar = new HtmlElement('div', `mindalay--member member-online-status ${isOnline}`);
        memberAvatar.addClass(isOnline);
        member.avatarUrl !== null ? memberAvatar.attr('style', `background-image: url(${member.avatarUrl})`) : memberAvatar.append(default_user_icon);

        
        memberWrapper.append(memberAvatar)
        memberWrapper.append(userName)
        
        memberBody.append(memberWrapper)
        memberBody.append(getMemberRules(member))
        bodyWrapper.append(memberBody);
    }
    return bodyWrapper;
}

function getFilesMenu(files){

}

///////////////////////////////////////////////////

// get right menu
function getRightMenu(nameMenu){
    let rightMenuContainer = getRightMenuContainer();
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
    let rightMenuHeader = getRightMenuHeader(nameMenu);
    rightMenuContainer.append(rightMenuHeader);
    rightMenuContainer.append(rightMenuBody);
    default_RightMenu.append(rightMenuContainer);
    getTranslation(default_RightMenu.find('label'), 'data-id', TR_ONLINE);
    return true;
}

// get memebr rules in right menu
function getMemberRules(member){
    let memberRulesWrapper = new HtmlElement('div', 'mindlay--member-options-wrapper');
    if(member.isVideo){
        let removeVideoButton = new Button(close_btn_name, '', clsoe_icon, true, 'data-title', '', membersMenuPrefix)
        removeVideoButton.attr('title', '')
        memberRulesWrapper.append(removeVideoButton)
        getTranslation(removeVideoButton, 'data-title', TR_REMOVE_VIDEO)
    }
    let raseHandButton = new Button(raise_a_hand_name, '', raise_a_hand_icon, true, 'data-title', TR_RAISE_A_HAND, membersMenuPrefix)
    raseHandButton.attr('title', '')
    memberRulesWrapper.append(raseHandButton);
    getTranslation(raseHandButton, 'data-title', TR_RAISE_A_HAND)
    
    if(member.activityTime){
        let activityTimer = new HtmlElement('span', 'mindlay--member-activity-timer', member.activityTime)
        memberRulesWrapper.append(activityTimer)
        getTranslation(activityTimer, 'data-title', TR_ACTIVITY_TIMER)
    }
    return memberRulesWrapper;
}

function getRightMenuContainer(){
    return new HtmlElement('div', 'mindalay--right-menu-container')
}

//right menu header
function getRightMenuHeader(menuName = ''){
    let headerContent = '';
    var header = new HtmlElement('div', 'mindalay--right-menu-header mindalay--brand-color-background');
    var headerChildDiv = new HtmlElement('div', 'mindalay--popup-close-button close-right-menu')
    if(menuName){
        switch (menuName) {
            case members_btn_name:
                headerContent = getRightMenuHeaderContent(TR_MEMBERS, users.length)
                let checkbox = `<div class="checkbox">
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
    header.append(headerChildDiv.append(right_arrow_icon));
    headerContent != '' ? header.append(headerContent) : '';
    return header;
}

function getRightMenuBody(){
    return new HtmlElement('div', 'mindalay--right-menu-body');
}

function toggleMenuName(menuName = ''){
    menuName !== '' ? default_RightMenu.attr('data-toggle', menuName) : default_RightMenu.removeAttr('data-toggle') 
}

function getRightMenuHeaderContent(translationKey, content){
    let titleWrapper = new HtmlElement('div', 'mindalay--right-menu-title-wrapper');
    let headerContent = new HtmlElement('p');
    headerContent.append(`<strong class='translation' data-id='${translationKey}'></strong> (<span>${content}</span>)`)
    titleWrapper.append(headerContent)
    let HeaderTitle = headerContent.find('strong')
    getTranslation(HeaderTitle, 'data-id', translationKey)
    return titleWrapper;
}
