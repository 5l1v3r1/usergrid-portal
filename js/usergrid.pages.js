/**
 * User: David S
 * Date: 31/01/12
 * Time: 02:23 PM
 */

var Pages = function(){
	var self = {
		pages: {},
		panels: {}
	}
	var client = new usergrid.Client();

	self.ShowPage = function(pageName){
		$("#pages > div").hide();
		var page = self.pages[pageName];
		page.box.show();
		$(".navbar li.active").removeClass('active');
		$(".navbar .navbar-inner").hide();
        if(page.link.parent().parent().hasClass("dropdown-menu"))
            page.link.parent().parent().parent().addClass('active');
        else
    		page.link.parent().addClass('active');
        page.menu.show();
		if(page.showFunction)
			page.showFunction();
		return;
	}

	self.AddPage = function(page)	{
		if(!page.link)
            page.link = $("#" + page.name + '-link');

		if(!page.box)
			page.box = $("#" + page.name + '-page');

		page.link.click(function(e) {
			e.preventDefault();
			self.ShowPage(page.name);
		});

		LoadPage(page);
		self.pages[page.name] = page;
	}

	self.AddPanel = function(panelName, linkSelector,boxSelector,initFunction,showFunction)	{
		if(!linkSelector)
			linkSelector = "#sidebar-menu a[href='#" + panelName + "']";

		if(!boxSelector)
			boxSelector = "#" + panelName + '-panel';

		var panel = {
			name: panelName,
			link: $(linkSelector),
			box:$(boxSelector),
			initFunction:initFunction,
			showFunction:showFunction
		}

		panel.link.click(function(e) {
			e.preventDefault();
			self.SelectPanel(panel.name);
		});

		self.panels[panel.name] = panel;
	}

	self.SelectPanel = function (panelName){
		var panel = self.panels[panelName];

		$("#sidebar-menu li.active").removeClass('active');
		panel.link.parent().addClass('active');

		if(panel.showFunction){
			panel.showFunction();
		}
		
		$("#console-panels > div").hide();
		panel.box.show();

	}

	function LoadPage(page){

		if(page.name=='forgot-password')
			$("#forgot-password-page iframe").attr("src", client.resetPasswordUrl);
        else if(page.name=='console-frame')
      		$("#console-frame-page iframe").attr("src", "consoleFrame.html");
		else{
			if(window.location.pathname.indexOf('app') > 0){
				$.ajaxSetup ({cache: false});
				page.box.load(page.name + '.html',page.initFunction);
				$.ajaxSetup ({cache: true});
			}
			else if(page.initFunction)
				page.initFunction();
		}

		return;
	}

	return self;
}();


