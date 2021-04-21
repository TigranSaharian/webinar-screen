function getSimpleAlert(type, alertData = '', contentText = '') {
    let alert = new HtmlElement('div', `alert ${type} ${TRANSLATION} show-alert`)
    $('#alert').append(alert);
    if (contentText) {
        alert.attr('data-id', contentText);
        getTranslation(alert, TRANSLATION_KEY_ID, contentText)
    }
    alertData !== '' ? alert.text(alertData) : ''
    setTimeout(() => {
        alert.remove()
    }, 3000)
}

function userOnlineAlert(alertData = '') {
    let alert = new HtmlElement('div', `alert ${ALERT_DARK} ${TRANSLATION} user-entered show-alert`, alertData)
    $('#alert').append(alert);
    setTimeout(() => {
        alert.remove()
    }, 3000)
}

function getConnectionLostAlert() {
    let container = new HtmlElement('div', 'connection-timer d-flex')
    container.attr('id', 'connection-timer')

    let textWrapper = new HtmlElement('p', 'translation')
    textWrapper.attr('id', 'connection-lost-text')
        .attr('data-id', TR_CONNECTION_LOST);
    
    let connectingWrapper = new HtmlElement('div', 'd-flex')
    let dots = new HtmlElement('span', 'connection-dots')
    
    let connecting = new HtmlElement('span', 'translation')
    connecting.attr('id', 'connectiong-in')
        .attr('data-id', TR_CONNECTING_IN)
    
    connectingWrapper.append(connecting)
    connectingWrapper.append(dots)
    
    container.append(textWrapper);
    container.append(connectingWrapper)
    
    $('body').append(container);
    getTranslation($('#connectiong-in'), TRANSLATION_KEY_ID, TR_CONNECTING_IN)
    getTranslation($('#connection-lost-text'), TRANSLATION_KEY_ID, TR_CONNECTION_LOST)
}