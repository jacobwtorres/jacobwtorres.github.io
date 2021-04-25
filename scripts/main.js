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

let ta = document.getElementById('ta');
let ta2 = document.getElementById('ta2');

let kr = document.getElementById('kright');
let kl = document.getElementById('rleft');

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

var savedLabel = document.getElementById("saved");
var cachedLabel = document.getElementById("cached");

var file_contents_at_pull = "";

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

var sessionid = makeid(32);
var remote_mode = 0;
var pagelocked = false;

 //add ability to share file with other user in realtime. Is this possible w/o dropbox?
 
 //every files cache needs metadata about whether we have already prompted the uer
 //dbox timestamp of last change when we opened it
 //already prompted to reopen with no?
 //encrypted?
 
 //different page args.
 //if arg==open with valid file name (is allowed to be path to cached file with no regular path!!!)
     //hardcode title into box and disable input
     //check for existing file lock, cache, metadata
     //if exists
         //that file is already open with unsaved changes, would you like to load them or the original?
         //if load
             //load from dbox, return
         //else
             //are you sure you would like to erase unbacked local changes?
     //else
         //it adds a remote cache of the file and grabs the timestamp
 
     //before you click save, check to see if timestampt has changed. If yes, inform the user you may be overwriting changes since someone has saved in the mean time
 //else
     //consider it a new file
     //check cache
         //if cache found and haven't hasked before about these specific changes
             //prompt user to load all available caches
         //else
             ///populate button to load available caches
     //allow normal input
 
 //open button
 //popup list of files to choose from
 //if file is not .txt, check if they want to open in dropbox.com
 //ask if they want to open here or nvaigate to new tab
 //if open here
     //walk through full close procedure 
         //do you want this tab with contents to reopen?
         //if no
 //confirm: all unpushed changes are going to be wiped and this tab will not reopen
 //if confirm
     //go to open page
 
 //when you click new, allow title to be entered, and create dummy random name with remote cache and random id as open file
 //If no name entered, use prompt()
 //check for existing file
     //if name exists, confirm they want to overwrite
 //save and check success
 //save new cache under proper name, delete old cache
 //after saving, navigate to 'open' page of same file (which loads from remote and give option to load from cache) 
 
 //premium
 //enable client side encryption after 'open' functionality
 //search functionaluty in new page - also search caches
  
 //anytime you exit, would you like this tab to reopen the next time you visit us?
 //prompt on open: We found other open files, would you like to open them now?
 //search local
 //serach remote
 
 //side bar showing ls of whole directory
 //clickable elements with options: open here, open in new tab
 
 //Load new File button instead of open
 //option to do it in a new tab or 
 
 //code for directory change being possible, but disable
 
 //add icon
 //change marcador client ID and logo
 
 //new load function that will perform option decryption if it finds appropriate header
 //in every encrypted file add comments at the top for dow to decrypt in CLI in case our service ever goes down
 //add opion to partially encrypt via ML in text??
 //prompt user password everytime
 
 //close page handler
 //ensure everything is saved to cache!!!
 //ask user if they want this to come up the next time?
 
 //add last cached timer
 
 //add logged in as 
 
 //add check user paid callbacks
 
 //add open in dropbox button
 
 //Add directory path hardcoded before file name?
 
 //create all necessary folder names!!
 
 //button to share. Sharing should be live-ish. Live-enough. But MUST not require the peer to have a dropbo acct. Must be able to get them the content they need without annoying steps
 //
 //New plan APR 2021
 //Remove junk features: renaming, timestamps,
 //Add overwrite capability and visua diff if file being written is different than the one we loaded
 //Focus on stable baseline functionality, file locking, merge resolution, encyption
 //Allow custom color change of background
 //Scrap current text box
 //scrap multitab requirement. Allow multiple files to be opened in one page
 //
 //File locks will be applied locally, not remotely. Only to block local cache from getting stepped on.
 //Remote conflicts will only be dealt with by a merge page that on resolves cache-remote conflicts. Not merging ta.val
 //The file_contents_at_pull need to be cached as well in order to make sure we don't overwrite the cache with an old remote file
 //i.e. if the last time we cached we couldn't talk to the server, we need to know about that even if tab gets closed.
 //
 //page should automatically direct to browse page if files exist in local list since they cannot be browsed on dropbox.com
 //
