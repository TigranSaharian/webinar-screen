class HrLine{
    element = $('<hr>');
    constructor(){
        return this.element;
    }
}

class HtmlElement{
    constructor(element, className = '', text = ''){
        element = $(document.createElement(element));
        $(element).attr('class', className)
        $(element).text(text)
        return element;
    }
}

class Button{
    element = $(document.createElement('button'));
    type = 'button';
    constructor(id = '', className = '', icon = '', isShow = true, translationKey = '', translationValue = '', prefix = ''){
        this.element.attr('type', this.type);
        this.element.attr('class', className);
        this.element.append(icon)
        if(isShow === false) this.element.addClass('d-none')
        if(prefix && id) this.element.attr('id', `${prefix + id}`);
        if(!prefix && id) this.element.attr('id', id);
        this.element.attr(`${translationKey}`, translationValue);
        return this.element;
    }
}