$j(text).summernote();


$(".note-editable").off("keyup")

bkp = chrome.extension.getBackgroundPage();

tableNumber = $j("<style></style>",{text:"table {counter-reset: rows " + (bkp.sitesP.length -1) + ";}"}).appendTo("head")


$j("body").on("click","tr",e=>(e.offsetX > e.currentTarget.offsetWidth-42 && e.currentTarget.remove(),log(e,e.offsetX,e.currentTarget.offsetWidth-42),1))

chrome.storage.sync.get(r => {$(".note-editable")[0].insertAdjacentHTML("afterbegin", "<table>" +
    (r.pages ? (r.pages.replace(/(.+)\|\|\|(.+)/g, (z, a, b) =>
        "<tr><td>%s</td><td>%s</td></tr>".parse(...[
            a,
            (~b.search("chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html") ? Object.fromEntries([...new URLSearchParams(b.trim())]).uri : b)
        ].map(i => i.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')))) + "<tr><td><br></td><td><br></td></tr>") : "") +
    "</table>");$j("tbody").sortable({cancel:"td"})})

updateInt = 0;

$(".note-editable").keyup(e => {
    clearTimeout(updateInt)
    updateInt = setTimeout(() => {
        tableRow = $j(".note-editable table tr:last()");
        if (!tableRow.length) {
            e.target.insertAdjacentHTML("afterbegin", "<table><tr><td><br></td><td><br></td></tr>")
            tableRow = $j(".note-editable table tr:last()");
            $j("tbody").sortable({cancel:"td"});
        } else if (tableRow.text().trim()) {
            tableRow.parents("table").append('<tr><td><br></td><td><br></td></tr>');
            tableRow = $j(".note-editable table tr:last()");
        }
        $j(".note-editable > :contains(\t):not(table):contains(:),.note-editable > :contains(|):not(table):contains(:)").deepest().each((i, j) => {
            tableOp = +!$xx('.//div[starts-with(.,"!!")]|.//span[starts-with(.,"!!")]|.//p[starts-with(.,"!!")]', e.target, 1).remove().length;
            ([tableRow.parents("table"), tableRow][tableOp])[["prepend","before"][tableOp]](j.innerText.replace(/(.+)[\t|](?=[\w-]+:\/\/)(.+)/g, (z, a, b) =>
                "<tr><td>%s</td><td>%s</td></tr>".parse(...[a,
                    (~b.search("chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html") ? Object.fromEntries([...new URLSearchParams(b.trim())]).uri : b)
                ].map(i => i.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')))));
        }).html("<br>");
    }, 1000);
});

$j(save).click(e => {

    pages = $j("table tr:contains(:)").get().map(i => [...i.cells].map(i => i.innerText).join("|||")).join("\n")
    chrome.storage.sync.set({
        pages: pages
    });
    tableNumber.text("table {counter-reset: rows " + (bkp.sitesP.length -1) + ";}");
    log(bkp)
    pages = [...(pages || "").matchAll(/(.+)\|\|\|(.+)/g)];
    bkp.sites = bkp.sitesP.concat(pages.map(i => [bkp.switchOnetab, i[2], 0]));
    bkp.zzz = bkp.zz.concat(pages.map((i, j) => ({
        "description": (bkp.sitesP.length + j) + ": " + i[1],
        "content": (bkp.sitesP.length + j) + ""
    })));
    // bkp.location.reload()
    status.textContent = 'Options saved.';
    setTimeout(function () {
        status.textContent = '';
    }, 750);
});