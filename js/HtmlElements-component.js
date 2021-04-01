class HrLine{
    element = $('<hr>');
    constructor(){
        return this.element;
    }
}

class HtmlElement{
    constructor(element, className, text){
        element = $(document.createElement(element));
        if(className !== null) $(element).attr('class', className)
        if(text !== null) element[0].innerText = text;
        return element;
    }
}

class Button{
    element = $(document.createElement('button'));
    type = 'button';
    // constructor(className = null, icon = null, id = null, prefix = null, isHidden = false, text = null){
    //     this.element.attr('type', this.type);
    //     if(className !== null) this.element.attr('class', className);
    //     if(icon !== null) this.element.append(icon);
    //     if(prefix !== null && id !== null) this.element.attr('id', `${prefix + id}`);
    //     if(prefix === null && id !== null) this.element.attr('id', id);
    //     if(isHidden == true) this.element.addClass('d-none')
    //     if(text !== null) this.element.append(text);
    //     return this.element;
    // }


    constructor(id = '', className = '', icon = '', isShow = true, translationKey = '', translationValue = ''){
        this.element.attr('type', this.type);
        this.element.attr('class', className);
        this.element.append(icon)
        if(isShow === false) this.element.addClass('d-none')
        this.element.attr('id', id);
        this.element.attr(`${translationKey}`, translationValue);
        return this.element;
    }
}