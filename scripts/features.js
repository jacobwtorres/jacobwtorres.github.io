function inject_timestamp() {
  let unix = document.getElementById("unix");
  var dateString = "";
  var newDate = new Date();

  if (unix.checked) {
    dateString = Date.now();
  } else {
    dateString = newDate.toUTCString();
  }

  if (ta.value) {
    ta.value = ta.value + "\n" + "[" + dateString + "] ";
  } else {
    ta.value = "[" + dateString + "] ";
  }

  ta.focus();
}

function mv() {
  var temp_name,
    old_name = open_file;
  let ti = document.getElementById("ti");
  let lo = document.getElementById("log");

  if (lo.value != "Logout") {
    //TODO make it so that this warning is not necessary. Just rename the file the next time they login. Possible to do in  a stable way?
    if (
      !confirm(
        "Changing the name while not logged into Dropbox may result in duplicate files under both names"
      )
    ) {
      return;
    }
  }

  temp_name = prompt("Enter new name");

  if (temp_name == null) {
    return;
  }

  while (temp_name == "") {
    temp_name = prompt("Enter new name (type something!)");

    if (temp_name == null) {
      return;
    }
  }

  temp_name = temp_name.replace(/–/g, "-");

  if (temp_name.includes("\\") || temp_name.includes("/")) {
    temp_name = prompt("Please remove slashes from name", temp_name);
  }

  temp_name = check_file_name(temp_name);

  if (temp_name == null) {
    console.log("Failed name check, aborting");
    return;
  }

  if (lo.value == "Logout") {
    save_loop("", function (re) {
      if (re == 200) {
        //TODO kick off rename with dropbox
        dbox_mv_file(
          construct_file_path(temp_name),
          construct_file_path(ti.value),
          function (ret) {
            if (ret == 200) {
              clear_file_cache(ti.value);
              ti.value = temp_name;
              open_file = temp_name;
              save_loop();
              reload_site_as(THISURL + "?open=" + open_file);
            } else {
              alert("Failed to rename remote file, continuing with old name");
            }
          }
        );
      }
    });
  } else {
    clear_file_cache(ti.value);
    ti.value = temp_name;
    open_file = temp_name;
    save_loop();
    reload_site_as(THISURL + "?open=" + open_file);
  }
}
function inject_timestamp() {
  let unix = document.getElementById("unix");
  var dateString = "";
  var newDate = new Date();

  if (unix.checked) {
    dateString = Date.now();
  } else {
    dateString = newDate.toUTCString();
  }

  if (ta.value) {
    ta.value = ta.value + "\n" + "[" + dateString + "] ";
  } else {
    ta.value = "[" + dateString + "] ";
  }

  ta.focus();
}

function mv() {
  var temp_name,
    old_name = open_file;
  let ti = document.getElementById("ti");
  let lo = document.getElementById("log");

  if (lo.value != "Logout") {
    //TODO make it so that this warning is not necessary. Just rename the file the next time they login. Possible to do in  a stable way?
    if (
      !confirm(
        "Changing the name while not logged into Dropbox may result in duplicate files under both names"
      )
    ) {
      return;
    }
  }

  temp_name = prompt("Enter new name");

  if (temp_name == null) {
    return;
  }

  while (temp_name == "") {
    temp_name = prompt("Enter new name (type something!)");

    if (temp_name == null) {
      return;
    }
  }

  temp_name = temp_name.replace(/–/g, "-");

  if (temp_name.includes("\\") || temp_name.includes("/")) {
    temp_name = prompt("Please remove slashes from name", temp_name);
  }

  temp_name = check_file_name(temp_name);

  if (temp_name == null) {
    console.log("Failed name check, aborting");
    return;
  }

  if (lo.value == "Logout") {
    save_loop("", function (re) {
      if (re == 200) {
        //TODO kick off rename with dropbox
        dbox_mv_file(
          construct_file_path(temp_name),
          construct_file_path(ti.value),
          function (ret) {
            if (ret == 200) {
              clear_file_cache(ti.value);
              ti.value = temp_name;
              open_file = temp_name;
              save_loop();
              reload_site_as(THISURL + "?open=" + open_file);
            } else {
              alert("Failed to rename remote file, continuing with old name");
            }
          }
        );
      }
    });
  } else {
    clear_file_cache(ti.value);
    ti.value = temp_name;
    open_file = temp_name;
    save_loop();
    reload_site_as(THISURL + "?open=" + open_file);
  }
}

function note_save_handler(callback) {
  let di = document.getElementById("di");
  let ti = document.getElementById("ti");
  let error_output = document.getElementById("error_op");

  // 		    if(ta.value == "")
  // 		    {
  // ta.placeholder = "Enter some text here before saving!";
  // 			  	return;
  // 		    }

  if (ti.value == "") {
    error_output.style.color = "red";
    error_output.innerHTML = "Please specify a file name";

    ti.value = prompt("Please enter a file name", "");
    if (ti.value == "") {
      return;
    }

    // $("#error_op").fadeIn();
    return;
  }

  // if( di.value != "")
  // {
  // 		  	  if(di.value.includes('\\') || di.value.includes('\/'))
  // 		  	  {
  // 		  		  error_output.style.color = 'red';
  // 		  	  	  error_output.innerHTML = "Folder path cannot contain slashes";
  // 				  // $("#error_op").fadeIn();
  // 		  	  	  return;
  // 		  	  }
  // 		  	  else
  // 		  	  {
  // 		  	  	  error_output.innerHTML = "";
  // 				  // $("#error_op").fadeOut();
  // 		  	  }
  //
  // 		  	  dbox_create_folder(NOTE_PATH + di.value);
  //
  // }

  ti.value = ti.value.replace(/–/g, "-");
  di.value = di.value.replace(/–/g, "-");

  if (ti.value.includes("\\") || ti.value.includes("/")) {
    error_output.style.color = "red";
    error_output.innerHTML = "Please remove slashes from the name";
    // $("#error_op").fadeIn();
    return;
  } else {
    error_output.innerHTML = "";
    // $("#error_op").fadeOut();
  }

  dbox_create_file(construct_file_path(), ta.value, /*overwrite*/ 1, function (
    ret
  ) {
    if (callback) {
      callback(ret);
    }

    if (ret == 200) {
      // alert("Success");
      console.log("Remote backup SUCCESS");
    } else {
      console.log("Remote backup FAIL");
      // alert("Remote backup failed");
      auth_failure_handle();
    }
  });
}
