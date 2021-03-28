
function GetPreloader(preloader_message, preloader_leave_location, preloader_button_text){
    const loaderContainer = new HtmlElement('div', 'loader-container', null);
    const loader =  new HtmlElement('div', 'load', null);
    const loaderText = new HtmlElement('small',null, preloader_message)
    const leave = new HtmlElement('a', 'preloader-leave-action', 'TR_LEAVE');
    const button = new Button( `${mindalayBtnDark} preloader-button`, null, 'start-webinar', null, false, preloader_button_text)
    leave.attr('href', preloader_leave_location)

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