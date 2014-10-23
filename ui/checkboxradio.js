/*!
 * jQuery UI Checkboxradio @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/checkboxradio/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var baseClasses = "ui-button ui-widget",
	typeClasses = "ui-state-focus ui-radio-label ui-checkbox-label ui-state-active " +
	"ui-icon-beginning ui-icon-end ui-icon-top ui-icon-bottom ui-checkboxradio-radio-checked " +
	"ui-checkboxradio-checkbox-checked",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ".ui-checkboxradio" ).checkboxradio( "refresh" );
		});
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
				.filter(function() {
					return !this.form;
				});
			}
		}
		return radios;
	};

$.widget( "ui.checkboxradio", {
	version: "@VERSION",
	options: {
		disabled: null,
		label: null,
<<<<<<< HEAD
		icon: true,
=======
		icon: false,
>>>>>>> db16c96... Checkboxradio: add classes option
		classes: {
			"ui-checkboxradio": "",
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-radio-label": "",
			"ui-checkboxradio-icon": "ui-corner-all",
			"ui-checkboxradio-checked": ""
		}
	},

	_getCreateOptions: function() {
		var disabled,
			that = this,
			options = this._super() || {};

		this._readLabel();

		this.originalLabel = "";
		this.label.contents().not( this.element ).each( function() {
			that.originalLabel += ( this.nodeType === 3 ) ? $( this ).text() : this.outerHTML;
		});

		disabled = this.element.prop( "disabled" );
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_create: function() {
		var formElement = $( this.element[ 0 ].form );

		// We don't use _on and _off here because we want all the checkboxes in the same form to use
		// a single handler which handles all the checkboxradio widgets in the form
		formElement.off( "reset" + this.eventNamespace, formResetHandler );
		formElement.on( "reset" + this.eventNamespace, formResetHandler );

		if ( this.options.disabled == null ) {
			this.options.disabled = this.element.prop( "disabled" ) || false;
		}

		this._readType();

		this._enhance();

		this._on({
			"change": "_toggleClasses",
			"focus": function() {
				this.label.addClass( "ui-state-focus ui-visual-focus" );
			},
			"blur": function() {
				this.label.removeClass( "ui-state-focus ui-visual-focus" );
			}
		});
	},

	_readType: function() {
		this.type = this.element[ 0 ].type;
		if ( !/radio|checkbox/.test( this.type ) ) {
			$.error( "Can't create checkboxradio widget for type " + this.type );
		}
	},

	_readLabel: function() {
		var ancestor, labelSelector,
			parent = this.element.closest( "label" );

		this.parentLabel = false;

		// Check control.labels first
		if ( this.element[ 0 ].labels !== undefined && this.element[ 0 ].labels.length > 0 ) {
			this.label = $( this.element[ 0 ].labels[ 0 ] );
		} else if ( parent.length > 0 ) {
			this.label = parent;
			this.parentLabel = true;
		} else {

			// We don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();

			// Look for the label based on the id
			labelSelector = "label[for='" + this.element.attr( "id" ) + "']";
			this.label = ancestor.find( labelSelector );
			if ( !this.label.length ) {

				// The label was not found, make sure ancestors exist. If they do check their
				// siblings, if they dont check the elements siblings
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();

				// Check if any of the new set of ancestors is the label
				this.label = ancestor.filter( labelSelector );
				if ( !this.label.length ) {

					// Still not found look inside the ancestors for the label
					this.label = ancestor.find( labelSelector );
					if ( this.label.length === 0 ) {
						$.error( "No label found for checkboxradio widget" );
					}
				}
			}
		}
	},

	_enhance: function() {
		var checked = this.element.is( ":checked" );

		this._setOption( "disabled", this.options.disabled );
		this._updateIcon( checked );
		this.element.addClass( "ui-helper-hidden-accessible " +
			this._classes( "ui-checkboxradio" ) );

		this.label.addClass( baseClasses + " " + this._classes( "ui-checkboxradio-label" ) );

		if ( this.type === "radio" ) {
			this.label.addClass( "ui-checkboxradio-radio-label" );
		}

		if ( checked ) {
			this.label.addClass( this._classes( "ui-checkboxradio-checked" ) +
				" ui-state-active" );
		}
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			this.label.html( this.icon ? this.icon : "" ).append( this.options.label );
		} else if ( this.originalLabel ) {
			this.options.label = this.originalLabel;
		}
	},

	widget: function() {
		return this.label;
	},

	_toggleClasses: function() {
		var checked = this.element.is( ":checked" );
		this.label.toggleClass( this._classes( "ui-checkboxradio-checked" ) +
			" ui-state-active", checked );
		if ( this.options.icon && this.type === "checkbox" ) {
			this.icon
				.toggleClass( "ui-icon-check", checked )
				.toggleClass( "ui-icon-blank", !checked );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] )
				.not( this.element )
				.map(function() {
					return $( this ).checkboxradio( "widget" )[ 0 ];
				})
				.removeClass( "ui-state-active " + this._classes( "ui-checkboxradio-checked" ) );
		}
	},

	_destroy: function() {
		this.label.removeClass( this._classes( "ui-checkboxradio-radio-label ui-checkboxradio-label" ) + " " +
			baseClasses + " " + typeClasses );
		if ( this.icon ) {
			this.icon.remove();
		}
		this.element.removeClass( this._classes( "ui-checkboxradio" ) +
			" ui-helper-hidden-accessible" );
	},

	_elementsFromClassKey: function( classKey ) {
		var parts = classKey.split( "-" ),
			checkedType = parts[ 2 ] === this.type || parts[ 2 ] === undefined,
			checkedClass = parts[ 3 ] === "checked" || this.element.is( ":checked" );
		switch ( classKey ) {
			case "ui-checkboxradio":
			case "ui-checkboxradio-radio-label":
			case "ui-checkboxradio-label":
			case "ui-checkboxradio-checked":
				if ( checkedType && checkedClass ) {
					return this.label;
				}
				return $();
			case "ui-checkboxradio-icon":
				if ( this.icon ) {
					return this.icon;
				}
				return $();
		}
		return this._superApply( arguments );
	},

	_setOption: function( key, value ) {
		var original;
		if ( key === "label" && value === null ) {
			original = this.options[ key ];
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this.label.toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			return;
		}
		if ( key === "label" && value === null ) {
			this.options[ key ] = original;
		}
		this.refresh();
	},

	_updateIcon: function( checked ) {
		var toAdd = this._classes( "ui-checkboxradio-icon" ) +
		" ui-icon ui-icon-background ";

		if ( this.options.icon ) {
			this.label.addClass( "ui-icon-beginning" );
			if ( !this.icon ) {
				this.icon = $( "<span>" );
			}

			if ( this.type === "checkbox" ) {
				toAdd += checked ? "ui-icon-check" : "ui-icon-blank";
			} else {
				toAdd += "ui-icon-blank";
			}
			this.icon.addClass( toAdd ).appendTo( this.label );
		} else if ( this.icon !== undefined ) {
			this.label.removeClass( "ui-icon-beginning" );
			this.icon.remove();
			delete this.icon;
		}
	},

	refresh: function() {
		var checked = this.element.is( ":checked" ),
			isDisabled = this.element.is( ":disabled" );
		this._updateIcon( checked );
		this.label.toggleClass( "ui-state-active " + this._classes( "ui-checkboxradio-checked" ), checked );
		if ( this.options.label !== null ) {
			this.label.contents().not( this.element.add( this.icon ) ).remove();
			this.label.append( this.options.label );

		}

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions({ "disabled": isDisabled });
		}
	}

});

return $.ui.checkboxradio;

}));
