window.fbAsyncInit = function() {
    FB.init({
	appId      : '304117199665452', // App ID
	channelUrl : 'http://fbeuchre.herokuapp.com/public/channel.html', // Channel File
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true  // parse XFBML
    });

    FB.api('/me/picture', function(response) { 
        topHUD = response;
    });

    // Additional initialization code here
};

  // Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));