function close_pop()
{
    let pop = document.getElementById('open_pop');

    pop.style.display = "none";
    pop.style.visibility = 'hidden';
}

function rfb()
{
    let pop = document.getElementById('open_pop');

    //TODO make the contents of the popup dynamic so that we dont' need to keep rewriting the same code

    pop.style.display = "inline";
    pop.style.visibility = 'visible';
}

 function clear_file_cache(file)
 {
     remove_from_list(file);
     localStorage.removeItem(file);
     localStorage.removeItem(file+".ts");
 }

 function file_list_reload()
 {
     if(localStorage.getItem("file_list") != null)
     {
         file_list = JSON.parse(localStorage.getItem("file_list"))
         console.log("Full list loaded=" + file_list)
     }
 }
 
 function add_to_list(file)
 {	
     file_list_reload();
     
     if(file_list.indexOf(file) == -1)
     {
         file_list.push(file);
         localStorage.setItem("file_list", JSON.stringify(file_list));
         console.log("Added:"+file_list); 
     }
     
      return file_list.indexOf(file)
 }
 
 function remove_from_list(file)
 {
     file_list_reload();
     index = file_list.indexOf(file)
     
     if(index != -1)
     {
         console.log(file + "is at index "+index)				
         file_list.splice(index, 1)
         localStorage.setItem("file_list", JSON.stringify(file_list));
     }
 }
 
 function open_all_tabs(use_current_tab)
 {				
     for (index = 0; index < file_list.length; index++) {
         if((index == file_list.length-1) && use_current_tab == true)
         {
             reload_site_as(THISURL+'?open='+file_list[index])
             console.log("reload as: " + THISURL+'?open='+file_list[index])
         }
         else
         {
             open_new_site_as(THISURL+'?open='+file_list[index])
             console.log("new tab as: " + THISURL+'?open='+file_list[index])
         }
     }
 }
 
 function does_list_exist()
 {		
     console.log(file_list, file_list.length)	
     if(file_list == null || file_list.length == 0 || file_list.length == null)
     {
         return false;
     }
     else
     {
         return true;
     }
 }
 
 //TODO harden this with small array as backup
 function get_rand_word(callback)
 {
       fetch('https://random-word-api.herokuapp.com/word?number=1')
         .then(response => response.json())
         .then(data => callback(data[0]));
 }
 
 function open_new_file()
 {
     get_rand_word(function(word){
         open_new_site_as(THISURL+"?open="+word+"_"+makeid(3));
     })			
 }

close()
{
  if (confirm("Close Window?"))
  {
    close();
  }
};


 //TODO this currently warns the user that their data is about to be deleted, then STILL deletes it after they opt to preserve
