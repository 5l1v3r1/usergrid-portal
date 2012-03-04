window.usergrid = window.usergrid || {};
usergrid.console = usergrid.console || {};
usergrid.console.ui = usergrid.console.ui || { };
usergrid.console.ui.collections = usergrid.console.ui.collections || { };

(function() {
	// This code block *WILL* load before the document is complete

	var entity_list_item = {
		options: {
		},
		
		_create: function() {
			
			var self = this;
			var o = self.options;
			var el = self.element;
			
			var entity_id = el.dataset('entity-id');
			var entity_type = el.dataset('entity-type');
			var entity = usergrid.console.getQueryResultEntity(entity_id);
			if (!entity) return;
			o.entity = entity;
			o.path = el.dataset('collection-path');
			
			o.header = self.getHeader();
			o.collections = self.getCollections();
			o.contents = self.getContents();
			o.metadata = self.getMetadata();
			o.json = self.getJson();
			
			o.header.appendTo(el);
			o.collections.appendTo(el);
			o.contents.appendTo(el);
			o.metadata.appendTo(el);
			o.json.appendTo(el);
			
			o.header.find(".button").button();

			var contents_button = o.header.find(".query-result-header-toggle-contents");
			contents_button.click(function() {
				o.contents.toggle();
				return false;
			});
			
			var json_button = o.header.find(".query-result-header-toggle-json");
			json_button.click(function() {
				o.json.toggle();
				return false;
			});
			
			var collections_button = o.header.find(".query-result-header-toggle-collections");
			collections_button.click(function() {
				o.collections.toggle();
				return false;
			});
			
			var metadata_button = o.header.find(".query-result-header-toggle-metadata");
			metadata_button.click(function() {
				o.metadata.toggle();
				return false;
			});
			
			var link_button = o.header.find(".query-result-header-link");
		},
		
		getHeader : function() {
			var entity = this.options.entity;
			
			var name = entity.uuid + " : "
					+ entity.type;
			if (entity.name) {
				name = name + " : " + entity.name;
			} else if (entity.username) {
				name = name + " : " + entity.username;
			}
			
			return $.tmpl("usergrid.ui.collections.entity.header.html", {
				entity : entity,
				name : name,
				path : this.options.path,
				collections : !$.isEmptyObject((entity.metadata || { }).collections || (entity.metadata || { }).connections),
				uri : (entity.metadata || { }).uri
			});
			
		},
				
		getCollections : function() {
			var entity = this.options.entity;
			
			var collections = $.extend({ }, (entity.metadata || { }).collections, (entity.metadata || { }).connections);
			
			if (!$.isEmptyObject(collections)) {
				return $.tmpl("usergrid.ui.collections.entity.collections.html", {
					collections : collections
				}, {
					makeObjectTable : usergrid.console.ui.makeObjectTable,
					tableOpts : usergrid.console.ui.standardTableOpts
				});
			}
			return $("");
		},
				
		getContents : function() {
			var entity_contents = $.extend( false, { }, this.options.entity);
            var path = entity_contents['metadata']['path'];
            entity_contents = $.extend( false, entity_contents, {'path': path});
			delete entity_contents['metadata'];
			return $.tmpl("usergrid.ui.collections.entity.contents.html", {
				entity : entity_contents
			}, {
				makeObjectTable : usergrid.console.ui.makeObjectTable,
				tableOpts : usergrid.console.ui.standardTableOpts
			});
		},

		getMetadata : function() {
			var entity = this.options.entity;
			if (!$.isEmptyObject(entity.metadata)) {
				return $.tmpl("usergrid.ui.collections.entity.metadata.html", {
					metadata : entity.metadata
				}, {
					makeObjectTable : usergrid.console.ui.makeObjectTable,
					tableOpts : usergrid.console.ui.metadataTableOpts
				});
			}
			return $("");
		},
				
		getJson : function() {
			return $.tmpl("usergrid.ui.collections.entity.json.html", {
				entity : this.options.entity
			}, {
				makeObjectTable : usergrid.console.ui.makeObjectTable,
				tableOpts : usergrid.console.ui.standardTableOpts
			});
		},
				
		destroy: function() {			
			this.element.html("");
			this.options.entity = null;
			this.options.header = null;
			this.options.contents = null;
			this.options.metadata = null;
			this.options.collections = null;
			this.options.json = null;
		}
		
	}
	usergrid.console.ui.collections.entity_list_item = entity_list_item;
	
	var entity_detail = {
		options: {
		},
		
		_create: function() {
			
			var self = this;
			var o = self.options;
			var el = self.element;
			
			var entity_id = el.dataset('entity-id');
			var entity_type = el.dataset('entity-type');
			var entity = usergrid.console.getQueryResultEntity(entity_id);
			if (!entity) return;
			o.entity = entity;
			o.path = el.dataset('collection-path');
			
			o.details = self.getDetails();
			
			o.details.appendTo(el);
			
			o.details.find(".button").button();
			o.contents = el.find(".query-result-contents");
			o.json = el.find(".query-result-json");
			o.formDiv = el.find(".query-result-form");
			
			var content_button = o.details.find(".query-result-header-toggle-contents");
			content_button.click(function() {
				o.contents.toggle();
				return false;
			});

            var json_button = o.details.find(".query-result-header-toggle-json");
			json_button.click(function() {
				o.json.toggle();
				return false;
			});
			
			var link_button = o.details.find(".query-result-header-link");
		},
		
		getDetails : function() {
			var entity = this.options.entity;
			
			var name = entity.uuid + " : "
					+ entity.type;
			if (entity.name) {
				name = name + " : " + entity.name;
			} else if (entity.username) {
				name = name + " : " + entity.username;
			}
			
			var collections = $.extend({ }, (entity.metadata || { }).collections, (entity.metadata || { }).connections);
			if ($.isEmptyObject(collections)) collections = null;

			var entity_contents = $.extend( false, { }, this.options.entity);
            var path = entity_contents['metadata']['path'];
            entity_contents = $.extend( false, entity_contents, {'path': path});
			delete entity_contents['metadata'];
			
			var metadata = entity.metadata;
			if ($.isEmptyObject(metadata)) metadata = null;
			
			return $.tmpl("usergrid.ui.collections.entity.detail.html", {
				entity : entity_contents,
				name : name,
				path : this.options.path,
				collections : collections,
				metadata : metadata,
				uri : (entity.metadata || { }).uri
			}, {
				makeObjectTable : usergrid.console.ui.makeObjectTable,
				tableOpts : usergrid.console.ui.standardTableOpts,
				metadataTableOpts : usergrid.console.ui.metadataTableOpts
			});

		},
			
		destroy: function() {			
			this.element.html("");
			this.options.entity = null;
			this.options.details.header = null;
			this.options.json = null;
			this.options.formDiv = null;
		}
		
	};
	usergrid.console.ui.collections.entity_detail = entity_detail;

	(function($) {
		// This code block *WILL NOT* load before the document is complete

		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.header.html");
		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.contents.html");
		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.metadata.html");
		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.collections.html");
		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.json.html");
		usergrid.console.ui.loadTemplate("usergrid.ui.collections.entity.detail.html");

		$.widget("ui.usergrid_collections_entity_list_item", entity_list_item);
		$.widget("ui.usergrid_collections_entity_detail", entity_detail);

	})(jQuery);
	
})();
