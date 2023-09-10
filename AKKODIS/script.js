$.fn.extend({
    treed: function (o) {

        var openedClass = 'glyphicon-minus-sign';
        var closedClass = 'glyphicon-plus-sign';

        if (typeof o != 'undefined') {
            if (typeof o.openedClass != 'undefined') {
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined') {
                closedClass = o.closedClass;
            }
        };

        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
            branch.addClass('branch');

            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();


        });

        //fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function () {
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

//Initialization of treeviews

$('#tree1').treed();

$('#tree2').treed({ openedClass: 'glyphicon-folder-open', closedClass: 'glyphicon-folder-close' });

$('#tree3').treed({ openedClass: 'glyphicon-chevron-right', closedClass: 'glyphicon-chevron-down' });


$(document).ready(function () {


    $('#toggle-treeview').on('click', function () {
        $('#treeview-container').toggle(); // Affiche ou masque le treeview
    });

    $('#tree2').treed({ openedClass: 'glyphicon-folder-open', closedClass: 'glyphicon-folder-close' });

    var treeContainer = $('#treeview-container');

    treeContainer.hide();


    $('#toggleTreeButton').on('click', function () {


        var treeContainer = $('#treeview-container');
        var three = $('#initialIframe');
        var contentDiv = $('#contentDiv');
       

        if (treeContainer.is(':visible')) {
            treeContainer.hide();
            three.hide();
            contentDiv.css('padding-left', '60px'); // padding de 15px lorsque le treeview est affiché

            $(this).text(" >>> ");
        } else {
            treeContainer.show();
            contentDiv.css('padding-left', '15px'); // padding de 60px lorsque le treeview est caché

            $(this).text(" <<< ");
            three.hide();
        }
    });


    $('#treeview-container li').click(function (e) {
        e.stopPropagation(); // Pour éviter que l'événement ne remonte aux `<li>` parents

        var filePath = $(this).attr('file');

        if (filePath) {
            // Charger le contenu du fichier dans la deuxième colonne
            $('#contentDiv').load(filePath);
        }
    });

});









