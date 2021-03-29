class HrLine{
    element = $('<hr>');
    constructor(){
        return this.element;
    }
}

class HtmlElement{
    constructor(element, className, text){
        element = $(document.createElement(element));
        if(className !== null) $(element).attr('class', className)// element[0].className = className;
        if(text !== null)element[0].innerText = text;
        return element;
    }
}

class Button{
    element = $('<button></button>');
    type = 'button';
    constructor(className = null, icon = null, id = null, prefix = null, isHidden = false, text = null){
        this.element[0].setAttribute('type', this.type);
        if(className !== null) this.element[0].className = className;
        if(icon !== null) this.element[0].innerHTML = icon;
        if(prefix !== null && id !== null) this.element[0].setAttribute('id', `${prefix + id}`);
        if(prefix === null && id !== null) this.element[0].setAttribute('id', id);
        if(isHidden == true) this.element[0].className += ' d-none'
        if(text !== null) this.element[0].innerHTML += text;
        return this.element;
    }
}