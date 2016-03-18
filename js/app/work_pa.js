define(function (require){
	var Backbone = require("backbone");
	var $ = require("jquery");
	var _ = require("underscore");
	var ModalView = require('views/modal_view');

	var PARouter = Backbone.Router.extend({

		initialize: function(options){
			this.modal = new ModalView();
			// page Config
			this.getConfig();
			if(!this.config.project) {
				window.location.href = '../../_index.html';
			}
			document.title = this.config.project_name + ' | UWA';
			this.getUserInfo();
			// Render breadcrumb
			this.breadcrumbTemplate = _.template($("#breadcrumb-template").html());
			this.$breadcrumb = $("#breadcrumb");
			this.listenTo(this, "route", this.changeBreadcrumb);
			// Render device dropdown
			var DeviceCollection = require("collections/work_pa_device");
			this.deviceCollection = new DeviceCollection({app: this});
			this.listenTo(this.deviceCollection, 'successOnFetch', this.renderDeviceDropdown);

			// Render Layout
			$('.hd_img').attr('src', this.userInfo&&this.userInfo.hd_url);
			var LayoutView = require("views/work_pa_layout");
			var view = new LayoutView();

			// common templates
			this.widgets_template = _.template($("#common-widgets-template").html());

			// load screenshot name list
			var ScreenshotView = require('views/work_pa_screenshots');
			this.screenshotView = new ScreenshotView({app: this});
			// ordinary pages
			this.route('', 'show_index');
	     	_.each(['index', 'task', 'cpu', 'gccall', 'render','physics','animation','memory','asset','cpudetail','gcdetail'], function (page) {
	        	this.route(page, "show_"+page);
	      	}, this);
	      	// vip pages
	      	this.vipRoutes = ['assetdetail','important'];
	      	//if (this.userInfo.user_level == 2){
	      	if(this.config.level == 2){
	      		_.each(this.vipRoutes, function(page){
	      			this.route(page, 'show_'+page);
	      		}, this);
	      	} else {
	      		_.each(this.vipRoutes, function(page){
	      			this.route(page, 'show_vipAlert');
	      		}, this);
	      	}
	      	// error page
	      	this.route('applog','showErrorPage');
	      	this.listenTo(this,'dataError',this.show_dataAlert); 
			//wait for loading (placeholder only)
			//$(document).ajaxStart(function(){$(".wait").css("display", "block")});
			//$(document).ajaxComplete(function(){$(".wait").css("display", "none")});
		},
		getConfig: function(){		
			this.config = {};
			//this.pageConfig['route'] = location.hash.substring(1);
			var self = this;
			var searchString = location.search.replace(/\?/,'');
		    if( !searchString){
		        return;
		    }
		    _.each(searchString.split('&'), function(value, index){
		        if(value){
		            var param = value.split('=');
		            if(param[0]!='project_name'){
		            	self.config[param[0]] = parseInt(param[1]);	
		            } else {
		            	self.config[param[0]] = decodeURIComponent(param[1]);
		            }
		            
		        }
		    });
		},
	    getUserInfo: function(){
	     if(typeof(Storage) !== "undefined") {
	      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
	     }
	    },		
	    renderDeviceDropdown: function(){
	    	this.deviceTmpl = _.template($('#device-dd-template').html());
	    	var self = this;
		    var selected_device,
		        device_list = [],
		        device_id_list = [],
		        icon_list = [];
		    _.each(this.deviceCollection.models, function(model, index){
		        device_list.push(model.get('name'));
		        device_id_list.push(model.get('id'));
		        icon_list.push('icon-'+model.get('type'));
		        if (model.get('id') == self.config.device){
		        	selected_device = model.get('name');
		        }
		    });
	        $('#device_dd').html(this.deviceTmpl({
	        	project_id: this.config.project,
	        	test_index: this.config.test_index,
	        	project_name: this.config.project_name,
	            selected: selected_device,
	            device_list: device_list,
	            device_id_list: device_id_list,
	            icon_list: icon_list
	        }));
	    },
		changeBreadcrumb: function(){
			var page = Backbone.history.getFragment();
			if(!this.checkVip(page)) {return false;}
			this.$breadcrumb.html(this.breadcrumbTemplate({route: page, project_name: this.config.project_name}));
			this.changeActiveMenu(page);
		},
		changeActiveMenu: function(route){
			$('.nav-second-level>li').removeClass('active');
			$('li.no-second-level').removeClass('active');
			$('#menu-'+route).addClass('active');
		},
		destroyView: function(view){
			if(this.currentView){
				this.currentView.remove();
				this.currentView.unbind();
				$('#page-wrapper').append('<div class="wrapper wrapper-content animated fadeInRight" id="page-content"></div>');
			}
		},
		checkVip: function(page){
			if(this.vipRoutes.indexOf(page)>=0){
				if (this.config.level==2) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		},
		show_vipAlert: function(){
			if (this.userInfo.user_level == 2){
				this.modal.show('提醒','该报告是您作为“注册会员”身份期间的版本，请您重新提交项目进行测试，以获得更为详细的测评报告。');	
			} else {
				this.modal.show('提醒','该页面仅向专业会员开放，建议您升级为<a href="/u/setting.html#accountupdate">专业会员</a>，并重新测试该项目，以获取更为详细的高级版测评报告。');	
			}
		},
		show_dataAlert: function(msg){
			this.modal.show('数据错误', msg);
		},
		show_index: function(route){
			this.destroyView();
			var DashboardCollection = require("collections/work_pa_dashboard");
			var DashboardView = require("views/work_pa_dashboard");
			var collection = new DashboardCollection({app: this});
			this.currentView = new DashboardView({collection: collection, app: this});
			collection.getData();			
		},
		show_task: function(route){
			this.destroyView();
			var TaskCollection = require("collections/work_pa_task");
			var TaskView = require("views/work_pa_task");
			var collection = new TaskCollection({app: this});
			this.currentView = new TaskView({collection: collection, app: this});
			collection.getData();
		},
 		show_cpu: function(route){
			this.destroyView();
			var CpuCollection = require("collections/work_pa_cpu");
			var CpuView = require("views/work_pa_cpu");
			var collection = new CpuCollection({app: this});
			this.currentView = new CpuView({collection: collection, app: this});
			collection.getData();
		},

		show_gccall: function(){
			this.destroyView();
			var GcCollection = require("collections/work_pa_gccall");
			var GcView = require("views/work_pa_gccall");
			var collection = new GcCollection({app: this});
			this.currentView = new GcView({collection: collection, app: this});
			collection.getData();
		},

		show_render: function(){
			this.destroyView();
			var RenderCollection = require("collections/work_pa_render");
			var RenderView = require("views/work_pa_render");
			var collection = new RenderCollection({app: this});
			this.currentView = new RenderView({collection: collection, app: this});
			collection.getData();
		},

		show_physics: function(){
			this.destroyView();
			var PhysicsCollection = require("collections/work_pa_physics");
			var PhysicsView = require("views/work_pa_physics");
			var collection = new PhysicsCollection({app: this});
			this.currentView = new PhysicsView({collection: collection, app: this});
			collection.getData();
		},

		show_animation: function(){
			this.destroyView();
			var AnimationCollection = require("collections/work_pa_animation");
			var AnimationView = require("views/work_pa_animation");
			var collection = new AnimationCollection({app: this});
			this.currentView = new AnimationView({collection: collection, app: this});
			collection.getData();
		},

		show_memory: function(){
			this.destroyView();
			var MemCollection = require("collections/work_pa_memory");
			var MemView = require("views/work_pa_memory");
			var collection = new MemCollection({app: this});
			this.currentView = new MemView({collection: collection, app: this});
			collection.getData();
		},

		show_asset: function(){
			this.destroyView();
			var AssetCollection = require("collections/work_pa_asset");
			var AssetView = require("views/work_pa_asset");
			var collection = new AssetCollection({app: this});
			this.currentView = new AssetView({collection: collection, app: this});
			collection.getData();
		},

		show_assetdetail: function(){
			if(!this.checkVip()){
				return false;
			};
			this.destroyView();
			var Collection = require("collections/work_pa_assetdetail");
			var View = require("views/work_pa_assetdetail");
			var collection = new Collection({app: this});
			this.currentView = new View({collection: collection, app: this});
			collection.getData();
		},

		show_cpudetail: function(){
			this.destroyView();
			var CpudetailCollection = require("collections/work_pa_cpudetail");
			var CpudetailView = require("views/work_pa_cpudetail");
			var collection = new CpudetailCollection({app: this});
			this.currentView = new CpudetailView({collection: collection, app: this});
			collection.getData();
		},

		show_gcdetail: function(){
			this.destroyView();
			var GcdetailCollection = require("collections/work_pa_gcdetail");
			var GcdetailView = require("views/work_pa_gcdetail");
			var collection = new GcdetailCollection({app: this});
			this.currentView = new GcdetailView({collection: collection, app: this});
			collection.getData();
		},

		show_important: function(){
			if(!this.checkVip()){
				return false;
			};
			this.destroyView();
			var Collection = require("collections/work_pa_important");
			var FuncCollection = require("collections/work_pa_importantList");
			var View = require("views/work_pa_important");

			this.currentView = new View({
				collection: new Collection({app: this}), 
				funcCollection: new FuncCollection({app: this}), 
				app: this
			});			
		},

		showErrorPage: function(){
			this.destroyView();
			$('#page-content').html($('#route-error-template').html());
		}

	});

	router = new PARouter();
	Backbone.history.start();

});