/*
window.onbeforeunload = function(e) {
     let lo = document.getElementById('log');
     alert("HERE"); 
     save_loop("kill");
     localStorage.setItem(open_file + ".lock", null);
     
     if(open_file != '' && open_file != null) //this should never occur for user, but in test cases we hit it
     {
         if(ta.value != '' && ta.value != null)//normal case of accidentally opening and immediately closing new tab
         {
             
             let ch = document.getElementById('ch');
             
             ret = add_to_list(open_file);
 
             //TODO don't just checked that they are logged in, but that the file has actually saved as well
             if((ch.checked == false ) || ret == -1 )
             {
                 user_warned = true;
                 return "HERE"
             }		
         }
         else
         {
             console.log("Clearing...")
             clear_file_cache(open_file)
         }
     }
     
     return;
 };
 /*
 //This function determines what happened in onbeforeunload, ensuring user was warned before removing file from local cache
 window.onunload = function(e) {
     let lo = document.getElementById('log');
    

     localStorage.setItem(open_file + ".lock", null);

     if(open_file != '' && open_file != null) //this should never occur for user, but in test cases we hit it
     {
         if(ta.value != '' && ta.value != null)//normal case of accidentally opening and immediately closing new tab
         {
             
             let ch = document.getElementById('ch');
                     
             if(ch.checked == false && lo.value != "Logout")
             {
                 if(user_warned)
                 {
                     clear_from_cache(open_file)
                 }
             }
         }
     }
     return;
 };
*/ 
 function save_looop()
 {
     console.log("keypress save")
     save_loop("kill", function(ret)
     {
         if(ret == 200)
         {
            resetTime();
            minutesLabel.style.display = "inline";
            secondsLabel.style.display = "inline";
            savedLabel.style.display = "inline";
            localStorage.setItem(open_file + ".pending", 0);
         }
         else if(ret == 671) //made up code indicating local cache
         {
            resetTime();
            cachedLabel.style.display = "inline";
            minutesLabel.style.display = "inline";
            secondsLabel.style.display = "inline";
            localStorage.setItem(open_file + ".pending", 0);
         }
     });
 }
 function keypress_timer_kick()
 {
     console.log("kick")
     localStorage.setItem(open_file + ".pending", 1);
     clearTimeout(keypress_timer);
     keypress_timer = setTimeout(save_looop, keypress_timeout /*ms*/);
 }
 
 function save_loop(cmd, callback)
 {			
     
     let di = document.getElementById('di');
     let ti = document.getElementById('ti');
     let lo = document.getElementById('log');
     var timeout = 60000;
     
     user_warned = false; //just resetting this because we get no other event if the user cancels closing tab
     
     if(ta.value == "")
     {
         console.log("Skip cache. Empty");
         
         if(callback)
         {
             callback(0);
         }
         return;
     }			
     

     lock_file_loc();

     console.log("Cache now!!!");
     
     localStorage.setItem(open_file, ta.value);
     localStorage.setItem(open_file + ".ts", Date.now());
     
     if(lo.value == "Logout")
     {	
         //TODO backup to remote. WARNING callback triggered here will not fire during close event most likely. Test it.
         
         //check remote timestamp
         //if timestamp does not exist 
         
         //check for file locks as well in case another browser opened and opted to lock this one. Prompt user quickly and say editing here is now disabled.
         note_save_handler(function(ret){
             if(callback)
             {
                 callback(ret)
             }
         });
     }
     else
     {
         if(callback)
         {
            callback(671);
         }
     }
     
     clearTimeout(timer);
     
     //because this loop reset user_warned var, it cannot rerun by accident during the close process a second time. We already run it once.
     //Timer will automatically restart on next text change
     //if(cmd != "kill")
     //{
     //    timer = setTimeout(save_loop, timeout);
     //}
 }
 
 //TODO this triggers closing handlers, ensure that we are never using this in a conflicting way
 function reload_site_as(site)
 {
     window.location.href = site;
 }
 
 function open_new_site_as(url)
 {
     var win = window.open(url, '_blank');
     
     if(win == null)
     {
         show_oa(); //TODO this does not work because it is only hit when we are about to reload the tab. We need to send this as arg to new tab :/
         alert("We noticed popups are disabled. Please enable them to open all available files.");
         win = window.open(url, '_blank');
         if(win!=null)
         {
             win.focus();
         }
     }
     else
     {
         win.focus();
     }
 }
 
 function show_oa()
 {
     let oa = document.getElementById('oa');
     oa.style.display = "inline";
     oa.style.visibility = 'visible';
 }
 
 function hide_oa()
 {
     let oa = document.getElementById('oa');
     oa.style.display = "none";
     oa.style.visibility = 'hidden';
 }
 
 function open_all_cached_files()
 {
     open_all_tabs(false);
     hide_oa();
 }
 
 //TODO try to reauth without disturbing user
 function auth_failure_handle()
 {
 }
 
 function erase()
 {
     if(confirm("Press OK to confirm you would like to Erase this file."))
     {
         clear_file_cache(open_file)
         window.localStorage.removeItem("ta.value")
         window.localStorage.removeItem("ti.value")
         window.localStorage.removeItem("di.value")
     
         ta.value = '';
         ti.value = '';
         
         window.localStorage.removeItem("file_list")
         reload_site_as(THISURL)
     }
 }
 
 //TODO do a full ASCII character check here. This can open us up to attacks.
 function check_file_name(file)
 {
     if(file == "")
     {
         alert("File name absent");
         return null;
     }

     file = file.replace(/–/g, '-');

     if(file.includes('\\') || file.includes('\/'))
     {
         alert("Please remove slashes from the name");
         return null;
     }
     
     return file;
 }
 
 // document.onload = function()
 function init()
 {			
     
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

     let di = document.getElementById('di');
     let ti = document.getElementById('ti');
     let lo = document.getElementById('log');

     let ch = document.getElementById('ch');

     var queryString = new URL(window.location.href.replace(/#/g,"?"));
     console.log("queryString= " + queryString);

     console.log("sessionid=" + sessionid);

     if(queryString != "")
     {
         console.log("Checking for token");
         // window.location.href = AUTH_URL;
         access_token = queryString.searchParams.get("access_token");
         console.log("Found New token: " + access_token);

         account_id = queryString.searchParams.get("account_id");
         console.log("Found New Account ID: " + account_id);

         open_file = queryString.searchParams.get("open");
         console.log("Found Open file: " + open_file);

         merge_file = queryString.searchParams.get("merge");
         console.log("Found Merge file: " + open_file);

         //THIS SECTION IS ONLY HIT DURING ACTIVE LOGIN, NOT FOR LOGGED IN STATUS
         if(access_token != null && account_id != null)
         {
             dbox_key_value = access_token;
             dbox_account_id = account_id;

             localStorage.setItem("dbox_token", dbox_key_value);
             localStorage.setItem("dbox_account_id", dbox_account_id);

             dbox_key_check(function(ret){
                 if(ret == 200)
                 {
                     console.log("Key worked");
                     reload_site_as(THISURL);
                 }
                 else
                 {
                     console.log("Key NOT working");
                     alert(	"We're sorry, but that Login to Dropbox failed. The token returned to us did not check out. To be safe we are logging you out of all accounts.");
                     localStorage.removeItem("dbox_token");
                     localStorage.removeItem("dbox_account_id");
                     reload_site_as(THISURL);
                 }

             })

             return;
         }
         else if(open_file != null)
         {
             nn = check_file_name(open_file);
             if(nn == null)
             {
                 open_file = null;
                 reload_site_as(THISURL);
             }

             ti.value = nn;
             open_file = nn;
             remove_from_list(open_file)
             console.log("HERE!!!!!!!!!:"+file_list)
         }
         else if(merge_file != null)
         {
             nn = check_file_name(merge_file);
             if(nn == null)
             {
                 reload_site_as(THISURL);
             }

             ti.value = nn;
             merge_file = nn;
             alert("You are now at the pretend merge page");
         }
         else
         {
             if(does_list_exist())
             {
                 //open_all_tabs(true)
             }
             else
             {

                 get_rand_word(function(word){
                     reload_site_as(THISURL+"?open="+word+"_"+makeid(3));
                 })

                 return

             }
         }
     }

     console.log("Token=")
     console.log(localStorage.getItem("dbox_token"))

     // let hard_coded_login = true;
     // let h_dbox_key_value = '';
     // let h_dbox_account_id = '';

     //load in dbx credentials
     if ((localStorage.getItem("dbox_token") == '' || localStorage.getItem("dbox_token") == null) && !hard_coded_login)
     {
         console.log("Key NOT found in storage");
         load_wo_login();
     }
     else
     {
         let lo = document.getElementById('log');
         let pu = document.getElementById('push');
         
         if(hard_coded_login == true)
         {
             console.log("Key FOUND hard coded");
             dbox_key_value = h_dbox_key_value;
             dbox_account_id = h_dbox_account_id;
         }
         else
         {
             console.log("Key FOUND in storage");
             dbox_key_value = localStorage.getItem("dbox_token");
             dbox_account_id = localStorage.getItem("dbox_account_id");	
         }
         
         dbox_key_check(function(ret){
             if(ret == 200)
             {
                 console.log("Key WORKING");
                 login();
             }
             else
             {
                 console.log("Key NOT working");
                 load_wo_login();
             }
             
         })
     }
 }
 
 function load_wo_login()
 {						
     let pu = document.getElementById('push');
     pu.style.visibility = 'hidden';
     pu.style.display = "none";
     
     let lo = document.getElementById('log');
     lo.value = 'Login to Dropbox';

     //var pending_cnt = 0;
     //while(1 == localStorage.getItem(open_file + ".pending") && pending_cnt < 15)
     //{
     //    sleep(1);
     //    pending_cnt++;
     //}
     console.log("In load func...");
     var timer;
     var flocked = document.getElementById('filelocked');
     if(1 == localStorage.getItem(open_file + ".pending"))
     {
         ta.value = "Document has pending changes...please wait";
         timer = setTimeout(function(){ load_wo_login(); }, 3000);

         ta.readOnly = "true";
         pagelocked = true;
         minutesLabel.style.display = "none";
         secondsLabel.style.display = "none";
         savedLabel.style.display = "none";
         cachedLabel.style.display = "none";
         flocked.style.display = "inline";
         flocked.style.visibility = 'visible';
         return;
     }
     steal_lock();
     ta.removeAttribute('readonly');
     flocked.style.display = "none";
     flocked.style.visibility = 'hidden';
     pagelocked = false;
     localStorage.setItem(open_file + ".pending", 0);


     if(localStorage.getItem(open_file) != null)
     {
         console.log("Found local cache of "+open_file)
         ta.value = localStorage.getItem(open_file)
     }
 }
 
 function construct_file_path(file)
 {
     if(file)
     {
         return NOTE_PATH + file + ".txt";
     }
     else
     {
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

function steal_lock()
{
    console.log("Stealing lock");
    localStorage.setItem(open_file + ".lock", sessionid);
    //ta.readOnly = "false";
    ta.removeAttribute('readonly');
}

//old name, this should really be "check lock" to see if another tab has opened
function lock_file_loc()
{
    if(is_file_locked_loc())
    {
        ta.readOnly = "true";
        pagelocked = true;
        let flocked = document.getElementById('filelocked');
        flocked.style.display = "inline";
        minutesLabel.style.display = "none";
        secondsLabel.style.display = "none";
        savedLabel.style.display = "none";
        cachedLabel.style.display = "none";
        flocked.style.visibility = 'visible';
        alert("This file can only be edited once you steal the lock on it. Refresh to have option to steal the lock. *NOTE* Your last keypress or paste operation was not cached or saved remotely.");
        return -1;
    }
    else
    {
        //localStorage.setItem(open_file + ".lock", sessionid);
        //ta.removeAttribute('readonly');
        //ta.readOnly = "false";
    }
    return 200;
}

function is_file_locked_loc()
{
     lockid = localStorage.getItem(open_file + ".lock");

     if(lockid != null && lockid != sessionid)
     {
         return true;
     }

     //return false;
}

 function login()
 {
       let li = document.getElementById('lia');
     let un = document.getElementById('un');
     let pu = document.getElementById('push');
     let lo = document.getElementById('log');
     
     li.style.display = "inline";
     li.style.visibility = 'visible';
     
     un.style.display = "inline";
     un.style.visibility = 'visible';
                 
     //pu.style.display = "inline";
     //pu.style.visibility = 'visible';
     lo.value = "Logout";
 
     var timer;
     var flocked = document.getElementById('filelocked');
     if(1 == localStorage.getItem(open_file + ".pending"))
     {
         ta.value = "Document has pending changes...please wait";
         timer = setTimeout(function(){ login(); }, 3000);

         ta.readOnly = "true";
         pagelocked = true;
         minutesLabel.style.display = "none";
         secondsLabel.style.display = "none";
         savedLabel.style.display = "none";
         cachedLabel.style.display = "none";
         flocked.style.display = "inline";
         flocked.style.visibility = 'visible';
         return;
     }
     steal_lock();
     ta.removeAttribute('readonly');
     flocked.style.display = "none";
     flocked.style.visibility = 'hidden';
     pagelocked = false;
     localStorage.setItem(open_file + ".pending", 0);

     cache = localStorage.getItem(open_file)
     cache_time = localStorage.getItem(open_file + ".ts")
 
     dbox_cat_file(construct_file_path(), function(contents)
     {
         if(contents == null)
         {
             ta.value = cache;
             file_contents_at_pull = null;
         }
         else
         {
             ta.value = contents;
             file_contents_at_pull = contents;
         }
     })
     
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

 function note_save_handler(callback)
 {
     let di = document.getElementById('di');
     let ti = document.getElementById('ti');
     let error_output = document.getElementById('error_op');
                 
         // 		    if(ta.value == "")
         // 		    {
         // ta.placeholder = "Enter some text here before saving!";
         // 			  	return;
         // 		    }

     if(ti.value == "")
     {
         error_output.style.color = 'red';
           error_output.innerHTML = "Please specify a file name";
         
         ti.value = prompt("Please enter a file name", "");
         if (ti.value == "")
         {
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

     ti.value = ti.value.replace(/–/g, '-');
     di.value = di.value.replace(/–/g, '-');

     if(ti.value.includes('\\') || ti.value.includes('\/'))
     {
         error_output.style.color = 'red';
         error_output.innerHTML = "Please remove slashes from the name";
         // $("#error_op").fadeIn();
         return;
     }
     else
     {
           error_output.innerHTML = "";
           // $("#error_op").fadeOut();
     }

     dbox_cat_file(construct_file_path(), function(contents)
     {
         if(file_contents_at_pull == contents)
         {
             temp_ta_val = ta.value;
             dbox_create_file(construct_file_path(), temp_ta_val, /*overwrite*/1, function(ret)
             {
                 if(callback)
                 {
                     callback(ret);
                 }

                 if(ret == 200)
                 {
                     // alert("Success");
                     console.log("Remote backup SUCCESS")
                     file_contents_at_pull = temp_ta_val;
                 }
                 else
                 {
                     console.log("Remote backup FAIL")
                     // alert("Remote backup failed");
                     auth_failure_handle()
                 }
             });
         }
         else
         {
             alert("File has changed on Dropbox.com since you last saved. Merge required.");
         }

     })
 }

 function logout()
 {
     let lo = document.getElementById('log');
     let pu = document.getElementById('push');
     
     dbox_revoke_key(function(ret){
         if(ret == 200)
         {
             alert("Dropbox keys successfully revoked");
         }

         reload_site_as(THISURL)
     });
     
     localStorage.removeItem("dbox_token");
     dbox_key_value = '';
     pu.style.display = "none";
     lo.value = "Login to Dropbox";
 }
 
 function log()
 {
     let lo = document.getElementById('log');
     console.log(lo.value)
     
     save_loop();
     
     if(lo.value == "Login to Dropbox")
     {
         reload_site_as(AUTH_URL)
     }
     else
     {
         logout();
     }
 }
 
 function inject_timestamp()
 {
     let unix = document.getElementById('unix');
     var dateString = ''
     var newDate = new Date();
     
     if(unix.checked)
     {
         dateString = Date.now()
     }
     else
     {
         dateString = newDate.toUTCString();
     }
     
     if(ta.value)
     {
         ta.value = ta.value + '\n' +'[' + dateString + '] '
     }
     else
     {
         ta.value = '[' + dateString + '] '
     }
     
     ta.focus();
 }
 
 function mv()
 {
     var temp_name, old_name = open_file;
     let ti = document.getElementById('ti');
     let lo = document.getElementById('log');
     
     if(lo.value != "Logout")
     {
         //TODO make it so that this warning is not necessary. Just rename the file the next time they login. Possible to do in  a stable way?
         if(!confirm("Changing the name while not logged into Dropbox may result in duplicate files under both names"))
         {
             return;
         }
     }
     
     temp_name = prompt("Enter new name");
     
     if(temp_name == null)
     {
         return;
     }
     
     while(temp_name == '')
     {
         temp_name = prompt("Enter new name (type something!)");
         
         if(temp_name == null)
         {
             return;
         }
     }
                     
     temp_name = temp_name.replace(/–/g, '-');

     if(temp_name.includes('\\') || temp_name.includes('\/'))
     {
         temp_name = prompt("Please remove slashes from name", temp_name);
     }
     
     temp_name = check_file_name(temp_name);
     
     if(temp_name == null)
     {
         console.log("Failed name check, aborting");
         return;
     }
                 
     if(lo.value == "Logout")
     {
         save_loop('', function(re){
             
             if(re == 200)
             {
                 //TODO kick off rename with dropbox
                 dbox_mv_file(construct_file_path(temp_name), construct_file_path(ti.value), function(ret)
                 {
                     if(ret == 200)
                     {
                         clear_file_cache(ti.value)
                         ti.value = temp_name
                         open_file = temp_name
                         save_loop();
                         reload_site_as(THISURL+"?open="+open_file);
                     }
                     else
                     {
                         alert("Failed to rename remote file, continuing with old name");
                     }
                 });	
             }
             
         });
     }
     else
     {
         clear_file_cache(ti.value)
         ti.value = temp_name
         open_file = temp_name
         save_loop();
         reload_site_as(THISURL+"?open="+open_file);	
     }
     
     
 }

function tachanged()
{
    let clickedwhilelocked = 0;

    //prevent triggering of warning once we've gone read only
    if(!pagelocked)
    {
        if(lock_file_loc() == 200)
        {
            keypress_timer_kick();

            minutesLabel.style.display = "none";
            secondsLabel.style.display = "none";
            savedLabel.style.display = "none";
            cachedLabel.style.display = "none";
        }
    }
    else
    {
        clickedwhilelocked++;
    }

    if(clickedwhilelocked > 5)
    {
        alert("You must refresh if you want to steal the lock and edit this file.");
        clickedwhilelocked = 0;
    }
}

ta.onpaste = function (ev)
{
    tachanged();
};

ta.onkeypress = function (ev)
{
    tachanged();
};

ta.onkeydown = function (e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var val = this.value,
            start = this.selectionStart,
            end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        ta.value = val.substring(0, start) + "    " + val.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 4;

        tachanged();

        // prevent the focus lose
        return false;
    }
};

setInterval(setTime, 1000);

function resetTime()
{
  totalSeconds = 0;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60)) + ":";
}

function killTime()
{
  totalSeconds = 3602;
}

function setTime()
{

  if(totalSeconds > 3600)
  {
    minutesLabel.style.display = "none";
    secondsLabel.style.display = "none";
    return;
  }

  ++totalSeconds;

  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60)) + ":";
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

document.addEventListener("visibilitychange", event => {
  if (document.visibilityState == "visible") {
  } else {
    killTime();
    console.log('User left page');
  }
})

var last = (new Date()).getTime();

setInterval(function(){
	var current = (new Date()).getTime();
	if (current-last > 3000) {
        killTime();
		console.log('power was suspended');
	}
	last = current;

}, 1000);
