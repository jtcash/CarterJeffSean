var patients_default = [
		 {patient_name : 'Grandma', patient_meds : '1x Aricept, 1x Exelon, 1x Razadyne', color_status: 'red'}
		,{patient_name : 'G-pa', patient_meds : '1x Aricept, 1x Exelon', color_status: 'yellow'}
	];

var patients = patients_default.slice();














////////////////////////






// Getters and setters for user_email
function get_user_email(){ return localStorage['logged_in_as']; }
function set_user_email(new_email){	localStorage['logged_in_as'] = (new_email == null ? "" : new_email); }
function clear_user_email(){ set_user_email(""); }
// Return boolean value of whether or not the user is already logged in
function is_logged_in(){
	var t = get_user_email();
	return !(t == null || t == "");
}



function make_user(email, password, patients){
	if(typeof patients === 'undefined') patients = [];
	return {email:email, password:password, patients:patients}
}

function reset_user_array(){
	console.log("resetting user array");
	localStorage['users'] = '{}';
}

//Getter to retrieve the users array from localstorage as an array
function get_user_array(){
	var user_array_string = localStorage['users'];
	if(user_array_string == null){
		reset_user_array();
		return [];
	}
	var user_array = [];
	try{
		user_array = JSON.parse(user_array_string);
	} catch(err){
		reset_user_array();
		return [];
	}
	return user_array;
}
//Setter to put a user array into localstorage
function set_user_array(user_array){
	if(user_array == null){
		console.log("trying to set users to null. Why do that???");
		return false;
	}

	try{
		var users_string = JSON.stringify(user_array);
	}catch(err){
		console.log("failed to stringify user_array");
		return false;
	}

	localStorage['users'] = users_string;
	return true; 
}

// Boolean to check if a user exists by email
function user_exists(email){
	var user_array = get_user_array();
	if(user_array.length > 0){
		for(var i=0; i<user_array.length; ++i){
			if(user_array[i].email == email) return true;
		}
	}
	return false;
}

function get_user(email){
	var users = get_user_array();
	for(var i=0; i<users.length; ++i){
		if(users[i].email == email)
			return users[i];
	}
	return null;
}

function password_is_valid(user, password){
	return user.password == password;
}


// Add a user to localstorage, patients array optional
function add_user(email, password, patients){
	if(user_exists(email)){
		alert("User already exists");
		return false;
	}

	var new_user = make_user(email, password, patients);

	var user_array = get_user_array();

	user_array.push(new_user);

	set_user_array(user_array);

	console.log("users:{" + localStorage['users'] + '}');


	return true;
}


function log_in_as(email){
	set_user_email(email);
	window.location = "index.html";
	return true;
}

function attempt_login(){
	var email = document.getElementById('login_email').value;
	var password = document.getElementById('login_password').value;

	console.log('attempting login with email:{' + email + '}, password:{' + password + '} lol so secure');


	// Handle default login case
	if((email.length == 0 || email == null) && (password.length == 0 || password==null)){
		return log_in_as("default");
	}	

	// Handle actual login cases
	if(!user_exists(email)){
		alert('email is invalid');
		return false;
	}

	var user = get_user(email);

	//ensure password is correct
	if(!password_is_valid(user, password)){
		alert('incorrect password');
		return false;
	}



	return log_in_as(email);
}

function log_out(){
	clear_user_email(); 
	window.location = "ct_login.html";
}





// Initialize default user stuff if first time running
function initialize_shit(){
	if(!user_exists('default')){
		add_user('default', '', patients_default);
	}
}

// Remove a user from ls by email
function remove_user(email){
	var user_array = get_user_array();
	for(var i=0; i<user_array.length; ++i){
		if(user_array[i].email == email){
			user_array.splice(i,1);
			set_user_array(user_array);
			if(is_logged_in() && get_user_email() == email){
				log_out();
			}
			return true;
		}
	}
	return false;
}


function get_ls_patients(){
	if(!is_logged_in()) return [];

	var user = get_user(get_user_email());
	var patients = user.patients;
	if(patients == null) return [];

	for(var i=0; i<patients.length; ++i){
		patients[i].patient_id = i;
	}

	return patients;
}
function set_ls_patients(patients){
	if(!is_logged_in()) return false;
	var email = get_user_email();
	var user_array = get_user_array();
	for(var i=0; i<user_array.length; ++i){
		if(user_array[i].email == email){
			user_array[i].patients = patients;
			set_user_array(user_array);
			return true;
		}
	}
	return false;
}




/////////////////


function call_patient(patient_name){
	alert("calling " + patient_name);
}












