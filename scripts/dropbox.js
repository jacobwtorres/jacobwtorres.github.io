/**
 * Utility Functions for interacting with dropbox api
 */

// depends on the folder already having been ls'd into not_file_ls element. We check to see if files exists before performing the cat
function dbox_cat_file(path, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://content.dropboxapi.com/2/files/download', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + dbox_key_value);
    xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({"path":path}));

    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                callback(xhr.responseText);
            }
            else
            {
                callback(null);
                
            }
        }
    }

    xhr.send();
}

function dbox_mv_file(to, from, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.dropboxapi.com/2/files/move_v2', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + dbox_key_value);
    // xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({"from_path":from, "to_path":to, "autorename":false, "allow_shared_folder":false, "allow_ownership_transfer":false}));
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4)
        {
            console.log(xhr.responseText)
            callback(xhr.status)
        }
    }
    
    var data = JSON.stringify({"from_path":from, "to_path":to, "allow_shared_folder":false, "autorename":false, "allow_ownership_transfer":false});

    xhr.send(data);
}

function dbox_key_check(callback)
{	
    url = 'https://api.dropboxapi.com/2/users/get_account'
    data = { account_id: dbox_account_id };
    fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + dbox_key_value
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then(response => 
              response.json().then(data => ({
                  data: data,
                  status: response.status
              })
          ).then(res => {
              callback(res.status)
              let un = document.getElementById('un');
              if(res.data.name.familiar_name)
              {
                  un.innerHTML = res.data.name.familiar_name;
              }
              else
              {
                  un.innerHTML = res.data.name.familiar_name;
              }
            // console.log(res.status, res.data.name.familiar_name)
          }));
}

function dbox_create_folder(path, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.dropboxapi.com/2/files/create_folder_v2', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + dbox_key_value);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function (){
        console.log("Create" + xhr.status)
        if (xhr.readyState == 4) {
            callback(xhr.status);
        }
    } 

    var data = JSON.stringify({"path":path});

    xhr.send(data);
}

//TODO add mute arg since we are going to be updating so often. Or let the user choose
function dbox_create_file(path, bin, overwrite, callback)
{

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + dbox_key_value);
    xhr.setRequestHeader('Content-type', 'application/octet-stream');

    if(overwrite)
    {
        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({"path":path, "autorename":false,"mode":{".tag":"overwrite"}, "mute":false})); 
    }
    else
    {
        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({"path":path, "autorename":true,"mode":{".tag":"add"}, "mute":false})); 
    }

    xhr.onreadystatechange = function (){
        console.log("Upload" + xhr.status)
        if (xhr.readyState == 4) {
            callback(xhr.status);
        }
    }  
    
    xhr.send(bin);
}

function dbox_revoke_key(callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.dropboxapi.com/2/auth/token/revoke', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + dbox_key_value);

    xhr.onreadystatechange = function (){
        console.log("Revoke" + xhr.status)
        if (xhr.readyState == 4)
        {
            callback(xhr.status);
        }
    }   
    
    xhr.send();
}