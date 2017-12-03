function set_uid(uid){ localStorage["tracking_uid"] = uid; }
function reset_uid(){ localStorage.removeItem("tracking_uid"); }
function get_uid_string(){ return localStorage["tracking_uid"]; }
function has_uid(){	return !(get_uid_string() == null); }
function generate_uid(){ return Math.round(Math.random()) + '_' + Math.random().toString(36).substring(6); }
function get_uid(){
	if(!has_uid()) set_uid(generate_uid());
	return get_uid_string();
}

//Returns 0 or 1 for page version for the current user based on uid
function get_page_version(){
	var version = Number(get_uid().charAt(0));
	if(version != 0 && version != 1){
		console.log("UID IS MESSED UP; defaulting to version 0");
		return 0;
	}
	return version;
}


function send_event(event){
	if("ga" in window){
		var tracker = ga.getAll()[0];
		//tracker.send('event', event category, event data);

		tracker.send('event', get_uid(), event);
		console.log("sent event:{" + get_uid() + ", " + event + "}");
	} else {
		console.log("event tracking is not available")
	}
}



function reset_click_list(){ localStorage.removeItem("click_list"); }
function set_click_list_string(click_list_string){ localStorage["click_list"] = click_list_string; }
function set_click_list(click_list){ set_click_list_string(JSON.stringify(click_list)); }
function get_click_list_string(){ return localStorage["click_list"]; }
function get_click_list(){
	var cl_string = get_click_list_string();
	if(cl_string == null){
		set_click_list({});
		return get_click_list();
	}
	return JSON.parse(cl_string);
}

// Check if a variable is an integer
function is_integer(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}


// Record to the click list that there was a click at location
function record_click(location){
	var click_list = get_click_list();
	if( !is_integer(click_list[location]) ){
		click_list[location] = 1;
	} else {
		++click_list[location];
	}
	set_click_list(click_list);
	return click_list[location];
}








function reset(){
	reset_uid();
	reset_click_list();
	reset_ls_patients();
}

