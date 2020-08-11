/**
 * Global Variable Declarations & initializations
 * The followinf data are available to all JS
 */

var THISURL = location.protocol + "//" + location.host + location.pathname; //'https://jacobwtorres.github.io/'
console.log(location.protocol + "//" + location.host + location.pathname);

var dbox_key_value = "";
var dbox_account_id = "";
var CLIENT_ID = "p4p60gowtlk2vl9";
// var CALLBACK_URL = 'https://'+chrome.runtime.id+'.chromiumapp.org';
var AUTH_URL =
  "https://www.dropbox.com/oauth2/authorize?client_id=" +
  CLIENT_ID +
  "&response_type=token" +
  "&redirect_uri=" +
  THISURL;

var BMARK_PATH = "/Bookmarks/";
var NOTE_PATH = "/Notes/";
var INTERNAL_PATH = "/.internal/";

var current_note_path = "";
var already_saved = 0;
var full_path_to_write = "";

var timer;
var keypress_timer;
var keypress_timeout = 10000;

var hard_coded_login = false;
var h_dbox_key_value =
  "4neAoDtRLnAAAAAAAAAs0t_ARx40cVXefKgo3B95N6H2W135ZySpOHvPJMlxNPN_";
var h_dbox_account_id = "dbid:AACn7NYElGhKNkMI307nK1JxmySEsKj4y3U";

var open_file = "";
var file_list = [];

var user_warned = false;

