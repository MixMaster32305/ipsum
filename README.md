# ipsum - An easy to install and easy to use all-in-one tool for the game Grey Hack.

> **Disclaimer**: ipsum is made specifically for use in the videogame Grey Hack on steam which is a simulated hacking environment. This tool is not applicable to any forms of real life hacking nor cybersecurity endeavors and must never be repurposed for any purposes illegal, malicious, or otherwise destructive. Grey Hack is a sandbox game that allows users to learn cybersecurity concepts in a safe, simulated environment.

---

## Summary
**ipsum** is an easy to use and easy to install hacking tool for the game Grey Hack that automates away tedious management tasks to leave a smooth and rapid workflow. No more dragging around scripts from PC to PC and enduring manual executions, let ipsum do the work for you.

Supports automated exploit scanning, testing, caching, and execution that utilizes the speed of the host PC's CPU, a mobile nmap, session manager, system securing commands, rshell deployment/management, jump files, connection tracking, and more!

---

## Getting a Build of ipsum
Step 1. Open the ipsum.gs file<br>
Step 2. ctrl + a<br>
Step 3. ctrl + c<br>
Step 4. ctrl + v to paste into the game's CodeEditor and make a build. No third-party tools needed!

Optional dependency:
There's a single optional dependency and that's chainsaw by NitroCynic which you can find here: https://github.com/jwfraustro/chainsaw
chainsaw is only necessary to use the privilege escalation component of hack, otherwise you can just choose not to use it. To use, it must be named "chainsaw" and located in /bin with g+rwx and o+x permissions (secure prepare can set these automatically for you)

---

## Setting-up nethack and connect functions
These commands use hard-coded values, so to use them you first need to go into the code and find the nethack function or the connect function respectively.

### Nethack
Nethack uses a hardcoded value from a library in /root/PoisonLibs (can setup folder using'setup' command, but still need to put the vulnerable lib in manually and edit nethack) that it'll transfer to a router for exploitation. First, run hack -l /lib/init.so on your local PC to find a computer bounce exploit, use cp /lib/init.so /root/PoisonLibs to copy it to PoisonLibs, then go to the nethack function in ipsum's code and find the following variables: **lib**, **router_lib_path**, **libVersion**, **mem_value**, **vuln_value** (ctrl + f and search for "nethack =")and edit these with the memory region/vuln value of one of the found bounce exploits, and change libVersion to that of your library (can check using checklibs command) (Note there will also be a commented out block with a single player path/vuln, you do not need to touch this).

### Connect
Connect automatically connects you to your remote server and loads its metax. Find the variables **ip** and **password** in ipsum's connect function (ctrl + f and search for "connect =") and change them to those of your remote server.

---

# Basic Workflow
```
1. Run [ipsum] on a root terminal (use sudo -s and login before launching).
2. Run [connect] to get a session for your remote server.
3. Use nmap [ip] to scout your target.
4. Use hack [ip] [port] to launch an attack on that target and get a shell then privilege escalate and login to root using sudo [user] [password]
5. On the new session, use [jump] to load metax then pivot to lan connections to dig in deeper.
6. Once finished, use [swap] to transition back to your host or server session, then use [clearsessions] to clear logs on all sessions and close everything but the host session.
```

---

## Exploit Requirements
The databases also store exploit requirements as single alpha characters. Legend of their meanings:
```
r = An active root user must be present on the PC.
g = An active guest user must be present on the PC.
u = An active user must be present on the PC.
n = A number of users must be registered on the PC.
p = A path must be present on the PC.
l = A library version must be present on the PC.
c = A number of computers must be connected to the router.
f = A number of forwarded ports must be configured on the router.
e = An existing connection must be present on the PC.
```

---

## Setting a Password for ipsum
Ipsum optionally supports having a hard-coded user password if the user wishes to configure one. In the code, search for "ipsum_password" and set it to your desired password before uncommenting the code chunk.

---

# Optional Dependency : Chainsaw by NitroCynic
**Original Github page for Chainsaw:** https://github.com/jwfraustro/chainsaw

Chainsaw is a markov chain password cracker, it lets you brute force NPC passwords in case you can't reach root any other way (or just want to do it quickly).

Considering the size of Chainsaw, it wasn't feasible to include it as a jump script inside of ipsum, so I'm leaving it as an optional dependency you can build for yourself if you'd like to use it. The version in this repo is a modified version which removes the logo, changes some operators that greybel would usually translate for you, and joins the pregens/samples into single lines so the in-game IDE will accept them. What this means is you can import it manually without tools.

To setup a build of chainsaw:
```
1. create a /data folder on your home machine.

2. Inside the /data folder, create three source files: chainsaw.src, pregens.src, and samples.src

3. In the Optional dependency (chainsaw) folder of this repo, ctrl + a, copy, then paste the
   respective files into the respective source files and save each one separately.

4. With the source files populated, open chainsaw.src and make a build of it, store it in
   /bin and name it "chainsaw" so hack can recognize it.
```
To run chainsaw manually, just upload and use "chainsaw run". Otherwise, hack will do this automatically during privilege escalation.

