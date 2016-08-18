(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"global.html\">Globals</a>","id":"global","children":[]},{"label":"<a href=\"Listing.html\">Listing</a>","id":"Listing","children":[]},{"label":"<a href=\"Manufacturer.html\">Manufacturer</a>","id":"Manufacturer","children":[]},{"label":"<a href=\"Matcher.html\">Matcher</a>","id":"Matcher","children":[]},{"label":"<a href=\"Product.html\">Product</a>","id":"Product","children":[]},{"label":"<a href=\"Term.html\">Term</a>","id":"Term","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
