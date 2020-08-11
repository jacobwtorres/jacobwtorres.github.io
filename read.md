add ability to share file with other user in realtime. Is this possible w/o dropbox?

every files cache needs metadata about whether we have already prompted the uer
dbox timestamp of last change when we opened it
already prompted to reopen with no?
encrypted?

different page args.
if arg==open with valid file name (is allowed to be path to cached file with no regular path!!!)
    hardcode title into box and disable input
    check for existing file lock, cache, metadata
    if exists
        that file is already open with unsaved changes, would you like to load them or the original?
        if load
            load from dbox, return
        else
            are you sure you would like to erase unbacked local changes?
    else
        it adds a remote cache of the file and grabs the timestamp

before you click save, check to see if timestampt has changed. If yes, inform the user you may be overwriting changes since someone has saved in the mean time
else
consider it a new file
check cache
if cache found and haven't hasked before about these specific changes
prompt user to load all available caches
else
/populate button to load available caches
allow normal input

open button
popup list of files to choose from
if file is not .txt, check if they want to open in dropbox.com
ask if they want to open here or nvaigate to new tab
if open here
walk through full close procedure 
do you want this tab with contents to reopen?
if no
confirm: all unpushed changes are going to be wiped and this tab will not reopen
if confirm
go to open page

when you click new, allow title to be entered, and create dummy random name with remote cache and random id as open file
If no name entered, use prompt()
check for existing file
if name exists, confirm they want to overwrite
save and check success
save new cache under proper name, delete old cache
after saving, navigate to 'open' page of same file (which loads from remote and give option to load from cache) 

premium
enable client side encryption after 'open' functionality
search functionaluty in new page - also search caches

anytime you exit, would you like this tab to reopen the next time you visit us?
prompt on open: We found other open files, would you like to open them now?
search local
serach remote

side bar showing ls of whole directory
clickable elements with options: open here, open in new tab

Load new File button instead of open
option to do it in a new tab or 

code for directory change being possible, but disable

add icon
change marcador client ID and logo

new load function that will perform option decryption if it finds appropriate header
in every encrypted file add comments at the top for dow to decrypt in CLI in case our service ever goes down
add opion to partially encrypt via ML in text??
prompt user password everytime

close page handler
ensure everything is saved to cache!!!
ask user if they want this to come up the next time?

add last cached timer

add logged in as 

add check user paid callbacks

add open in dropbox button

Add directory path hardcoded before file name?

create all necessary folder names!!

button to share. Sharing should be live-ish. Live-enough. But MUST not require the peer to have a dropbo acct. Must be able to get them the content they need without annoying steps

