require.config({
    baseUrl: 'js/',
    paths: {
        jquery: 'lib/jquery/jquery-1.10.2',
        underscore: 'lib/underscore/underscore',
        backbone: 'lib/backbone/backbone',
        bootstrap: 'lib/bootstrap/bootstrap',
        chartjs: 'lib/chartjs/Chart',
        //fullpage: 'js/lib/fullPage/jquery.fullPage',
       // slimscroll: 'js/lib/slimscroll/jquery.slimscroll',
        //metisMenu: 'js/lib/metisMenu/metisMenu',
        //footable: 'js/lib/footable/footable',
       // slick: 'js/lib/slick/slick',
       // plupload: 'js/lib/plupload/plupload.full.min',
        collections: 'collections',
        views: 'views'
       // utils: 'js/utils'
    },
    shim: {
      "backbone": {
        deps: ["underscore"],
        exports: "Backbone"
      },
      "underscore": {
        exports: "_"
      },
      "bootstrap": {
        deps: ['jquery'],
        exports: '$'
      },
      "fullpage": {
        deps: ['jquery'],
        exports: '$'
      },
      "slimscroll": {
        deps: ['jquery'],
        exports: '$.fn.slimscroll'
      },
      "metisMenu": {
        deps: ['jquery'],
        exports: '$'
      },
      "footable": {
        deps: ['jquery'],
        exports: '$'
      },
      "slick": {
        deps: ['jquery'],
        exports: '$'
      },
      "plupload": {
        exports: 'plupload'
      }
    }
});
//libs
require([
    "js/lib/vendor"
 ],
  function () {
    var $ = require("jquery"),
        // the start module is defined on the same script tag of data-main.
        // example: <script data-main="main.js" data-start="pagemodule/main" src="vendor/require.js"/>
        startModuleName = $("script[data-main][data-start]").attr("data-start");
    //console.log(startModuleName);

    if (startModuleName) {
        require([startModuleName], function (startModule) {
          $(function(){
            if(startModule) {
              var fn = $.isFunction(startModule) ? startModule : startModule.init;
              if (fn) { fn(); }              
            }
          });
        });
    }
});