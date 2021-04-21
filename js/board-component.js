function getBoard(boardName, isShowCloseButton){
    let boardWrapper = new HtmlElement('div', 'mindalay--board-wrapper')
    let boardContentWrapper = new HtmlElement('div', 'mindalay--board-content-wrapper')
    boardContentWrapper.append(getBoardContent(boardName, isShowCloseButton))
    boardWrapper.append(boardContentWrapper)
    boardWrapper.attr(DATA_BOARD_FOLDED, 'open')
    CONTAINER_MAIN_BODY.append(boardWrapper)

    switch (boardName) {
        case text_board_btn_name:
            boardWrapper.attr(DATA_BOARD_ID, TEXT_BOARD)
            getTranslation($('#save-text-file'), TRANSLATION_KEY_ID, TR_SAVE_AS_TEXT_FILE);
            getTranslation($('#clear-textarea'), TRANSLATION_KEY_ID, TR_CLEAR);
            getTranslation($(`#board--${text_board_btn_name}`), TRANSLATION_KEY_TITLE, TR_TEXT_BOARD)
            textBoard = new ysEditor();
            break;
        case blackboard_btn_name:
            boardWrapper.attr(DATA_BOARD_ID, BLACK_BOARD)
            getTranslation($(`#board--${blackboard_btn_name}`), TRANSLATION_KEY_TITLE, TR_BLACKBOARD)
            break;
        case screen_share_btn_name:
            boardWrapper.attr(DATA_BOARD_ID, SCREEN_SHARE_BOARD)
            getTranslation($(`#board--${screen_share_btn_name}`), TRANSLATION_KEY_TITLE, TR_SCREEN_SHARE)
        default:
            break;
    }
    getTranslation($(`#board--${fold_board_name}`), TRANSLATION_KEY_TITLE, TR_FOLD_BOARD)
    getTranslation($(`#board--${full_screen_btn_name}`), TRANSLATION_KEY_TITLE, TR_FULL_SCREEN)
    isShowCloseButton ? getTranslation($(`#board--${close_btn_name}`), TRANSLATION_KEY_TITLE, TR_CLOSE) : '';
    return boardWrapper;
}

function getBoardButtonsGroup(actionButtonIcon, translationVale, actionName, isShowCloseButton){
    let buttonGroup = new HtmlElement('div', 'mindalay--board-tool-buttons')
    let buttons = ''
        buttons += getBoardButton(translationVale, actionName, actionButtonIcon, PREFIX_BOARD_BUTTONS_GROUP)
        buttons += getBoardButton(TR_FULL_SCREEN, full_screen_btn_name, full_screen_icon, PREFIX_BOARD_BUTTONS_GROUP)
        isShowCloseButton === true ? buttons += getBoardButton(TR_CLOSE, close_btn_name, clsoe_icon, PREFIX_BOARD_BUTTONS_GROUP, 'close-board') : '';
        buttons += getBoardButton(TR_FOLD_BOARD, fold_board_name, fold_board_icon, PREFIX_BOARD_BUTTONS_GROUP)
    buttonGroup.append(buttons)
    return buttonGroup;
}

function getBoardFoldButtonGroup(actionButtonIcon, translationVale, boardIdentificationId, isShowCloseButton){
    let buttons = ''
        buttons += getBoardButton(translationVale, boardIdentificationId, actionButtonIcon, PREFIX_FOLD_BOARD_BUTTONS_GROUP)
        buttons += getBoardButton(TR_MAXIMIZE_BOARD, maximize_bord_name, maximize_bord_icon, PREFIX_FOLD_BOARD_BUTTONS_GROUP)
        isShowCloseButton === true ? buttons += getBoardButton(TR_CLOSE, close_btn_name, clsoe_icon, PREFIX_FOLD_BOARD_BUTTONS_GROUP, 'close-board') : '';
    let buttonsGroup = new HtmlElement('div', 'd-flex board-buttons-group')
    buttonsGroup.attr(DATA_BOARD_ID, boardIdentificationId);
    buttonsGroup.append(buttons)
    BOARD_FOLDED_BUTONS.append(buttonsGroup);
    getTranslation($(`#fold-board--${boardIdentificationId}`), TRANSLATION_KEY_TITLE, translationVale)
    getTranslation($(`#fold-board--${maximize_bord_name}`), TRANSLATION_KEY_TITLE, TR_MAXIMIZE_BOARD)
    getTranslation($(`#fold-board--${close_btn_name}`), TRANSLATION_KEY_TITLE, TR_CLOSE)

}

function getBoardButton(translationValue, actionName, icon, prefix = '', className = ''){
    return `<a class="mindalay--board-tool-button ${className ? className : ''} ${TRANSLATION} ${actionName}" data-title="${translationValue}" id="${prefix}${actionName}" title="" rel="${actionName}" href="#">${icon}</a>`
}

function getBoardContent(boardName, isShowCloseButton){
    let boardConetnt = new HtmlElement('div', 'mindalay--board-content')
    let boardConetntData;
    let buttonGroup;
    switch (boardName) {
        case text_board_btn_name:
            boardConetntData = getRichText(boardConetnt)
            buttonGroup = getBoardButtonsGroup(text_board_icon, TR_TEXT_BOARD, boardName, isShowCloseButton)
            break;
        case screen_share_btn_name:
            boardConetntData = getScreenShare(boardConetnt)
            buttonGroup = getBoardButtonsGroup(screen_share_icon, TR_SCREEN_SHARE, boardName, isShowCloseButton)
            break;
        case blackboard_btn_name:
            boardConetntData = getBlackBoard(boardConetnt)
            buttonGroup = getBoardButtonsGroup(blackboard_icon, TR_BLACKBOARD, boardName, isShowCloseButton)
            break;
        default:
            break;
    }
    boardConetnt.append(buttonGroup)
    boardConetnt.append(boardConetntData)
    return boardConetnt;
}

function getRichText(boardConetnt){
    let $richText = `<div id="textarea-blackboard" class="mindalay--textarea-wrapper">
                        <div id="yseditor"></div>
                        <div class="mindalay--textare-buttons-group">
                            <button type="button" id="save-text-file"  data-id="${TR_SAVE_AS_TEXT_FILE}" class="${TRANSLATION}"></button>
                            <button type="button" id="clear-textarea"  data-id="${TR_CLEAR}" class="${TRANSLATION}"></button>
                        </div>
                    </div>`
    boardConetnt.append($richText)
    return boardConetnt;
}

function getScreenShare(boardConetnt){
    let screenShareContainer = ''
    webinarResponseData.screenSharedUserId === currentUser.id ? screenShareContainer = `<div id="screen-share-container" class="mindalay-scrren-share-local"></div>` 
                                                : screenShareContainer = `<div id="screen-share-container" class="mindalay-scrren-share-remote aaa"></div>`
    boardConetnt.append(screenShareContainer);
    return boardConetnt;
}

function getBlackBoard(boardConetnt){
    return;
}