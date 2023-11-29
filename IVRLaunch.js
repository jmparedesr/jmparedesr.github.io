var IVRLaunch = {
		host: "api.five9.com",
		version: "ivr",
		domain: "Grupo ITS e.164"
		campaign: "Demos  -  In",
		layout: null,
		messageError: "<div style='height: 49px; display: table-cell; vertical-align: middle; font-weight: bold; font-size: 30px;'>Please contact your Web Administrator ..</div>"
};

IVRLaunch.debug = function() {
    if (typeof window.console != 'undefined') {
        window.console.log(arguments);
    }
};


IVRLaunch.checkAvailability = function() {
	/**
	 * Check if the Visual IVR is available
	 */
	var url = "https://" + IVRLaunch.host + "/" + IVRLaunch.version + "/1/domains/" + IVRLaunch.domain + "/campaigns/?name=" + IVRLaunch.campaign;

	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		crossDomain: true,
		success: function(data, textStatus, jqXHR) {
			var jsonMessage = data;
			
			IVRLaunch.debug(jsonMessage);
			
			if (jsonMessage.error == null && jsonMessage.count > 0) {
				var items = jsonMessage.items;
				if (items[0].is_visual_ivr_enabled) {
					IVRLaunch.onAvailable(items[0].selfURL);
				} else {
					IVRLaunch.onUnAvailable();			
				}
			} else {
				IVRLaunch.onUnAvailable();			
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			IVRLaunch.onUnAvailable();
		}
	});	
//	$.get(url, function(data) {
//		var jsonMessage = JSON.parse(data);
//		
//		IVRLaunch.debug(jsonMessage);
//		
//		if (jsonMessage.error == null && jsonMessage.count > 0) {
//			var items = jsonMessage.items;
//			if (items[0].is_visual_ivr_enabled) {
//				IVRLaunch.onAvailable(items[0].selfURL);
//			} else {
//				IVRLaunch.onUnAvailable();			
//			}
//		} else {
//			IVRLaunch.onUnAvailable();			
//		}
//	})
//	.fail(function(jqXHR, textStatus, errorThrown) {
//		IVRLaunch.onUnAvailable();
//	});	
};


IVRLaunch.onAvailable = function(url) {
	/**
	 * Add the container to the body
	 */
	$("body").append(IVRLaunch.layout);
	$("body").find("#blockAccess").height($("body").height());
	
	$("#vivrContainer").hide(); 

	/**
	 * Attach the close event 
	 */
	$("#buttonVIVRCloseVIVR").on("click", function() { IVRLaunch.close(); });
	$("#vivrContainer").ready(function() { $("#vivrContainer").show(); });
	
	
	/**
	 * Center the window in the browser frame
	 */
    var x = ($(window).width() - $(".vivrConsole").width()) / 2;
    var y = ($(window).height() - $(".vivrConsole").height()) / 2;        
    
    $(".vivrConsole").css("top", y);
    $(".vivrConsole").css("left", x);
	
	/**
	 * Add VIVR to page
	 */
	// $("#vivrContainer").attr("data", url + "/new_ivr_session");
	
	$("#objectContainer").append("<object id=\"vivrContainer\" type=\"text/html\" width=\"100%\" height=\"100%\" data=\"" + (url + "/new_ivr_session") + "\"></object>");

};


IVRLaunch.onUnAvailable = function() {
	/**
	 * The Visual IVR is not accessible, present the contact phone
	 */
	$("#checkVIVR").parent().empty().append(IVRLaunch.messageError);
};


IVRLaunch.close = function() {
	/**
	 * Remove the entire container from the body
	 */
	$("body").find("#blockAccess").remove();
};


IVRLaunch.init = function() {
	$.support.cors = true;
	
	$("#checkVIVR").on("click", function() { IVRLaunch.checkAvailability(); });
	
	/**
	 * Load the Visual IVR container
	 */
    $.get("/<Path_To_File>/vivrContainer.html" + "?seconds=" + (new Date()).getMilliseconds(), function(data) {
    	IVRLaunch.layout = data;
	});	
};


$(document).ready(function() {
	IVRLaunch.init();
});

