var patients = [
		 {patient_name : 'Grandma', 'patient_meds' : '1x Aricept, 1x Exelon, 1x Razadyne', 'color_status': 'red'}
		,{patient_name : 'G-pa', 'patient_meds' : '1x Aricept, 1x Exelon', 'color_status': 'yellow'}
	];


// function format_meds(patient_array){
// 	for(var i=0; i<patient_array.length; ++i){
// 		var cur = patient_array[i];
// 		console.log('formatting for ' + cur['patient_name'])
		
// 		var med_array = cur['patient_meds'].split(',');
// 		if(med_array.length == 1) continue;
// 		var new_meds = "";
// 		for(var j=0; j<med_array.length; ++j){
// 			new_meds += '<p>' + med_array[j] + '</p>\n';
// 		} 
// 		cur['patient_array'] = new_meds;
// 	}
// }		



function refresh_patients(){
	create_patients(patients);
}


function change_status(id, color){
	patients[id]['color_status'] = color;
	create_patients(patients);
}

function change_status_delay(id, color, delay_ms){
	setTimeout(function(){ change_status(id, color); }, delay_ms);
}





function create_patients(patient_array){
// $('#part_number-modal').on('hidden.bs.modal', function (e) {
//   // do something...
// })


	// format_meds(patient_array);

	console.log('creating patients');

	

	var source = $("#patient_template").html();
	var template = Handlebars.compile(source);

	var parent_div = $("#templated_patients");

	parent_div.empty();

	for(var i=0; i<patient_array.length; ++i){
		var cur_data = patient_array[i];
		var cur_html = template(cur_data);

		parent_div.append(cur_html);

		
		// Set up handler for when reminder modal is closed
		
	}


	console.log('done creating patients');
}

function add_meds_handler(patient_id){
	console.log('button pressed from patient_id=' + patient_id);

	$("#meds_input_"+patient_id).val(patients[patient_id]['patient_meds']);
}

function add_patient_to_global(patient){
	var name = patient['patient_name'];
	var meds = patient['patient_meds'];

	var exists = false;
	console.log("updating patients with: " + name +", " + meds);
	for(var i=0; i<patients.length; ++i){
		console.log("name == patients[i]['patient_name']:" + name + "==" + patients[i]['patient_name']);
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


function add_patient(name, meds) {
	// Pull patients from localStorage
	var patients_string = localStorage["patients"];
	var patients_array = [];
	if(patients_string != null){
		patients_array = JSON.parse(patients_string);
		if(patients_array == null) patients_array = [];
	}

	// var name = document.getElementById('name').value;
	// var meds = document.getElementById('meds').value;

	var exists = false;
	for(var i=0; i<patients_array.length; ++i){
		if(name == patients_array[i]['patient_name']){
			patients_array[i]['patient_meds'] = meds;
			exists = true;
		}
	}
	if(!exists){
		var new_patient = {'patient_name' : name, 'patient_meds' : meds, 'color_status': 'green'};
		patients_array.push(new_patient);
	}

	localStorage.setItem("patients", JSON.stringify(patients_array)); 
}


function save_meds(patient_id){
	
	var new_meds = $("#meds_input_"+patient_id).val();
	// console.log("saving meds for id=" + patient_id+"\nneed to also write to localstorage");
	patients[patient_id]['patient_meds'] = new_meds;

	// $("#patient_meds_" + patient_id).val(new_meds);
	document.getElementById("patient_meds_"+patient_id).innerText = new_meds;
	console.log("TODO: update localstorage");

	add_patient(patients[patient_id]["patient_name"], new_meds);


}

function modify_patients_from_localstorage(){
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





$(document).ready(function(){

	modify_patients_from_localstorage();
	// color status can be green, yellow or red
	

	// generate patient ids
	for(var i=0; i<patients.length; ++i) patients[i]['patient_id'] = i; 
	



	create_patients( patients );
	


	// if (localStorage.getItem("isAdded") == "true") {
	// 		console.log("isAdded still here");
	// 		$("#medList").append("1x NEW MED<br>");
	// 	}

	// $("#add").click(function(){
	// 	localStorage.setItem("isAdded", "true");
	// });

});
