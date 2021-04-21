
function getPreloader(preloader_leave_location){
    const loaderContainer = new HtmlElement('div', 'loader-container');
    const loader =  new HtmlElement('div', 'load');

    const leave = new HtmlElement('a', `preloader-leave-action ${TRANSLATION}`);
    leave.attr('href', preloader_leave_location)
    leave.attr(TRANSLATION_KEY_ID, TR_LOG_OUT);

    for (let index = 0; index < 4; index++) {
        const loader_item = new HrLine()
        loader.append(loader_item);
    }
    loaderContainer.append(loader);
    loaderContainer.append(leave);
    PRELOADER.append(loaderContainer);
}

function AddPreloaderButton(){
    const button = new Button('start-webinar', `${MINDALAY_BUTTON_DARK} ${TRANSLATION} ${PRELOADER_BUTTON}`, '', true, TRANSLATION_KEY_ID, TR_START_WEBINAR )
    $('.loader-container').append(button[0]);
    getTranslation(button, TRANSLATION_KEY_ID, TR_START_WEBINAR)
}


function AddPreloaderText(preloaderMessage){
    const loaderTextElement = new HtmlElement('small')
    loaderTextElement.addClass(`${TRANSLATION}`)
    loaderTextElement.attr('data-id', preloaderMessage)
    $('.loader-container').append(loaderTextElement);
    getTranslation(loaderTextElement, TRANSLATION_KEY_ID, preloaderMessage)
}