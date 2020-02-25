var hbs = require('hbs');

hbs.registerHelper('for', function (pages, currentPage, category, block) {
    var out = "";
    for (var i = 1; i <= pages; i++) {
        if (i != currentPage) {
            out += `<form action="/shoes/${category}?_method=GET&page=${i}" method="POST">${block.fn({pageNo:i})}</form>`
        }
        else {
            //currentPage
            out += block.fn({ pageNo: i, isDisable: "disabled" });
        }
    }
    return out
});

//#if if ( block.fn()) else (block.inverse())

hbs.registerHelper('ifMinQuantity', function (quantity, block) {
    if (quantity == 1){
        return block.fn(this);
    }
    return block.inverse(this);
})