**A big thank you to NitroCynic/jwfraustro for making and sharing chainsaw, it's a great tool. Use the link above to give a star to his project or report bugs if you'd like.**

---

# Commands

### `nmap`
Scans a public or lan IP for ports. Will report both forwarded and internal ports (or a random IP). Scanning lan IPs uses a jump file which are deleted once used.
```
nmap [ip address]
nmap [random]
```
**Example:**
```
nmap 42.32.76.140
nmap random
```
---

### `hack`
Begins an attack on a specific port of a target ip address and will present exploit options to choose from after (a computer exploit will open a computer-interaction submenu, file exploits will read the contents of all gained files). Also allows for exploiting local lib vulnerabilities and bounce exploits. Can call createcache and testdatabase automatically if a database cache file for the targeted service version or library is not found. Can also use "exit" during exploit selection to back out without launching an attack.
```
hack [ip address] [port]
hack -l [lib path]
hack -l [lib path] [connected lan ip]
```
**Examples:**
```
hack 42.32.76.140 22
hack -l /lib/init.so
hack -l /lib/init.so 42.32.76.140
```
---

### `createcache`
Scans a service version or library for their vulnerabilities and stores them in a uniquely named database folder in /Databases (will also make /Databases if it isn't already present). Can use manually to recreate a cache file, or during troubleshooting. Otherwise, let hack do it for you.
```
createcache [ip address] [port]
createcache -l [lib path]
```
**Examples:**
```
createcache 42.32.76.140 22
createcache -l /lib/init.so
```
---

### `testdatabase`
Tests the exploits found during createcache and finds their returned object types and user privileges, then updates the cache file with them. Can call manually to retest a cache file against a new target, otherwise let hack do it.
```
testdatabase [ip address] [port]
testdatabase -l [lib path]
testdatabase -l [lib path] [connected lan ip]
```
**Examples:**
```
testdatabase 42.32.76.140 22
testdatabase -l /lib/init.so
testdatabase -l /lib/init.so 42.32.76.140
```
---

### `jump`
Creates a jump file on the current session to load its copy of metaxploit.so into the session (allows use of hacks from the remote PC). Will upload metaxploit.so if the pc doesn't have it. Deletes jump file once done.

**Example:**
```
jump
```
---

### `sudo`
Allows you to login to a higher privilege account in the current session, updating it. Utilizes a jump file to do so, then deletes it.
```
sudo [username] [password]
```
**Example:**
```
sudo root Ehackitt
```
---

### `ssh`
Allows you to connect to an ssh shell and add it as a session. ssh list displays tracked connections from /Databases/tracking.dat that have ssh available and allows you to choose one to create a new session with.
```
ssh [username@password] [ip]
ssh [list]
```
**Example:**
```
ssh root@Ehackitt 42.32.76.140
ssh list
```
---

### `ssh-server`
Setups an ssh service on the current session. Requires libssh.so on your host machine and utilizes a jump file which is then deleted.

**Example:**
```
ssh-server
```
---

### `ssh-stop`
Stops the ssh service running on the current session.

**Example:**
```
ssh-stop
```
---

### `connect`
Connects you to your hard-coded server and performs [jump] on it to load metax.

**Example:**
```
connect
```
---

### `swap`
Allows you to change your current session for another you have in the stack.
```
swap
swap [index]
```
**Example:**
```
swap
swap 1
```
---

### `delsession`
Allows you to delete a session from the stack. Clears logs of the session before deleting.
```
delsession
```
---

### `clearsessions`
Clears all sessions that aren't the host computer's and clears logs.
```
clearsessions
```
---

### `clearlog`
Clears the current session's logs via overwriting the current log file with an empty one (does not post a file deletion message in the new log). Requires root access to use.
```
clearlog
```
---

### `clearall`
Clears the logs of all sessions in the stack.
```
clearall
```
---

### `take`
Downloads (takes) a file from the session pc to the host's, equivalent to scp -d.
```
take [session filepath] [host filepath]
```
**Example:**
```
take /home/Chud/mine_now.jpg /root
```
---

### `pull`
Uploads (pulls) a file from the host pc to the session pc, equivalent to scp -u.
```
pull [host filepath] [session filepath]
```
**Example:**
```
pull /bin/chainsaw /bin
```
---

### `permiss`
Recursively resets permissions from root directory by default, or from the given filepath.

```
permiss
permiss [file_path]
```
**Example:**
```
permiss
permiss /home/Shibboleth
```
---

### `smtp-users`
Allows you to get the emails from an open smtp port.
```
smtp-users [public ip]
```
**Example:**
```
smtp-users 42.32.76.140
```
---

### `log`
log is a shortcut to LogViewer.exe, log dl downloads the log of the current session to /var/Downloads on the host pc, log dr reads the downloaded from /var/Downloads.

**Examples:**
```
log
log dl
log dr
```
---

### `sl`
Uploads ScanLan.exe to /usr/bin on the session pc and launches it

**Example:**
```
sl
```
---

### `admon`
Launches /usr/bin/AdminMonitor.exe from the host PC.
```
admon
```
---

### `libs`
Uploads /lib/metaxploit.so, /lib/crypto.so, and /lib/librshell.so to the session pc.

**Example:**
```
libs
```
---

### `findpass`
Looks for /etc/passwd and tries to print its contents

**Example:**
```
findpass
```
---

### `findmail`
Looks for the Config/Mail.txt file for all users on the pc and prints their contents.

**Example:**
```
findmail
```
---

### `findbank`
Looks for the Config/Bank.txt file for all users on the pc and prints their contents.

**Example:**
```
findbank
```
---

### `findhackshop`
Will cycle through random IP addresses until finding one with a potential hackshop in it.

**Example:**
```
findhackshop
```
---

### `findport`
Will cycle through random IP addresses until finding one with the designated port number.

**Example:**
```
findport 22
```
---

### `crack`
Deciphers a hash string you pass into it and prints out the deciphered password.
```
crack [hash]
```
**Example:**
```
crack e16032b436d065949d78f58e8c073f4d
```
---

### `checklibs`
Prints the name and verison number of every library in /lib, or for one lib if using the -l flag.
```
checklibs
checklibs -l [lib path]
```
**Example:**
```
checklibs
checklibs -l /root/SafeLibs/init.so
```
---

### `readdatabase`
Gives you the option to read any of the databases in the /Databases folder with hack's usual formatting.

**Example:**
```
readdatabase
```
---

### `secure`
Locks down file permissions and deletes attack surfaces like Mail.txt, Bank.txt, and passwd files. Secure home is for use on your home PC as it will provide exceptions to commands like sudo and bash to not hard lock your pc, otherwise use secure server for remote PCs you have root access to. Secure prepare unlocks certain files that are often transferred during hacks. Secure safelibs uploads the libraries from root/SafeLibs to the /lib folder of the current shell.
```
secure home
secure server
secure prepare
secure safelibs
```
---

### `setup`
Sets up all folders potentially used by ipsum beforehand. /Databases, /root/PoisonLibs, /root/SafeLibs, and /var/Downloads.
```
setup
```
---

### `nethack`
Used for attacking local devices attached to a router, can only be ran on a router. Requires setup in the source code via finding a bounce exploit in a local library placed in /root/PoisonLibs, as nethack will upload this library to the router in order to execute the attack reliably. See Nethack setup section above.
```
nethack
```
---

### `sniffer`
Sets up a sniffer listener on the current session. Cannot be backed out of (limitation of metax.sniffer function)
```
sniffer
```
---

### `rshell-server`
Starts an rshell service on the current session. Requires using [libs] first to bring over librshell.so. Also opens Browser.exe to let you forward the port easier.
```
rshell-server
```
---

### `rshell-interface`
Opens up an rshell-interface on the current session to listen for incoming connections. Gives the option periodically to cancel the listener so you can resume using ipsum, also can use "exit" during shell selection to back out.
```
rshell-interface
```
---

### `rshell-stop`
Stops an rshell service running on the current machine and opens Browser.exe to let you unforward the port easier.
```
rshell-stop
```
---

### `rshell-client`
Starts an rshell process on the current session pc named "Xorg" which will point to the rshell server ip you input.
```
rshell-client [rshell server ip]
```
**Example:**
```
rshell-client 42.32.76.140
```
---

### `corrupt-system`
Attempts to corrupt the system of the current session, used for data corruption missions. Will not allow corruption of host PC and will ask for confirmation otherwise.
```
corrupt-system
```
---

### `clear`
Clears the text from the terminal.
```
clear
```
---

### `track`
Tracks the current session's IP and password in /Databases/tracking.dat along with the ssh connection availability bool. If ssh connection available is true, then it will appear during ssh list.
```
track [password] [ssh connection available, true or false]
```
**Example:**
```
track axlo true
```
---

### `remind`
Searches /Datbases/tracking.dat for the current public IP and prints its tracked password.
```
remind
```
---

### `readmail`
Searches for all Mail.txt files on the device, decrypts the passwords, and accumulates their emails for you to search through.
```
readmail
```
---

### `txt`
Creates and or opens /root/mission.txt for keeping notes.
```
txt
```
---

### `terminal`
Starts a normal bash terminal on the current session
```
terminal
```
---

### `exit`
Clears logs from all sessions, clears sessions, and exits ipsum.
```
exit
```
---

### `help`
Presents usage information for every ipsum command.
```
help
```
---

Outside of the built in commands, any system command can still be used through ipsum as long as it doesn't share the same name as one of the tool's commands. It'll check in /bin, then /usr/bin, then current directory for any unrecognized commands.

---
