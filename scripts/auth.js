/**
 *  These functions are for handling the authentication flow
 */

function login() {
  let li = document.getElementById("lia");
  let un = document.getElementById("un");
  let pu = document.getElementById("push");
  let lo = document.getElementById("log");

  li.style.display = "inline";
  li.style.visibility = "visible";

  un.style.display = "inline";
  un.style.visibility = "visible";

  pu.style.display = "inline";
  pu.style.visibility = "visible";
  lo.value = "Logout";

  cache = localStorage.getItem(open_file);
  cache_time = localStorage.getItem(open_file + ".ts");

  dbox_cat_file(construct_file_path(), function (contents) {
    if (contents == null) {
      ta.value = cache;
    } else {
      ta.value = contents;
    }
  });

  //TODO why can't I create a dir...?
  // dbox_create_folder(NOTE_PATH);

  //TODO check if this file is open anywhere else...put a lock on it somehow each time we open. But we must have logged in alread

  //TODO check where folder exists, compare timestamps, and load most relevant version
  //we will only reach this point for ?open param

  //LOAD FILE TO TEXT AREA
  //TODO if only exists in cache, load cache
  //if exists in both remote/local, load whichever has more recent timestamp
  //if only exists in the remote, load remote
  //if exists in neither, check if it exists in external dbox directory
  //if only exists in extern dbox, load it and mark the caches with metadata indicating when we branched from mainline (so that we can alert to overwriting saves)
  //if nothing found, just create it as a new file in remote cache and alert to any name conflicts upon saving
}

function logout() {
  let lo = document.getElementById("log");
  let pu = document.getElementById("push");

  dbox_revoke_key(function (ret) {
    if (ret == 200) {
      alert("Dropbox keys successfully revoked");
    }

    reload_site_as(THISURL);
  });

  localStorage.removeItem("dbox_token");
  dbox_key_value = "";
  pu.style.display = "none";
  lo.value = "Login to Dropbox";
}
