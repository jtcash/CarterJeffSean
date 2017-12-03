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
 