// Change the status of a patient (change indicator color)
function change_status(id, color){
	// Ensure a valid color is chosen
	switch(color){
		case 'red':
		case 'yellow':
		case 'green':
			break;
		default:
			console.log("invalid status color chosen; defaulting to yellow");
			color = 'yellow';
	}
	patients[id]['color_status'] = color;
	document.getElementById("status_image_" + id).src = "img/dot_big_" + color + ".png";


}
// Change the status of a patient after some delay
function change_status_delay(id, color, delay_ms){
	setTimeout(function(){ change_status(id, color); }, delay_ms);
}




// Create the patient fields on index.html from an array of patients
function create_patients(patient_array){
	// console.log('creating patients');
	var source = $("#patient_template").html();
	var template = Handlebars.compile(source);

	var parent_div = $("#templated_patients");

	// Clear the div in case there's junk in it for some reason
	parent_div.empty();
	for(var i=0; i<patient_array.length; ++i) parent_div.append(template(patient_array[i]));

	// for(var i=0; i<patient_array.length; ++i){
	// 	 var cur_data = patient_array[i]; 
	// 	 var cur_html = template(cur_data); 
	// 	 parent_div.append(cur_html);			
	// }
	// console.log('done creating patients');
}

// Handler for when add medications is pressed
function add_meds_handler(patient_id){
	console.log('button pressed from patient_id=' + patient_id);
	var patients = get_ls_patients();
	$("#meds_input_"+patient_id).val(patients[patient_id]['patient_meds']);
}




function add_patient(name, meds) {
	// Pull patients from localStorage
	// var patients_string = localStorage["patients"];
	// var patients_array = [];
	// if(patients_string != null){
	// 	patients_array = JSON.parse(patients_string);
	// 	if(patients_array == null) patients_array = [];
	// }

	// // var name = document.getElementById('name').value;
	// // var meds = document.getElementById('meds').value;

	// var exists = false;
	// for(var i=0; i<patients_array.length; ++i){
	// 	if(name == patients_array[i]['patient_name']){
	// 		patients_array[i]['patient_meds'] = meds;
	// 		exists = true;
	// 	}
	// }
	// if(!exists){
	// 	var new_patient = {'patient_name' : name, 'patient_meds' : meds, 'color_status': 'green'};
	// 	patients_array.push(new_patient);
	// }
	var patients_array = get_ls_patients();
	for(var i=0; i<patients_array.length; ++i){
		if(name == patients_array[i].patient_name){
			alert("duplicate patient");
			return false;
		}
	}
	var new_patient = {patient_name: name, patient_meds: meds, color_status: 'green'};
	patients_array.push(new_patient);


	set_ls_patients(patients_array);
	return true;

	// localStorage.setItem("patients", JSON.stringify(patients_array)); 
}


function save_meds(patient_id){
	
	var new_meds = $("#meds_input_"+patient_id).val();
	// console.log("saving meds for id=" + patient_id+"\nneed to also write to localstorage");

	var patient_array = get_ls_patients();


	patient_array[patient_id].patient_meds = new_meds;
	document.getElementById('patient_meds_' + patient_id).innerText = new_meds;
	// $("#patient_meds_"+patient_id).val(new_meds);

	set_ls_patients(patient_array);

	// patients[patient_id]['patient_meds'] = new_meds;

	// // $("#patient_meds_" + patient_id).val(new_meds);
	// document.getElementById("patient_meds_"+patient_id).innerText = new_meds;
	// console.log("TODO: update localstorage");

	// add_patient(patients[patient_id]["patient_name"], new_meds);


}



function add_patient_to_global(patient){
	var name = patient['patient_name'];
	var meds = patient['patient_meds'];

	var exists = false;
	console.log("updating patients with: " + name +", " + meds);
	for(var i=0; i<patients.length; ++i){
		// console.log("name == patients[i]['patient_name']:" + name + "==" + patients[i]['patient_name']);
		if(name == patients[i]['patient_name']){
			console.log("WTF")
			patients[i]['patient_meds'] = meds;
			exists = true;
		}
	}
	if(!exists){
		//var new_patient = {'patient_name' : name, 'patient_meds' : meds, 'color_status': 'green'};
		patients.push(patient);
	}
}
function modify_patients_from_localstorage(){
	console.log("WTF DID THIS DO");
	var patients_string = localStorage["patients"];
	console.log("WTF: " + patients_string);
	var patients_array = [];
	if( patients_string != null && patients_string != undefined ){
		patients_array = JSON.parse(patients_string);
		if(patients_array == null) patients_array = [];
	}

	console.log("patients_array.length=" + patients_array.length)
	for(var i=0; i<patients_array.length; ++i){
		add_patient_to_global(patients_array[i]);
	}
}