// document.onload = function()
function init() {
  file_list_reload();

  // add_to_list('1')
  // console.log("Full list loaded=" + file_list)
  // add_to_list('2')
  // console.log("Full list loaded=" + file_list)
  // add_to_list('3')
  // console.log("Full list loaded=" + file_list)
  //
  // remove_from_list('3')
  // console.log("Full list loaded=" + file_list)
  // remove_from_list('1')
  // console.log("Full list loaded=" + file_list)
  // remove_from_list('2')
  // console.log("Full list loaded=" + file_list)
  // return

  let di = document.getElementById("di");
  let ti = document.getElementById("ti");
  let lo = document.getElementById("log");

  let ch = document.getElementById("ch");

  var queryString = new URL(window.location.href.replace(/#/g, "?"));
  console.log("queryString= " + queryString);

  if (queryString != "") {
    console.log("Checking for token");
    // window.location.href = AUTH_URL;
    access_token = queryString.searchParams.get("access_token");
    console.log("Found New token: " + access_token);

    account_id = queryString.searchParams.get("account_id");
    console.log("Found New Account ID: " + account_id);

    open_file = queryString.searchParams.get("open");
    console.log("Found Open file: " + open_file);

    //THIS SECTION IS ONLY HIT DURING ACTIVE LOGIN, NOT FOR LOGGED IN STATUS
    if (access_token != null && account_id != null) {
      dbox_key_value = access_token;
      dbox_account_id = account_id;

      localStorage.setItem("dbox_token", dbox_key_value);
      localStorage.setItem("dbox_account_id", dbox_account_id);

      dbox_key_check(function (ret) {
        if (ret == 200) {
          console.log("Key worked");
          reload_site_as(THISURL);
        } else {
          console.log("Key NOT working");
          alert(
            "We're sorry, but that Login to Dropbox failed. The token returned to us did not check out. To be safe we are logging you out of all accounts."
          );
          localStorage.removeItem("dbox_token");
          localStorage.removeItem("dbox_account_id");
          reload_site_as(THISURL);
        }
      });

      return;
    } else if (open_file != null) {
      nn = check_file_name(open_file);
      if (nn == null) {
        open_file = null;
        reload_site_as(THISURL);
      }

      ti.value = nn;
      open_file = nn;
      remove_from_list(open_file);
      console.log("HERE!!!!!!!!!:" + file_list);
    } else {
      if (does_list_exist()) {
        open_all_tabs(true);
      } else {
        get_rand_word(function (word) {
          reload_site_as(THISURL + "?open=" + word + "_" + makeid(3));
        });
        return;
      }
    }
  }

  console.log("Token=");
  console.log(localStorage.getItem("dbox_token"));

  // let hard_coded_login = true;
  // let h_dbox_key_value = '';
  // let h_dbox_account_id = '';

  //load in dbx credentials
  if (
    (localStorage.getItem("dbox_token") == "" ||
      localStorage.getItem("dbox_token") == null) &&
    !hard_coded_login
  ) {
    console.log("Key NOT found in storage");
    load_wo_login();
  } else {
    let lo = document.getElementById("log");
    let pu = document.getElementById("push");

    if (hard_coded_login == true) {
      console.log("Key FOUND hard coded");
      dbox_key_value = h_dbox_key_value;
      dbox_account_id = h_dbox_account_id;
    } else {
      console.log("Key FOUND in storage");
      dbox_key_value = localStorage.getItem("dbox_token");
      dbox_account_id = localStorage.getItem("dbox_account_id");
    }

    dbox_key_check(function (ret) {
      if (ret == 200) {
        console.log("Key WORKING");
        login();
      } else {
        console.log("Key NOT working");
        load_wo_login();
      }
    });
  }
}

//TODO this currently warns the user that their data is about to be deleted, then STILL deletes it after they opt to preserve
window.onbeforeunload = function (e) {
  let lo = document.getElementById("log");

  save_loop("kill");

  if (open_file != "" && open_file != null) {
    //this should never occur for user, but in test cases we hit it
    if (ta.value != "" && ta.value != null) {
      //normal case of accidentally opening and immediately closing new tab
      let ch = document.getElementById("ch");

      ret = add_to_list(open_file);

      //TODO don't just checked that they are logged in, but that the file has actually saved as well
      if (ch.checked == false /*&& lo.value != "Logout"*/ || ret == -1) {
        user_warned = true;
        return "HERE";
      }
    } else {
      console.log("Clearing...");
      clear_file_cache(open_file);
    }
  }

  return;
};

//This function determines what happened in onbeforeunload, ensuring user was warned before removing file from local cache
window.onunload = function (e) {
  let lo = document.getElementById("log");

  if (open_file != "" && open_file != null) {
    //this should never occur for user, but in test cases we hit it
    if (ta.value != "" && ta.value != null) {
      //normal case of accidentally opening and immediately closing new tab
      let ch = document.getElementById("ch");

      if (ch.checked == false && lo.value != "Logout") {
        if (user_warned) {
          clear_from_cache(open_file);
        }
      }
    }
  }
  return;
};




function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function clear_file_cache(file) {
  remove_from_list(file);
  localStorage.removeItem(file);
  localStorage.removeItem(file + ".ts");
}

function file_list_reload() {
  if (localStorage.getItem("file_list") != null) {
    file_list = JSON.parse(localStorage.getItem("file_list"));
    console.log("Full list loaded=" + file_list);
  }
}

function add_to_list(file) {
  file_list_reload();

  if (file_list.indexOf(file) == -1) {
    file_list.push(file);
    localStorage.setItem("file_list", JSON.stringify(file_list));
    console.log("Added:" + file_list);
  }

  return file_list.indexOf(file);
}

function remove_from_list(file) {
  file_list_reload();
  index = file_list.indexOf(file);

  if (index != -1) {
    console.log(file + "is at index " + index);
    file_list.splice(index, 1);
    localStorage.setItem("file_list", JSON.stringify(file_list));
  }
}

function open_all_tabs(use_current_tab) {
  for (index = 0; index < file_list.length; index++) {
    if (index == file_list.length - 1 && use_current_tab == true) {
      reload_site_as(THISURL + "?open=" + file_list[index]);
      console.log("reload as: " + THISURL + "?open=" + file_list[index]);
    } else {
      open_new_site_as(THISURL + "?open=" + file_list[index]);
      console.log("new tab as: " + THISURL + "?open=" + file_list[index]);
    }
  }
}

function does_list_exist() {
  console.log(file_list, file_list.length);
  if (file_list == null || file_list.length == 0 || file_list.length == null) {
    return false;
  } else {
    return true;
  }
}

//TODO harden this with small array as backup
function get_rand_word(callback) {
  fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then((response) => response.json())
    .then((data) => callback(data[0]));
}

function open_new_file() {
  get_rand_word(function (word) {
    open_new_site_as(THISURL + "?open=" + word + "_" + makeid(3));
  });
}

function save_looop() {
  console.log("keypress save");
  save_loop();
}
function keypress_timer_kick() {
  console.log("kick");
  clearTimeout(keypress_timer);
  keypress_timer = setTimeout(save_looop, keypress_timeout /*ms*/);
}

function save_loop(cmd, callback) {
  let di = document.getElementById("di");
  let ti = document.getElementById("ti");
  let lo = document.getElementById("log");
  var timeout = 60000;

  user_warned = false; //just resetting this because we get no other event if the user cancels closing tab

  if (ta.value == "") {
    console.log("Skip cache. Empty");

    if (callback) {
      callback(200);
    }
    return;
  }

  console.log("Cache now!!!");

  localStorage.setItem(open_file, ta.value);
  localStorage.setItem(open_file + ".ts", Date.now());

  if (lo.value == "Logout") {
    //TODO backup to remote. WARNING callback triggered here will not fire during close event most likely. Test it.

    //check remote timestamp
    //if timestamp does not exist

    //check for file locks as well in case another browser opened and opted to lock this one. Prompt user quickly and say editing here is now disabled.
    note_save_handler(function (ret) {
      if (callback) {
        callback(ret);
      }
    });
  }

  clearTimeout(timer);

  //because this loop reset user_warned var, it cannot rerun by accident during the close process a second time. We already run it once.
  //Timer will automatically restart on next text change
  if (cmd != "kill") {
    timer = setTimeout(save_loop, timeout);
  }
}

//TODO this triggers closing handlers, ensure that we are never using this in a conflicting way
function reload_site_as(site) {
  window.location.href = site;
}

function open_new_site_as(url) {
  var win = window.open(url, "_blank");

  if (win == null) {
    show_oa(); //TODO this does not work because it is only hit when we are about to reload the tab. We need to send this as arg to new tab :/
    alert(
      "We noticed popups are disabled. Please enable them to open all available files."
    );
    win = window.open(url, "_blank");
    if (win != null) {
      win.focus();
    }
  } else {
    win.focus();
  }
}

function show_oa() {
  let oa = document.getElementById("oa");
  oa.style.display = "inline";
  oa.style.visibility = "visible";
}

function hide_oa() {
  let oa = document.getElementById("oa");
  oa.style.display = "none";
  oa.style.visibility = "hidden";
}

function open_all_cached_files() {
  open_all_tabs(false);
  hide_oa();
}

//TODO try to reauth without disturbing user
function auth_failure_handle() {}

function erase() {
  if (confirm("Press OK to confirm you would like to Erase this file.")) {
    clear_file_cache(open_file);
    window.localStorage.removeItem("ta.value");
    window.localStorage.removeItem("ti.value");
    window.localStorage.removeItem("di.value");

    ta.value = "";
    ti.value = "";

    window.localStorage.removeItem("file_list");
    reload_site_as(THISURL);
  }
}

//TODO do a full ASCII character check here. This can open us up to attacks.
function check_file_name(file) {
  if (file == "") {
    alert("File name absent");
    return null;
  }

  file = file.replace(/–/g, "-");

  if (file.includes("\\") || file.includes("/")) {
    alert("Please remove slashes from the name");
    return null;
  }

  return file;
}

function dbox_revoke_key(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.dropboxapi.com/2/auth/token/revoke", true);
  xhr.setRequestHeader("Authorization", "Bearer " + dbox_key_value);

  xhr.onreadystatechange = function () {
    console.log("Revoke" + xhr.status);
    if (xhr.readyState == 4) {
      callback(xhr.status);
    }
  };

  xhr.send();
}

function load_wo_login() {
  let pu = document.getElementById("push");
  pu.style.visibility = "hidden";
  pu.style.display = "none";

  let lo = document.getElementById("log");
  lo.value = "Login to Dropbox";

  if (localStorage.getItem(open_file) != null) {
    console.log("Found local cache of " + open_file);
    ta.value = localStorage.getItem(open_file);
  }
}

function construct_file_path(file) {
  if (file) {
    return NOTE_PATH + file + ".txt";
  } else {
    return NOTE_PATH + ti.value + ".txt";
  }

  // if(di.value == "")
  // 		    {
  // full_path_to_write = NOTE_PATH+ti.value+".txt";
  // }
  // else
  // {
  // 	full_path_to_write = NOTE_PATH+di.value+'\/'+ti.value+".txt";
  // }
}

function log() {
  let lo = document.getElementById("log");
  console.log(lo.value);

  save_loop();

  if (lo.value == "Login to Dropbox") {
    reload_site_as(AUTH_URL);
  } else {
    logout();
  }
}

