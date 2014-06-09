var lang = localStorage.getItem("lang") || ( localStorage.setItem("lang",'en') || 'en' );

require.config({
  paths: {
    jquery: [
      'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
      'vendor/jquery/dist/jquery.min',
    ],
    "jquery-tmpl" : 'vendor/jquery-tmpl/jquery.tmpl.min',
    "hammer" : 'vendor/hammerjs/hammer.min'

  },
  shim: {
        'jquery-tmpl': {
            deps: ['jquery']
        }
    }
});

require({ locale: lang }, ['layout','game'], function(Layout, Game){
  Layout.initStartLayout();
});