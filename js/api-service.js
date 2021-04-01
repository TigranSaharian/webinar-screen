function getLanguages() {
    $.ajax({
        type: 'GET',
        url: `${API_URL_DOMAIN_KEY}/language`,
    }).done((response) => {
        if (!response.respcode) {
            languages = response.data;
            // languages.forEach(function(language){
            //   var span = $(`<span id="${language.isocode2}">${language.isocode2}</span>`);
            //   $('#languages-list').append(span);
            // });
        }
    });
}

function getTranslations() {
    translations = [];
    getSiteTranslations().then(() => {
        getDefaultTranslations().then(() => {
            SetTranslationToHTML();
        })
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getSiteTranslations() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${API_URL_DOMAIN_KEY}/translation?isocode=${getCookie('language')}&type=2`,
        }).done((response) => {
            if (!response.respcode) {
                translations = [...translations, ...response.data];
                resolve(translations);
            }
        });
    })
}

function getDefaultTranslations() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${API_URL_DOMAIN_KEY}/translation?isocode=${getCookie('language')}&type=0`,
        }).done((response) => {
            if (!response.respcode) {
                translations = [...translations, ...response.data];
                resolve(translations);
            }
        });
    });
}

function setCurrentLanguage() {
    let currentLanguage = getCookie('language');
    $(`#${currentLanguage}`).attr('class', 'active-lg')
}

function SetTranslationToHTML() {
    $('.translation').each(function () {
        var id = $(this).attr('data-id');
        var alt = $(this).attr('data-alt');
        var title = $(this).attr('data-title');
        var placeholder = $(this).attr('data-placeholder');
        if (title && title.length) {
            var selectedTranslationTitle = translations.find(x => x.shortKey == title);
            selectedTranslationTitle && $(this).attr('title', selectedTranslationTitle.translation1);
            return;
        }

        if (alt && alt.length) {
            var selectedTranslationAlt = translations.find(x => x.shortKey == alt);
            selectedTranslationAlt && $(this).attr('alt', selectedTranslationAlt.translation1);
            return;
        }

        if (id && id.length) {
            var selectedTranslation = translations.find(x => x.shortKey == id);
            selectedTranslation && $(this).append(selectedTranslation.translation1);
            return;
        }

        if (placeholder && placeholder.length) {
            var selectedTranslationAlt = translations.find(x => x.shortKey == placeholder);
            selectedTranslationAlt && $(this).attr('placeholder', selectedTranslationAlt.translation1);
            return;
        }
    });
}

function setTranslation(translationkey, translationValue){
    return $(this).attr(translationkey, translationValue);
}

function setViaTitleTransation(translationkey, translationValue){
    var selectedTranslationTitle = translations.find(x => x.shortKey == translationkey);
    selectedTranslationTitle && $(this).attr('title', selectedTranslationTitle.translation1);
    return;
}
function setViaAltTransation(translationkey, translationValue){

}
function setViaIdTransation(translationkey, translationValue){

}
function setViaPlaceholderTransation(translationkey, translationValue){

}