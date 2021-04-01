
function GetPreloader(preloader_message, preloader_leave_location, preloader_button_text){
    const loaderContainer = new HtmlElement('div', 'loader-container', null);
    const loader =  new HtmlElement('div', 'load', null);

    const loaderText = new HtmlElement('small',null, '')
    loaderText.addClass('translation')
    loaderText.attr('data-id', preloader_message)

    const leave = new HtmlElement('a', `preloader-leave-action ${translation}`, null);
    leave.attr('href', preloader_leave_location)
    leave.attr('data-id', 'TR_LEAVE_WEBINAR');

    const button = new Button('start-webinar', `${mindalayBtnDark} ${translation} ${preloader_btn}`, '', true, TRANSLATION_KEY_ID, TR_START_WEBINAR )
    for (let index = 0; index < 4; index++) {
        const loader_item = new HrLine()
        loader.append(loader_item);
    }

    loaderContainer.append(loader);
    loaderContainer.append(loaderText);
    if(isLecturer) loaderContainer.append(button[0]);
    loaderContainer.append(leave);
    preloader.append(loaderContainer);
}