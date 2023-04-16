(function ($) {

/* Options de l'API Mediabox
 *
 * overlayClose: 	(Boolean:true) Allow click on overlay to close the dialog?
 * type: 		(String:undefined) inline/image/html/ajax/iframe/
 * minHeight: 		(Number|String:200) The minimum height for the container
 * minWidth: 		(Number|String:300) The minimum width for the container
 * maxHeight: 		(Number|String:null) The maximum height for the container. If not specified, the window height is used.
 * maxWidth: 		(Number|String:null) The maximum width for the container. If not specified, the window width is used.
 * height: 		(Number|String:null) fixed height for the container
 * width: 		(Number|String:null) fixed width for the container
 * autoResize: 		(Boolean:false) Resize container on window resize? Use with caution - this may have undesirable side-effects.
 * onOpen: 		(Function:null) The callback function used in place of SimpleModal's open
 * onShow: 		(Function:null) The callback function used after the modal dialog has opened
 * onClose: 		(Function:null) The callback function used in place of SimpleModal's close
 *
 */

// API modalbox
	$.mediabox
	= function (options) {
		// autodetection du type ?
		if (typeof(mediabox_autodetect_href) == 'function'
			&& options.href
			&& !options.type) {
			options.type = mediabox_autodetect_href(options.href);
		}
		$.fn.mediabox(options);
	};

	$.modalboxload = $.modalbox = function (href, options) {$.mediabox($.extend({href:href,overlayClose:true},options));};
	$.modalboxclose = $.mediaboxClose = $.fn.mediaboxClose;

	$.parseMediaboxOptions = function(nameSpace, opener) {
		var options = {};

		var data2options = {"width":"width","height":"height","min-width":"minWidth","min-height":"minHeight","max-width":"maxWidth","max-height":"maxHeight","caption-state":"defaultCaptionState"};
		var v;
		for (var o in data2options) {
			v = ($(opener).data(nameSpace+'-' + o) || '');
			if (v) {
				options[data2options[o]] = v;
			}
		}

		// si aucun attribut data-box-xx regarder la classe pour compat avec l'ancienne box
		// boxInline boxIframe boxWidth-xx boxHeight-xx
		if (!options.length) {
			var eltclass = $(opener).prop('class');
			if (eltclass){
				if (eltclass.indexOf("boxWidth-")!== -1){
					var w = eltclass.match(/boxWidth-([^\s'">]*)/);
					w = w[1].replace(/pc/, '%'); // % not allowed in html attribute ; use 100pc instead of 100%
					options["width"] = w;
				}
				if (eltclass.indexOf("boxHeight-")!== -1){
					var h = eltclass.match(/boxHeight-([^\s'">]*)/);
					h = h[1].replace(/pc/, '%'); // % not allowed in html attribute ; use 100pc instead of 100%
					options["height"] = h;
				}
				if (eltclass.indexOf("boxIframe")!== -1){
					options["type"] = 'iframe';
				}
				if (eltclass.indexOf("boxInline")!== -1) {
					options["type"] = 'inline';
				}
			}
		}

		// en dernier le type, qui est prioritaire ici
		v = ($(opener).data(nameSpace+'-' + 'type') || '');
		if (v) {
			options["type"] = v;
		}

		return options;
	}

})(jQuery);
/*
 *
 *
 *
 */
var mediaboxInit = function() {

	// recuperer les préférences de l'utilisateur
	var b = $.extend({},mediabox_settings);

	// renommer le data-box-type en cas de namespace personnalisé
	if (b.ns !== 'box') {
		$('[data-box-type]').each(function(i,e) {
			var $e = $(e);
			var d = $e.attr('data-box-type');
			$e.removeAttr('data-box-type').attr('data-'+b.ns+'-type',d);
		});
	}

	// 1) Auto completion de data-href-popin qd on peut
	// 2) Auto detection de type de contenu pour la popin
	if (b.auto_detect) {

		var $popins = $('[data-href-popin],[data-'+b.ns+'-type]' + (window.var_zajax_content ? ',[data-var_zajax],a.popin' : ''))
			.add(b.sel_c)
			.not(ajaxbloc_selecteur,'.ajaxbloc','.hasbox');

		$popins.each(function(i,e) {
			var $e = $(e);
			var url = $e.attr('href') || "./";
			var popin = $e.attr('data-href-popin');
			var type = $e.attr('data-'+b.ns+'-type') || '';

			if ( !popin ) {
				// requete ajax pour recuperer un inclure
				// ex : [data-ajax-env="(#ARRAY{fond,modele/emb,id_document,2}|encoder_contexte_ajax)"]
				var env = $e.attr('data-ajax-env') ;
				if ( env ) {
					url = parametre_url( parametre_url(url,'var_ajax',1) ,'var_ajax_env',env)
					$e.removeAttr('data-ajax-env');
					type = 'ajax';
				}
				// compatibilité zbloc
				var za = $e.attr('data-var_zajax') ;
				if ( za !== undefined || $e.hasClass('popin') ) {
					// content est le bloc de contenu, quel que soit son nom
					if (za === 'content' && window.var_zajax_content) {
						za = window.var_zajax_content;
					}
					url = parametre_url(url,'var_zajax', za || window.var_zajax_content);
					$e.removeAttr('data-var_zajax');
					type = 'ajax';
				}

				// compléter href-popin si pertinent
				if ((url !== $e.attr('href') || (!popin && type)) && url !== "./" ) {
					$e.attr('data-href-popin', url);
				}
			}

			url = popin || url;

			// récuperer le type sur une éventuelle variante de data-
			// ex : data-box-image-attrs="{height:500}"
			if ( !type ) {
				var attrs = $e.data();
				var types = ['inline','html','iframe','image','ajax'];
				types.some( function(e) {
					// box-image => boxImage
					var k = b.ns + e.charAt(0).toUpperCase() + e.slice(1);
					if (attrs[k]) {
						type = e;
						return true;
					}
				});
			}

			// deduire le type de contenu (regex)
			if ( !type && typeof(mediabox_autodetect_href) == 'function' ) {
				type = mediabox_autodetect_href(url);
			}

			// [par defaut : iframe]
			// on en profite pour mettre à jour l'ancienne syntaxe
			if ( !type || $e.hasClass('boxIframe')) {
				type = "iframe";
				$e.removeClass('boxIframe');
			}
			// enfin on pose le data-
			$e.attr('data-' + b.ns + '-type',type);

		});
	}

	// mode galerie
	if (b.sel_g) {
		// gérer les conteneurs et/ou cibles directes
		var $items = $();
		$(b.sel_g).each(function(i,e){
			$items = $items.add(
				$(this).is('a[type^=\'image\']')
				? $(this)
				: $(this).find('a[type^=\'image\']')
			);
		});
		$items
		.not('.hasbox')
		.removeAttr('onclick') // se debarrasser du onclick de SPIP
		.mediabox({rel:'galerieauto',slideshow:true,slideshowAuto:false,type:'image'})
		.addClass('hasbox');
	}

	// box auto sur tous les liens vers des images
	if (b.tt_img) {
		$('a[type^="image"],a[href$=".png"],a[href$=".jpg"],a[href$=".jpeg"],a[href$=".svg"]')
		.not('.hasbox')
		.removeAttr('onclick') // se debarrasser du onclick de SPIP
		.mediabox({type:'image'})
		.addClass('hasbox')
		;
	}

	// charger la box le selecteur general
	$(b.sel_c)
		.not('.hasbox')
		.mediabox()
		.addClass('hasbox') // noter qu\'on l\'a vue
	;

	$('[data-href-popin]', this)
		.not('.hasbox')
		.click(function(){if ($.modalbox) $.modalbox($(this).attr('data-href-popin'), $.parseMediaboxOptions(b.ns, this));return false;})
		.addClass('hasbox');

};

(function($) {
	if (typeof onAjaxLoad == 'function') onAjaxLoad(mediaboxInit);
	$(mediaboxInit);
})(jQuery);

/**
 * Déterminer a priori la nature d'une ressource
 * mediabox_autodetect_href('https://contrib.spip.net/') -> "iframe"
 * @ href [string] expression à analyser
 * @ options [objet]
 * return [string|array|false] type de contenu correspondant
 */
function mediabox_autodetect_href(href, options) {

		options = $.extend({
			breakMode : true, // retour rapide dès le premier succès, sinon un tableau complet
			tests : {
				image:  /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
				inline: /^[#.]\w/,
				html:   /^\s*<[\w!][^<]*>/,
				ajax:   /((\?|&(amp;)?)var_z?ajax=|cache-ajaxload\/)/i,
				iframe: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
			},
			},options);

		var matched = options.breakMode ? false : [];

		$.each(options.tests, function(type, regex) {
				if ( href.match(regex) ) {
					if (options.breakMode) {
						matched = type;
						return false;
					} else {
						matched.push(type);
					}
				}
		});

		return matched;
};
