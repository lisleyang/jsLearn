interface Document{
    createElement(tagName:'div'):HTMLDivElement
    createElement(tagName:'span'):HTMLSpanElement
    createElement(tagName:string):HTMLElement
}
let aaa:Document

let oSpan:HTMLSpanElement = aaa.createElement('span')