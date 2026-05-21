//ipsum - An all-in-one session manager and tool for the game Grey Hack.
//By Main Hub/The_MixMaster
//License: AGPL - https://github.com/MixMaster32305/ipsum/blob/main/LICENSE
g = get_custom_object

if not g.hasIndex("stack") then g.stack = {}

//Object is only shells for now. Computers and files handled by hack switch statement.
Session = { "metax": null,
            "router":null,
            "computerName":null,
            "publicAddress" : null,
            "lanAddress" : null,
            "object":null,
            "type":null,
            "user":null}

printHelpInfo = function()
    helpText = "
<color=#F2AFFF>swap</color> : Usage-- <color=#FFFFFF>swap or swap[integer]</color> --: <color=#3DF19D>Lets you change between different obtained sessions (shells).</color>\n
<color=#F2AFFF>createcache</color> : Usage-- <color=#FFFFFF>createcache [public ip] [port] or -l [local library, etc /lib/init.so] or -l [local library] [lan ip for bounce exploit]</color> --: <color=#3DF19D>Scans a service version or library and records the found exploit values in a cache file in /Databases on the host computer.</color>\n
<color=#F2AFFF>testdatbase</color> : Usage-- <color=#FFFFFF>testdatabase [public ip] [port] or -l [local library, etc /lib/init.so] or -l [local library] [lan ip for bounce exploit]</color> --: <color=#3DF19D>Tests the exploits found for a service version or lib from the createcache file and records what each does along with privileges.</color>\n
<color=#F2AFFF>hack</color> : Usage-- <color=#FFFFFF>hack [public ip] [port] or -l [local library, etc /lib/init.so] or -l [local library] [lan ip for bounce exploit]</color> --: <color=#3DF19D>Executes a chosen exploit against a service version/lib from the cache file and gives additional sub options depending on the returned type. Can call createcache and testdatabase automatically. Note: Privilege escalation requires a copy of chainsaw in /bin with g+rwx and o+x privileges.</color>\n
<color=#F2AFFF>connect</color> : Usage-- <color=#FFFFFF>connect</color> --: <color=#3DF19D>Automatically connects to your server and uses [jump] to load its metax. Note: you will have to hard code your server before building ipsum, look for the connect function and change the ip & password.</color>\n
<color=#F2AFFF>take</color> : Usage-- <color=#FFFFFF>take [filepath to download from current session pc] [filepath to download to on host pc]</color> --: <color=#3DF19D>An scp -d equivalent that downloads a desired file from the remote session to a filepath on your host pc.</color>\n
<color=#F2AFFF>pull</color> : Usage-- <color=#FFFFFF>pull [filepath to upload from host pc] [filepath to upload file to on current session pc]</color> --: <color=#3DF19D>An scp -u equivalent that uploads a desired file from your host pc to a filepath on the remote PC.</color>\n
<color=#F2AFFF>sl</color> : Usage-- <color=#FFFFFF>sl</color> --: <color=#3DF19D>Uploads ScanLan.exe to the current session and launches it.\n
<color=#F2AFFF>libs</color> : Usage-- <color=#FFFFFF>libs</color> --: <color=#3DF19D>Automatically uploads metaxploit.so, crypto.so, and librshell.so from your host pc to the current session.</color>\n
<color=#F2AFFF>nmap</color> : Usage-- <color=#FFFFFF>nmap [public or lan ip]</color> --: <color=#3DF19D>Will scan a public or lan ip for ports. Note: must use [jump] in a session before scanning lan ips, scanning lan ips uses a local jump file for execution.</color>\n
<color=#F2AFFF>findpass</color> : Usage-- <color=#FFFFFF>findpass</color> --: <color=#3DF19D>Prints the contents of /etc/passwd if it's present.\n
<color=#F2AFFF>findmail</color> : Usage-- <color=#FFFFFF>findmail</color> --: <color=#3DF19D>Prints the contents of /home/user/Config/Mail.txt for all users if it's present.</color>\n
<color=#F2AFFF>findbank</color> : Usage-- <color=#FFFFFF>findbank </color>--: <color=#3DF19D>Prints the contents of /home/user/Config/Bank.txt for all users if it's present.</color>\n
<color=#F2AFFF>checklibs</color> : Usage-- <color=#FFFFFF>checklibs or checklibs -l [filepath to lib]</color> --: <color=#3DF19D>Checks version numbers of all libraries in /libs, or of a designated one using the -l flag. Requires [jump] to have been used in the session.</color>\n
<color=#F2AFFF>readdatabase</color> : Usage-- <color=#FFFFFF>readdatabase</color> --: <color=#3DF19D>Lets you pick a cached service/library exploit file to read through (the ones generated from createcache/testdatabase).</color>\n
<color=#F2AFFF>crack</color> : Usage-- <color=#FFFFFF>crack [hash string]</color> --: <color=#3DF19D>lets you copy/paste a hash into the command to crack its password.</color>\n
<color=#F2AFFF>secure</color> : Usage-- <color=#FFFFFF>secure home or secure server or secure prepare</color> --: <color=#3DF19D>Secures the system through managing file ownership, permissions, and deleting attack surfaces. Secure home creates exceptions to not lock the user out of their home pc, Secure server locks down remote pcs that you have root credentials for, Secure prepare unlocks certain files on your host PC used/transferred during attacks.</color>\n
<color=#F2AFFF>nethack</color> : Usage-- <color=#FFFFFF>nethack</color> --: <color=#3DF19D>Gathers emails, passwords, bank information from every local device connect to the router this is ran on. Note: This command uses a hard-coded exploit for the init.so library resident on your host PC. Edit libVersion, mem_value, and vuln_value in the nethack function before use.</color>\n
<color=#F2AFFF>sniffer</color> : Usage-- <color=#FFFFFF>sniffer</color> --: <color=#3DF19D>Starts a sniffer listener on the current session. Cannot be canceled once started.</color>\n
<color=#F2AFFF>admon</color> : Usage-- <color=#FFFFFF>admon</color> --: <color=#3DF19D>Starts AdminMonitor.exe from /usr/bin.</color>\n
<color=#F2AFFF>rshell-server</color> : Usage-- <color=#FFFFFF>rshell-server</color> --: <color=#3DF19D>Starts an rshell-server service on the current session device and opens the browser so you can forward port 1222. Note, must use [libs] to bring librshell.so and metaxploit.so over first.</color>\n
<color=#F2AFFF>rshell-interface</color> : Usage-- <color=#FFFFFF>rshell-interface</color> --: <color=#3DF19D>Lets you select a connected rshell-client shell to add as a session. Can type 'exit' to leave without picking an option.</color>\n
<color=#F2AFFF>rshell-stop</color> : Usage-- <color=#FFFFFF>rshell-stop</color> --: <color=#3DF19D>Stops a currently running rshell service and opens the browser so you can unforward port 1222.</color>\n
<color=#F2AFFF>rshell-client</color> : Usage-- <color=#FFFFFF>rshell-client [public ip to rshell server]</color> --: <color=#3DF19D>Starts an rshell client daemon on the current session's pc pointed towards the given public IP.</color>\n
<color=#F2AFFF>ssh-server</color> : Usage-- <color=#FFFFFF>ssh-server</color> --: <color=#3DF19D>Starts an ssh service on the current session, requires /lib/libssh.so on the host PC.</color>\n
<color=#F2AFFF>ssh-stop</color> : Usage-- <color=#FFFFFF>ssh-stop</color> --: <color=#3DF19D>Stops the ssh service on the current session.</color>\n
<color=#F2AFFF>corrupt-system</color> : Usage-- <color=#FFFFFF>corrupt-system</color> --: <color=#3DF19D>Corrupts the pc of the current session, needs root access to execute successfully. Will not let you corrupt the host PC.</color>\n
<color=#F2AFFF>jump</color> : Usage-- <color=#FFFFFF>jump</color> --: <color=#3DF19D>Builds a jump file on the current session that will load metaxploit.so and a router into the session for use (otherwise cannot use metaxploit-dependent commands). Deletes file after running.</color>\n
<color=#F2AFFF>sudo</color> : Usage-- <color=#FFFFFF>sudo [user] [password]</color> --: <color=#3DF19D>Lets you login to a different user and updates the given session. Uses a jump file to get the new shell.</color>\n
<color=#F2AFFF>ssh</color> : Usage-- <color=#FFFFFF>ssh user@password [public ip] or ssh [list]</color> --: <color=#3DF19D>Lets you obtain a session through ssh connection, or list tracked ssh sessions from tracking.dat to choose from.\n
<color=#F2AFFF>smtp-users</color> : Usage-- <color=#FFFFFF>smtp-users [public ip]</color> --: <color=#3DF19D>Lets you obtain the emails from an open smtp port.\n
<color=#F2AFFF>clearsessions</color> : Usage-- <color=#FFFFFF>clearsessions</color> --: <color=#3DF19D>Clears all sessions except host and clears logs from the sessions before deletion.</color>\n
<color=#F2AFFF>delsession</color> : Usage-- <color=#FFFFFF>delsession</color> --: <color=#3DF19D>Lets you select a session to delete.</color>\n
<color=#F2AFFF>clear</color> : Usage -- <color=#FFFFFF>clear</color> --: <color=#3DF19D>Clears text from the terminal.</color>\n
<color=#F2AFFF>clearlog</color> : Usage-- <color=#FFFFFF>clearlog</color> --: <color=#3DF19D>Clears the log of the current session. Requires root access.</color>\n
<color=#F2AFFF>clearall</color> : Usage-- <color=#FFFFFF>clearall</color> --: <color=#3DF19D>Clears the logs of every obtained session in the stack.</color>\n
<color=#F2AFFF>remind</color> : Usage-- <color=#FFFFFF>txt</color> --: <color=#3DF19D>Searches through tracking.dat for the current session's public IP, reports its password.</color>\n
<color=#F2AFFF>txt</color> : Usage-- <color=#FFFFFF>txt</color> --: <color=#3DF19D>Creates or opens a mission.txt file in /root.</color>\n
<color=#F2AFFF>log</color> : Usage-- <color=#FFFFFF>log or log [dl] or log[dr]</color> --: <color=#3DF19D>Opens logviewer, downloads the log of the current session to /var/Downloads, or opens the log currently in /var/Downloads.</color>\n
<color=#F2AFFF>track</color> : Usage-- <color=#FFFFFF>track [password] [ssh available true or false] or [list]</color> --: <color=#3DF19D>Tracks a session in /Databases/tracking.dat and can allow ssh [list] to reconnect later. Use 'true' if the session has an ssh port, else use false.</color>\n
<color=#F2AFFF>terminal</color> : Usage-- <color=#FFFFFF>terminal</color> --: <color=#3DF19D>Switches to a native bash terminal on the session shell.</color>\n
<color=#F2AFFF>help</color> : Usage-- <color=#FFFFFF>help</color> --: <color=#3DF19D>Prints information for all available commands.</color>\n
<color=#F2AFFF>exit</color> : Usage-- <color=#FFFFFF>exit</color> --: <color=#3DF19D>Closes ipsum and clears all logs and sessions before closure (equivalent to calling clearall and clearsessions).</color>\n
<color=#F2AFFF>system commands</color> : <color=#3DF19D>type the command as normal into ipsum and it will check in /bin, /usr/bin, then current path for the command.</color>"
    print(helpText)
end function

check_return_type = function(returned_value)
    if typeof(returned_value) == "file" then
    	return "File"

    else if typeof(returned_value) == "computer" then
    	return "Computer"

    else if typeof(returned_value) == "shell" then
    	return "Shell"

    else if typeof(returned_value) == "number" then
    	if returned_value == 1 then
    		return "Other"
    	else if returned_value == 0 then
    		return "Failed"
    	else
    		return "Error: 1"
    	end if

    else if typeof(returned_value) == "string" then
    	print(returned_value)
    	return "Failed"

    else if returned_value == null then
    	return "Failed"
    else
    	return "Error: 2"
    end if
end function

//Compares to see if new user > old user privilege-wise.
//If guest, anything not guest (that isn't unknown) is better, if it's not guest then root is higher. Root doesn't get updated.
//Returns true if new user is higher, false if not.
compareUser = function(oldUser, newUser)
    //Got a shell higher than guest while having a guest shell, Upgrade
    if oldUser == "guest" and newUser != "guest" then
        return true

    //Got a guest shell while having a guest shell, Retain
    else if oldUser == "guest" and newUser == "guest" then
        return false

    //Got a guest shell while having a user shell, Retain.
    else if oldUser != "guest" and oldUser != "root" and newUser == "guest" then
        return false

    //Got a root shell while having a user shell, Upgrade
    else if oldUser != "guest" and oldUser != "root" and newUser == "root" then
        return true

    //Got a user shell while having a user shell, Retain
    else if oldUser != "guest" and oldUser != "root" and newUser != "guest" and newUser != "root" then
        return false

    //User already had a root shell, Retain
    else if oldUser == "root" then
        return false

    else
        return false

    end if
end function

createSession = function(result, user)
    newSession = new Session
    newSession.object = result
    newSession.type = check_return_type(result)
    newSession.user = user

    if newSession.type == "Shell" then
        hostComputer = result.host_computer
        newSession.publicAddress = hostComputer.public_ip
        newSession.lanAddress = hostComputer.local_ip
        newSession.computerName = hostComputer.get_name
    
    else if newSession.type == "Computer" then
        newSession.publicAddress = result.public_ip
        newSession.lanAddress = result.local_ip
        newSession.computerName = result.get_name

    end if

    return newSession
end function

clearStack = function()
    g.stack = {}
end function

//Returns 1 for added, 0 for not. Checks for upgraded user. Need to createSession first.
addSession = function(session)
    newPublicIP = session.publicAddress
    newLanIP = session.lanAddress
    newType = session.type
    newUser = session.user
    hasEntry = false

    keys = g.stack.indexes

    if keys.len == 0 then
        g.stack[0] = session
        return 1

    else
        for key in keys
            keyPublicIP = g.stack[key].publicAddress
            keyLanIP = g.stack[key].lanAddress
            keyType = g.stack[key].type
            keyUser = g.stack[key].user

            if keyPublicIP == newPublicIP and keyLanIP == newLanIP and keyType == newType then
                newUserHigher = compareUser(keyUser, newUser)

                if newUserHigher == true then
                    g.stack[key] = session
                    return 1
                    
                else
                    print("New sessions has lower privileges, retaining old session.")
                    return 0
                end if
            end if
        end for

        g.stack[keys.len] = session
        return 1
    end if

end function

//Swap to different shells. Index is an int, not a string, careful with user_input.
swapSession = function (index, current_session)
    if g.stack.hasIndex(index) then
        return g.stack[index]
    else
        print("Provided index not valid.")
        return current_session
    end if
end function

updateSession = function(current_session)
    index_list = g.stack.indexes
    current_publicIP = current_session.publicAddress
    current_lanIP = current_session.lanAddress
    return_index = null

    for index in index_list
        session = g.stack[index]
        if session.publicAddress == current_publicIP and session.lanAddress == current_lanIP then
            return_index = index

        else
            continue
        end if

    end for

    if return_index != null then
        return g.stack[return_index]
     
    else
        print("Error while updating session.")
        return current_session
    end if
end function

getSessionIndex = function(session)
    index_list = g.stack.indexes
    session_publicIP = session.publicAddress
    session_lanIP = session.lanAddress
    return_index = null

    for index in index_list
        it_session = g.stack[index]
        if it_session.publicAddress == session_publicIP and it_session.lanAddress == session_lanIP then
            return_index = index

        else
            continue
        end if
    end for

    if return_index != null then
        return return_index
     
    else
        print("Error while getting session index.")
        return 0
    end if
end function

deleteSession = function(index)
    if typeof(index) != "number" then
        print("Index must be a number")
        return 0
    end if
    if not g.stack.hasIndex(index) then
        print("No matching session found in stack. Invalid index.")
    end if
    if index == 0 then
        print("Cannot delete host session.")
        return 0
    else
        g.stack.remove(index)
        print("Session deleted.")
        return 1
    end if
end function

findIndexOfSession = function(session)
    index_list = g.stack.indexes
    session_ip = session.publicAddress
    session_lan = session.lanAddress

    for index in index_list
        index_sess = g.stack[index]
        index_ip = index_sess.publicAddress
        index_lan = index_sess.lanAddress
        if index_ip == session_ip and index_lan == session_lan then
            return index      
    else 
        continue
    end if
    end for

    print("No index found for " + session.object.host_computer.get_name)
    return null
end function

presentSessions = function()
    for key in g.stack.indexes
        keySession = g.stack[key]
        print(key + ": <color=#F79B11>" + keySession.user + "@" + keySession.computerName + "</color> <color=#E66AFF>" + keySession.publicAddress + "</color> <color=#FA5D91>" + keySession.lanAddress + "</color> <color=#27F53F>" + keySession.type + "</color>")
    end for
end function

connect = function(current_session)
    current_shell = current_session.object
    ip = "xx.xxx.xx"
    user = "root"
    password = "chud"
    port = 22

    connection = current_shell.connect_service(ip, port, user, password, "ssh")

    if typeof(connection) != "shell" then
        print("Error while connecting to server: " + connection)
        return null
    else
        connectionSession = createSession(connection, "root")
        addSession(connectionSession)
        print("Connected to remote server.")
        return g.stack.indexOf(connectionSession)
    end if
end function

//Returns 1 or 0
internalSSH = function(parameters_list, current_session)
    if parameters_list.len != 2 then
        print("Required parameters: [username@password] [IP address]")
        return current_session
    
    else
        credentials = parameters_list[0].split("@")
        if credentials.len != 2 then
            print("Invalid username@password given")
            return current_session
        end if
        user = credentials[0]
        password = credentials[1]
        ipAddress = parameters_list[1]
        port = 22

        if typeof(port) != "number" then 
            print("Invalid port: " + port)
            return current_session
        end if

            print("Connecting...")

            shell = current_session.object.connect_service(ipAddress, port, user, password, "ssh")
            if typeof(shell) == "string" then 
                print(shell)
                return current_session
            end if

            if shell then 
                sshSession = createSession(shell, user)
                addSession(sshSession)
                addToTracking(sshSession, password, "true")
                print("connection successful")
                return sshSession

            else 
                print("connection failed")
                return current_session
            end if
    end if
end function

trackingSSH = function(trackingInfo, current_session)
if trackingInfo.len != 4 then
        print("Required parameters: [list]")
        return current_session
    
    else
        user = "root"
        password = trackingInfo[2]
        ipAddress = trackingInfo[1]
        port = 22

        if typeof(port) != "number" then 
            print("Invalid port: " + port)
            return current_session
        end if

            print("Connecting...")

            shell = current_session.object.connect_service(ipAddress, port, user, password, "ssh")
            if typeof(shell) == "string" then 
                print(shell)
                return current_session
            end if

            if shell then 
                sshSession = createSession(shell, user)
                addSession(sshSession)
                print("connection successful")
                return sshSession

            else 
                print("connection failed")
                return current_session
            end if
    end if
end function

remind = function(current_session)
    unpackedTracking = unpackTracking()
    sessionIP = current_session.publicAddress

    for line in unpackedTracking
        lineEntries = line.split(",")
        lineIP = lineEntries[1]
        linePassword = lineEntries[2]

        if sessionIP == lineIP then
            print(linePassword)
            return 1

        else
            continue
        end if
    end for
    print("IP not found in tracking.dat")
    return 0
end function

clearLog = function(current_session)
    hostComputer = current_session.object.host_computer

    makeLog = hostComputer.touch("/", "system.log")
    if makeLog != 1 then
    	print("Error while making clean log: " + makeLog)

    else
    	logPresent = hostComputer.File("/system.log")

    		if logPresent != null then
    			print("Corrupting log...")
    			logResult = logPresent.move("/var", "system.log")

    			if logResult != 1 then
    				print("Error while corrupting log: " + logResult)

    			else if logResult == 1 then
    				print("Log corrupted successfully")

    			else
    				print("Unknown error while corrupting log.")
    			end if
    		else
    			print("Log file not found.")
    		end if
    end if
end function

smtp_users = function(parameters_list)
if parameters_list.len != 1 or parameters_list[0] == "-h" or parameters_list[0] == "--help" then
    print("<b>Usage: smtp-users [public IP with open SMTP port]</b>")
    return 0
end if
crypto = include_lib("/lib/crypto.so")
	if not crypto then
    	crypto = include_lib(current_path + "/crypto.so")
	end if
	if not crypto then
        print("Error: Can't find crypto library in the /lib path nor the current folder.\n")
        return 0
    end if

result = crypto.smtp_user_list(parameters_list[0], 25)

if result != null then
    for email in result
        print(email)
    end for
    return 1
else
    print("No email users found.")
    return 0
end if

end function

doNmap = function(ip_address, current_session)
if not is_valid_ip(ip_address) then 
    print("nmap: invalid ip address")
    return 0
end if

if not current_session.object.host_computer.is_network_active then 
    print("nmap: No internet access.")
    return 0
end if

ipAddress = ip_address
isLanIp = is_lan_ip(ipAddress)

if isLanIp then
   if get_router(ipAddress) != null then
      router = get_router(ipAddress)

   else
      router = current_session.router;
   end if
   
else 
   router = get_router(ipAddress)
end if

if router == null then 
    print("nmap: ip address not found. If on a remote PC, try using [jump]")
    return 0
end if
usedPorts = null

//device_ports will also return ports forwarded to the device, even if they belong to a different IP.
//Check for unique keys to prevent these dupes.
if not isLanIp then
   usedPorts = router.used_ports
   devicesLanIP = router.devices_lan_ip
   ports = []
   unique = {}

   for ip in devicesLanIP
      devicePorts = router.device_ports(ip)
      for port in devicePorts
         key = port.get_lan_ip + ":" + port.port_number
         if not unique.hasIndex(key) then
            unique[key] = true
            ports.push(port)
         end if
      end for
   end for

else
   //Need to do this on a jump script.
   ip_input_list = [ipAddress]
   jumpFile(current_session, ip_input_list, "nmaplan")
   router = g.lan_router
   usedPorts = g.deviceports
   ports = usedPorts
end if

if usedPorts == null then 
    print("nmap: ip address not found")
    return 0
end if
if typeof(usedPorts) == "string" then 
    print(usedPorts)
    return 0
end if
      
info = "PORT STATE FORWARDED SERVICE VERSION LAN"
print("\nStarting scan at " + current_date)
print("Interesting ports on " + ipAddress + "\n")
if(ports.len == 0) then 
    print("Scan finished. No open ports.")
    return 0
end if

for port in ports
   service_info = router.port_info(port)
   lan_ips = port.get_lan_ip
   port_status = "open"
   forwarded_status = "false"

   if(port.is_closed and not isLanIp) then
      port_status = "closed"
   
   else if isLanIp then
      port_status = "open"

   else
      port_status = "internal"
   end if

   for forwardedPort in usedPorts
      if(port.get_lan_ip == forwardedPort.get_lan_ip and port.port_number == forwardedPort.port_number) then
         forwarded_status = "true"
         if(port.is_closed) then
            port_status = "closed"
         else
            port_status = "open"
         end if
      end if
   end for

   info = info + "\n" + port.port_number + " " + port_status + " " + forwarded_status + " " + service_info + " " + lan_ips
end for
firewallRules = router.firewall_rules()
print("Router Kernel version: " + router.kernel_version())
print("Firewall rules: " + firewallRules.join(", "))
colorlessInfo = format_columns(info) + "\n" //Color has to be added after formatting due to the color tags messing with the format_columns alignment.
colorInfo = colorlessInfo.replace("open", "<color=#27F53F>open</color>").replace("true", "<color=#27F53F>true</color>").replace("closed", "<color=#ED2000>closed</color>").replace("false", "<color=#ED2000>false</color>").replace("internal", "<color=#dcdcaa>internal</color>")
print(colorInfo)
end function

loadMetax = function(current_session)
    metax = include_lib("/lib/metaxploit.so")
    if not metax then
        metax = include_lib(current_path + "/metaxploit.so")
    end if
    if not metax and current_session == g.stack[0] then 
        print("Error: Can't find metaxploit library in the /lib path nor the current folder")
        return 0

    else if not metax then
        print("Failed to load metaxploit for current session.")
        return 0
    end if

    current_session.metax = metax
    print("Metax loaded for " + current_session.computerName)
    return 1
end function

info_to_record = function(seq_number, port, ip_address, memory_address, value, reqs)
    return_string = str(seq_number) + "|||" + port + "|" + ip_address + "|" + memory_address + "|" + value + "|" + reqs
    return return_string
end function

checkForUsers = function(netSession)
if netSession.is_any_active_user == 1 then
		if netSession.is_root_active_user == 1 then
			print("Root user is online.")
		
		else
			print("A user is online.")
		end if
else
	print("No user is online.")
end if
end function

deserialize_astm = function(file)
	return_list = []
	content = file.get_content()
	split_records = content[:-2].split("\\n")
	
	//return list. So [[1, , ,xx,etc], []]
	for record in split_records
		return_list.push(record.split("\|"))
	end for
	return return_list
end function

check_return_type = function(returned_value)
if typeof(returned_value) == "file" then
	return "File"

else if typeof(returned_value) == "computer" then
	return "Computer"

else if typeof(returned_value) == "shell" then
	return "Shell"

else if typeof(returned_value) == "number" then
	if returned_value == 1 then
		return "Other"
	else if returned_value == 0 then
		return "Failed"
	else
		return "Error: 1"
	end if

else if typeof(returned_value) == "string" then
	print(returned_value)
	return "Failed"

else if returned_value == null then
	return "Failed"
else
	return "Error: 2"
end if
end function

getUserFromHandler = function (handler)
    rootFile = handler.File("/root")
    if rootFile != null and rootFile.has_permission("w") then 
        return "root"
		
    else 
        homeFile = handler.File("/home")
        if homeFile != null then 
            for user in homeFile.get_folders
                if user.name() == "guest" then continue
                if user.has_permission("w") then 
                    return user.name()
                end if
            end for
        end if

        guestFile = handler.File("/home/guest")
        if guestFile != null and guestFile.has_permission("w") then 
            return "guest"
        end if

    end if
    return "unknown"

end function

reserialize = function(seq, object_type, privilege, port, ip, memory, value, requirements)
	return_string = seq + "|" + object_type + "|" + privilege + "|" + port + "|" + ip + "|" + memory + "|" + value + "|" + requirements + "\n"
	return return_string
end function

tryDownloadFile = function(remoteComputer, file_path)
	hostShell = g.stack[0].object
	hostComputer = hostShell.host_computer
    file = hostComputer.File(file_path)

	if file != null then
		uploadSuccess = remoteComputer.scp(file_path, "/root", hostShell, 0)
		if uploadSuccess != 1 then
			print("Error uploading: " + file_path)

		else
			print("Successfully downloaded file to /root.")
		end if
	else
		print("Error finding: " + file_path + "\nFile either does not exist or user does not have permission to access it.")
        if file != null then
            print("Permissions: " + file.permissions)
        end if
	end if
end function

escalatePrivileges = function(remoteShell, privilege_level)
	user = privilege_level

	if user == "guest" then
		remoteShell.scp("/bin/chainsaw", "/home/guest", g.stack[0].object, 1)
		remoteShell.launch("/home/guest/chainsaw", "run")
        return 1

	else if user == "root" then
		print("root user obtained, no escalation needed.")
        return 0

	//Reguler users
	else
        realUser = getUserFromHandler(remoteShell.host_computer)
		remoteShell.scp("/bin/chainsaw", "/home/" + realUser, g.stack[0].object, 1)
		remoteShell.launch("/home/" + realUser + "/chainsaw", "run")
        return 1

	end if
end function

printFile = function(remoteComputer, file)
	filePresent = remoteComputer.File(file)
	if filePresent != null then
		if filePresent.has_permission("r") == 1 then
			print("File contents:\n")
			print(filePresent.get_content)
		else
			print("User does not have read permissions.")
		end if

	else
		print("File not found on remote computer.")
	end if
end function

printFolderContents = function(remoteComputer, folderPath)
	folderPresent = remoteComputer.File(folderPath)
	if folderPresent != null then
		files = folderPresent.get_files
		subfolders = folderPresent.get_folders

		if files.len > 0 then
			print("Files:")
			for file in files
				print(file.name)
			end for
		else
			print("No files found.")
		end if

		if subfolders.len > 0 then
			print("\nSubfolders:")
			for folder in subfolders
				print(folder.name)
			end for
		else
			print("\nNo subfolders found.")
		end if

	else
		print("\nFolder not found on remote computer.")
	end if
end function

corruptLog = function(remoteComputer)
	makeLog = remoteComputer.touch("/", "system.log")
	if makeLog != 1 then
	print("Error while making clean log: " + makeLog)

else
	logPresent = remoteComputer.File("/system.log")

	if logPresent != null then
		print("Corrupting log...")
		logResult = logPresent.move("/var", "system.log")

		if logResult != 1 then
			print("Error while corrupting log: " + logResult)

		else if logResult == 1 then
			print("Log corrupted successfully")

		else
			print("Unknown error while corrupting log.")
		end if
	else
		print("Log file not found.")
	end if
end if
end function

//Checks /home folder for users, prints out names.
printUsers = function(remoteComputer)
home_file = remoteComputer.File("/home")
if home_file == null then
    print("Could not access /home")
    return 0
end if
users = home_file.get_folders

if users.len == 0 then
	print("No user accounts found.")
    return 0
else
	for user in users
		print(user.name)
	end for
    return 1
end if
end function

//Checks passwd file
checkPassword = function(remoteComputer)
passwordPresent = remoteComputer.File("/etc/passwd")

if passwordPresent == null then
	print("No password file present or unable to be read due to permissions.")
    return 1

else
	crypto = include_lib("/lib/crypto.so")
	if not crypto then
    	crypto = include_lib(current_path + "/crypto.so")
	end if
	if not crypto then
        print("Error: Can't find crypto library in the /lib path nor the current folder.\n")
        return 0
    end if

	passwords = []
	passwordContents = passwordPresent.get_content
	splitPasswords = passwordContents.split(char(10)) //char(10) is the unicode value for newline character.
	splitPasswords.pop //Need to get rid of last entry as it'll be empty due to a lingering /n at end of file.

	for password in splitPasswords
		splitUserAndPass = password.split(":")
		decryptedPass = crypto.decipher(splitUserAndPass[1])
		if decryptedPass != null then
			print(splitUserAndPass[0] + ":" + decryptedPass)

		else
			print("Error processing a password.\n")
		end if
	end for
    return 1

end if
end function

//Prints emails/passwords
printPassEmails = function(remoteComputer)
users = remoteComputer.File("/home").get_folders
if users.len == 0 then
	print("No user accounts found.")
else
	for user in users
		bankResult = remoteComputer.File("/home/" + user.name + "/Config/Bank.txt")
		emailResult = remoteComputer.File("/home/" + user.name + "/Config/Mail.txt")
		
		if bankResult != null then
			print("Bank info from: " + user.name)
			print(bankResult.get_content + "\n")
		else
			print("Bank file not found for: " + user.name)
		end if

		if emailResult != null then
			print("Mail info from: " + user.name)
			print(emailResult.get_content + "\n")
		else
			print("Mail file not found for: " + user.name)
		end if
	end for
end if
end function

//Corrupts the system and reboots
corruptSystem = function(remoteComputer)
kernel = remoteComputer.File("/boot/kernel.img")
systemMap = remoteComputer.File("/boot/System.map")
initFile = remoteComputer.File("/boot/initrd.img")

if kernel == null and systemMap == null and initFile == null then
	print("Failed to corrupt the system, cannot access /boot files.")
    return 0

else
	kernel_result = kernel.delete
	system_result = systemMap.delete
	init_result = initFile.delete
	corruptLog(remoteComputer)
	reboot_result = remoteComputer.reboot

	if kernel_result.len != 0 or system_result.len != 0 or init_result.len != 0 then
		print("Error while deleting one or more /boot files.")
        return 0
	end if

	if reboot_result != 1 then
		print("Remote system reboot FAILED: " + reboot_result)
        return 0

	else
		print("System corrupted")
        return 1
	end if
	
end if
end function

classifyRequirements = function(segment)
	req_symbols = ""
	if segment.indexOf("*") != null then
		reqs = segment.split("\*")[1:]

		for req_untrimmed in reqs
			req = req_untrimmed.trim
			classifier = req.split(" ")[1]

			if classifier == "root" then
				req_symbols = req_symbols + "r,"

			else if classifier == "guest" then
				req_symbols = req_symbols + "g,"

			else if classifier == "an" then //active user
				req_symbols = req_symbols + "u,"

			else if classifier == "registered" then
				req_symbols = req_symbols + "n,"

			else if classifier == "path" then
				req_symbols = req_symbols + "p,"

			else if classifier == "namespace" then
				req_symbols = req_symbols + "l,"

            else if classifier == "computers" then
                req_symbols = req_symbols + "c,"

            else if classifier == "port" then
                req_symbols = req_symbols + "f,"

            else if classifier == "existing" then
                req_symbols = req_symbols + "e,"

			else
				print("Unrecognized requirement found in: " + segment)
			end if
		end for

		return req_symbols[:-1]

	else
		return ""
	end if
end function

//CreateCache
createCache = function(current_session, parameter_list)
if parameter_list.len != 2 or parameter_list[0] == "-h" or parameter_list[0] == "--help" then
    print("<b>Usage: "+program_path.split("/")[-1]+" [ip_address] [port] or -l [local lib path]</b>")
    return 0
end if

isLocal = false

if parameter_list[0] == "-l" then
	isLocal = true
end if

if current_session.metax == null then
    print("Metax not loaded for current session. Use [jump] to load.")
    return 0
end if
metax = current_session.metax
hostComputer = g.stack[0].object.host_computer
hostMetax = g.stack[0].metax
exploits = {}
requirement_list= []

if hostComputer.File("/Databases") == null then
	folder_created = hostComputer.create_folder("/", "Databases")
	if folder_created == 1 then
		print("/Databases folder created...")
	else
		print("Failed to create /Databases folder...")
        return 0
	end if
end if

if isLocal == false then
	address = parameter_list[0]
	port = parameter_list[1].to_int
	netSession = metax.net_use( address, port )
	if not netSession then
        print("Error: can't connect to net session")
        return 0
    end if
	checkForUsers(netSession)
	metaLib = netSession.dump_lib
	
else if isLocal == true then
	address = "Local"
	port = "Local"
    sessionComputer = current_session.object.host_computer
    if sessionComputer.File(parameters_list[1]) != null then
	    metaLib = metax.load(parameter_list[1])
    else
        print("Invalid library or library could not be found.")
        return 0
    end if
end if

scanResult = hostMetax.scan(metaLib)

loop_counter = 0
for area in scanResult
	scanAddress = hostMetax.scan_address(metaLib, scanResult[loop_counter])
	segments = scanAddress.split("Unsafe check: ")[1:]
	overflowvalues = []
	
    //Requirements check put here
	for segment in segments
   		labelStart = segment.indexOf("<b>")
   		labelEnd = segment.indexOf("</b>")
        requirement_list.push(classifyRequirements(segment))
   		overflowvalues.push(segment[labelStart + 3: labelEnd])
	end for

	exploits[scanResult[loop_counter]] = overflowvalues
	loop_counter = loop_counter + 1
end for

//File writing.
filePath = metaLib.lib_name[3:] + "_" + metaLib.version + ".dat"
hostComputer.touch("/Databases/", filePath)

file = hostComputer.File("/Databases/" + filePath) // writing
if file == null then
    print("Error: Could not open file for writing.")
    return 0
end if

writecounter = 1
content = ""
for keyvalue in exploits
	for value in keyvalue.value
        requirements = requirement_list[writecounter - 1]
		content = content + info_to_record(writecounter, port, address, keyvalue.key, value, requirements) + "\n"
		writecounter = writecounter + 1
	end for
end for
file.set_content(content)
return 1
end function

//TestDatabase
testDatabase = function(current_session, parameter_list)
if parameter_list.len > 3 or parameter_list.len < 2 or parameter_list[0] == "-h" or parameter_list[0] == "--help" then
    print("<b>Usage: testdatabase [ip_address] [port] or -l [local lib path] or -l [local lib path] [lan ip]</b>")
    return 0
end if

isLocal = false
useLanIP = false
testBounce = false

if parameter_list[0] == "-l" then
	isLocal = true
end if

if isLocal == true and parameter_list.len == 3 then
	useLanIP = true
end if

if current_session.metax == null then
     print("No metax loaded in current session, use [jump] to load.")
     return 0
end if
metax = current_session.metax

address = parameter_list[0]
port = parameter_list[1].to_int
hostComputer = g.stack[0].object.host_computer
file_contents = []

if isLocal == false then
    if port == 0 then
        testBounce = true
    end if

	netSession = metax.net_use( address, port )
	if not netSession then
        print("Error: can't connect to net session")
        return 0
    end if
	metaLib = netSession.dump_lib

//If calling using -l, has two paths. One for pure local, one for local using a lan ip.
else if isLocal == true then
	if useLanIP == false then
		address = "Local"
		port = "Local"
	
	else
		address = parameter_list[2]
		port = "Lan"
	end if

	metaLib = metax.load(parameter_list[1])
end if


database_key = metaLib.lib_name[3:] + "_" + metaLib.version + ".dat"
database_folder = hostComputer.File("/Databases")
available_databases = database_folder.get_files
database_matched = false

//Checks database directory for a database for the given software and version.
for database in available_databases
	if database.name == database_key then
		database_file = hostComputer.File("/Databases/" + database.name)
		file_contents = deserialize_astm(database_file)
		database_matched = true
	end if
end for

if database_matched == false then
	print("Error: No database for the targetted library found.")
	return 0
end if

reserialized_content = ""
//Executes the attacks then records returned type and privileges.
loop_counter = 0
for entry in file_contents
	memory_address = entry[5]
	vuln_value = entry[6]
    bounceOccurred = false

	if useLanIP == false then
		result = metaLib.overflow(memory_address, vuln_value)
	else if useLanIP == true then
		result = metaLib.overflow(memory_address, vuln_value, address)
	end if

    //If the initial result failed and it's a router, get a lan device ip from the router and see if the exploit works as a bounce.
    if testBounce == true and result == 0 then
        router = get_router(address)
        lan_devices = router.devices_lan_ip
        result = metaLib.overflow(memory_address, vuln_value, lan_devices[0])

        if result != 0 and typeof(result) != "string" then
            bounceOccurred = true
        end if
    end if

	returned_type = check_return_type(result)

	if returned_type == "Computer" then
		returned_privilege = getUserFromHandler(result)

	else if returned_type == "Shell" then
		returned_privilege = getUserFromHandler(result.host_computer)

	else if returned_type == "File" then
		returned_privilege = result.path()

	else
		returned_privilege = "?"

	end if

	print(returned_type)
    if bounceOccurred == true then
        returned_type = "B-" + returned_type
    end if
	reserialized_content = reserialized_content + reserialize(entry[0], returned_type, returned_privilege, entry[3], entry[4], entry[5], entry[6], entry[7])
	loop_counter = loop_counter + 1
end for

//Writes the reserialized contents back to the database.
database_file.set_content(reserialized_content)
return 1
end function

targetedHack = function(current_session, parameter_list)
if parameter_list.len > 3 or parameter_list.len < 2 or parameter_list[0] == "-h" or parameter_list[0] == "--help" then 
    print("<b>Usage: hack" + "[ip_address] [port] or [-l] [local lib path] or [-l] [local lib path] [lan ip]</b>")
    return 0
end if

if current_session.metax == null then
    print("Metax not loaded for this session. Use [jump] to load first.")
    return 0
end if
metax = current_session.metax

is_local = false
useLanIP = false

hostShell = g.stack[0].object
hostComputer = hostShell.host_computer
currentShell = current_session.object

file_contents = []

if parameter_list[0] == "-l" then
	is_local = true
end if

if is_local == true and parameter_list.len == 3 then
	useLanIP = true
end if

if is_local == true then
	if useLanIP == true then
		lib_path = parameter_list[1]
		lan_address = parameter_list[2]
        sessionComputer = current_session.object.host_computer
        if sessionComputer.File(lib_path) == null then
            print("Library unable to be found or invalid.")
            return 0
        end if
		metaLib = metax.load(lib_path)
	
	//For if -l is used without a lan Ip
	else
		lib_path = parameter_list[1]
        if sessionComputer.File(lib_path) == null then
            print("Library unable to be found or invalid.")
            return 0
        end if
		metaLib = metax.load(lib_path)
	end if
	
else
	address = parameter_list[0]
	port = parameter_list[1].to_int

	netSession = metax.net_use( address, port )
	if not netSession then 
        print("Error: can't connect to net session")
        return 0
    end if
	checkForUsers(netSession)
	metaLib = netSession.dump_lib
end if

databasesPresent = hostComputer.File("/Databases")
if typeof(databasesPresent) != "file" then
	folder_created = hostComputer.create_folder("/", "Databases")
	if folder_created == 1 then
		print("/Databases folder created...")
	else
		print("Failed to create /Databases folder, please run createcache or make /Databases manually.\nExiting...")
		return 0
	end if
end if

database_key = metaLib.lib_name[3:] + "_" + metaLib.version + ".dat"
database_folder = hostComputer.File("/Databases")
available_databases = database_folder.get_files
database_matched = false

//Checks database directory for a database for the given software and version.
for database in available_databases
	if database.name == database_key then
		database_file = hostComputer.File("/Databases/" + database.name)
		file_contents = deserialize_astm(database_file)
		database_matched = true
	end if
end for

//Launch createcache and testdatabase if a pre-existing database wasn't already found, then rerun database check.
if database_matched == false then
	if is_local == false then
		createDBResult = user_input("\nNo pre-existing database found, create one?\n(Y) or (N) : ")
		if (createDBResult == "y" or createDBResult == "Y")then
			cacheResult = createCache(current_session, parameter_list)
            databaseResult = testDatabase(current_session, parameter_list)
			print("End: testdatabase")
            if cacheResult == 0 or databaseResult == 0 then
                print("Issue during createcache or testdatabase, ending hack.")
                return 0
            end if

			available_databases = database_folder.get_files
			for database in available_databases
				if database.name == database_key then
					database_file = hostComputer.File("/Databases/" + database.name)
					file_contents = deserialize_astm(database_file)
					database_matched = true
				end if
			end for

            if database_matched == false then
                print("hack failed to find a usable database. Canceling...")
                return 0
            end if

		else
		print("Exiting program...\n")
		return 0

		end if

	//Called if running against a local lib.
	else
		createDBResult = user_input("\nNo pre-existing database found, create one?\n(Y) or (N) : ")
		if (createDBResult == "y" or createDBResult == "Y")then
			cacheResult = createCache(current_session, [parameter_list[0], parameter_list[1]]) //Prevents failure when using -l /lib lanIP
            databaseResult = testDatabase(current_session, parameter_list)
			print("End: testdatabase")
            if cacheResult == 0 or databaseResult == 0 then
                print("Issue during createcache or testdatabase, ending hack.")
                return 0
            end if

			available_databases = database_folder.get_files
			for database in available_databases
				if database.name == database_key then
					database_file = hostComputer.File("/Databases/" + database.name)
					file_contents = deserialize_astm(database_file)
					database_matched = true
				end if
			end for

            if database_matched == false then
                print("hack failed to find a usable database. Canceling...")
                return 0
            end if

		else
		print("Exiting program...\n")
		return 0

		end if
	end if
end if

displayDatabaseContents(database_file)
selected_int = user_input("Input the integer for which hack you'd like to run: ")
if selected_int == "exit" then
	print("User exited program...")
    return 0
end if

if file_contents.hasIndex(selected_int.val - 1) == 0 then
    print("Index not found.")
    return 0
end if

//Executing the overflow.
selected_entry = file_contents[selected_int.val - 1]
type = selected_entry[1]
memory_address = selected_entry[5]
overflow_value = selected_entry[6]

if is_local == true and useLanIP == true then
	result = metaLib.overflow(memory_address, overflow_value, lan_address)

else if type == "B-Computer" then
    bounceHack(address, metaLib, memory_address, overflow_value)
    return 0
	
else
	result = metaLib.overflow(memory_address, overflow_value)
end if

//Results outcome.
if not result then 
    print("Program ended")
    return 0
end if

//Need to add session to stack instead then set it to current session.
if typeof(result) == "shell" then
		if selected_entry[2] != "root" then
			answer = user_input("Non-root shell obtained, escalate privileges?\nNote: make sure chainsaw has g+rwx and o+x rules applied\nY / N: ")

			if answer == "y" or answer == "Y" then
				resultSession = createSession(result, selected_entry[2])
                print("New session added for " + resultSession.lanAddress + " " + resultSession.computerName)
                addSession(resultSession)
                escalatePrivileges(result, resultSession.user)
				return resultSession
				
			else if answer == "n" or answer == "N" then
				resultSession = createSession(result, selected_entry[2])
                print("New session added for " + resultSession.lanAddress + " " + resultSession.computerName)
                addSession(resultSession)
				return resultSession

			else
				resultSession = createSession(result, selected_entry[2])
                print("New session added for " + resultSession.lanAddress + " " + resultSession.computerName)
                addSession(resultSession)
				return resultSession
			end if

		else
			resultSession = createSession(result, selected_entry[2])
            print("New session added for " + resultSession.lanAddress + " " + resultSession.computerName)
            addSession(resultSession)
            return resultSession
		end if

//Computer submenu
else if typeof(result) == "computer" then
	print("Obtained access to computer: " + result.get_name)
	while(true)
		user_answer = user_input("\nPlease pick a subroutine:\n(1)Print user accounts\n(2)Crack passwords\n(3)Get Bank/Email\n(4)Get file/folder contents\n(5)Change password\n(6)Delete a file\n(7)Clear log\n(8)Corrupt system\n(9)Create guest user\n(10)Exit\nInput an integer: ")
		answer = user_answer.val
		print("\n")

		if answer == 1 then
			printUsers(result)

		else if answer == 2 then
			checkPassword(result)
		
		else if answer == 3 then
			printPassEmails(result)

		else if answer == 4 then
			filePath = user_input("Input file/folder path to print: ", 0, 0, 1)
			filePathExists = result.File(filePath)

			if filePathExists == null then 
				print("File/Folder not found.")
				continue

			else if filePathExists.is_folder == 1 then
				print("Permissions: " + filePathExists.permissions)
				printFolderContents(result, filePath)

			else
				print("Permissions: " + filePathExists.permissions)
				printFile(result, filePath)
			end if

		else if answer == 5 then
			passResult = result.change_password("root", "swagger")
            if typeof(passResult) == "string" or passResult == null then
                print("Failed to change password: " + passResult)
            else
                print("Password changed to 'swagger'")
            end if

		else if answer == 6 then
			deleteFilePath = user_input("Input file path to delete: ", 0, 0, 1)
			deleteFile = result.File(deleteFilePath)

			if deleteFile == null then
				print("File not found")

			else if deleteFile.has_permission("w") != 1 then
				print("User does not have write permissions.")
				
			else
				deleteFile = deleteFile.delete
				deleteResult = deleteFile.delete
				if deleteResult.len == 0 then
					print("File deleted successfully.")

				else
					print("Error while deleting file: " + deleteResult)

				end if
			end if

		else if answer == 7 then
			corruptLog(result)

		else if answer == 8 then
			corruptSystem(result)

		else if answer == 9 then
			accountCreateResult = result.create_user("guest2", "Bonzai")
			if accountCreateResult == 1 then
				print("User guest2@Bonzai created")

			else
				print("Failed to create new user: " + accountCreateResult)
			end if

		else if answer == 10 then
			print("Exiting program...")
			return 1

		else
			print("Invalid selection.")

		end if
	end while

//Add option to try and delete, or to decrypt child contents.
else if typeof(result) == "file" then
	filename = result.name
	print("Obtained a file")
	print(filename)
	print("Permissions: " + result.permissions)
	print("Owned by: " + result.owner)
	
	if result.is_folder == 1 then
		files = result.get_files
		folders = result.get_folders
		if filename == "etc" then
			for folder in folders
				print("Folder found: " + folder.name)
			end for
			for file in files
				print(file.name + " contents:\n")
				print(file.get_content)
			end for
		else
			for folder in folders
				print("Folder found: " + folder.name)
			end for
			for file in files
				print(file.name + " contents:\n")
				print(file.get_content)
			end for
		end if
	else
		print("Contents:\n" + result.get_content)
		return 1
	end if

else if typeof(result) == "number" then
	print("\n")
	return 1

else
	print("Error: expected shell, file, computer, or int, obtained: " + result)
	return 0
end if
end function

displayDatabaseContents = function(file)
    file_deserialized = deserialize_astm(file)
    info = "INDEX TYPE PRIVILEGE REQS PORT IP"

    for row in file_deserialized
    	index = row[0]
    	type = row[1]
    	privilege = row[2]
    	reqs = row[7]
    	ip = row[4]
    	port = row[3]
    
    	info = info + "\n" + index + " " + type + " " + privilege + " " + reqs + " " + port + " " + ip
    end for

    colorless_info = format_columns(info)
    color_info = colorless_info.replace("Shell", "<color=#27F53F>Shell</color>").replace("root", "<color=#27F53F>root</color>").replace("Failed", "<color=#ED2000>Failed</color>").replace("guest", "<color=#C0C0C0>guest</color>").replace("Computer", "<color=#ABC6FF>Computer</color>").replace("File", "<color=#CEEC7A>File</color>").replace("Other", "<color=#FF46E0>Other</color>").replace("/<color=#27F53F>root</color>", "/root")
    print(color_info)
end function

tryPullFile = function(file, hostShell, remote_path)

	print("Uploading: " + file + "...")
	uploadSuccess = hostShell.scp(file, remote_path, g.stack[0].object, 1)
	if uploadSuccess != 1 then
		print("Error uploading: " + file + uploadSuccess)
	end if
end function

//For uploading libraries after a root shell hack.
tryPullLib = function(libPath, hostShell)
    baseShell = g.stack[0].object
	currentPath = current_path

	print("Uploading: " + libPath + "...")
	uploadSuccess = hostShell.scp(libPath, "/lib", baseShell, 1)
	if uploadSuccess != 1 then
		print("Error uploading: " + libPath + " to /lib, trying current path...")
		retryUpload = hostShell.scp(libPath, currentPath, baseShell, 1)
		if retryUpload == 1 then
			print("Successfully uploaded " + libPath + " to current path.")
		else
			print("Failed to upload " + libPath + " to current path.")
		end if
	end if

end function

tryDownloadToPath = function(current_session, parameters_list)
    if parameters_list.len != 2 then
        print("Useage: [file to download from] [destination on host pc]")
        return 0
    end if

    filePath = parameters_list[0]
    hostDestination = parameters_list[1]
    hostShell = g.stack[0].object
    currentShell = current_session.object

    downloadSuccess = currentShell.scp(filePath, hostDestination, hostShell, 0)
    if downloadSuccess != 1 then
        print("Error downloading " + filePath)
        return 0
    
    else if downloadSuccess == 1 then
        print("File downloaded.")
    end if
end function

//Takes string filepath and filepath location on host pc.
tryTakeFile = function(file_location, destination_location, current_session)
    currentShell = current_session.object
    currentComputer = currentShell.host_computer
    hostShell = g.stack[0].object
    hostComputer = hostShell.host_computer
    file = currentComputer.File(file_location)
    destination = hostComputer.File(destination_location)

    if file == null then
        print("File path not found on remote PC.")
        return 0

    else if destination == null then
        print("Destination path not found on host PC.")
        return 0

    else
        downloadSuccess = currentShell.scp(file_location, destination_location, hostShell, 0)
        if downloadSuccess != 1 then
            print("Error downloading " + file_location)
            return 0
        
        else if downloadSuccess == 1 then
            return 1
        end if
    end if

end function

//Returns string with path if successful, 0 if not.
usablePathForUser = function(user, current_session)
    currentShell = current_session.object
    currentComputer = currentShell.host_computer

    if user == "guest" then
        return "/home/guest"

    else if user == "root" then
        return "/root"

    else if user == "unknown" then
        findUser = getUserFromHandler(currentComputer)
        if findUser == "unknown" then
            //Try root, home, guest, libs, bin, etc, var, user folders. If none, fail.
            options = ["/root", "/home", "/home/guest", "/lib", "/bin", "/var", "/usr/bin", "/boot"]
            users = currentComputer.File("/home").get_folders()

            //Adding user accounts to options.
            for user in users
                options.push("/home/" + user)
            end for

            for option in options
                optionFile = currentComputer.File(option)
                if optionFile != null and optionFile.has_permission("wx") then
                    return optionFile
                else
                    continue
                end if
            end for
            print("Couldn't find usable directory for jump.")
            return 0
        end if

    //User   
    else
        realUser = getUserFromHandler(currentComputer)
        return "/home/" + realUser
    end if
end function

initializeJumpFile = function(currentShell, touchPath, jumptext)
    currentComputer = currentShell.host_computer

    if touchPath != 0 then
        //Returns 1 on success, string on failure.
        jumpPresentTest = currentComputer.File(touchPath + "/jump.src")
        if typeof(jumpPresentTest) == "file" then
            jumpPresentTest.delete
        end if

        touchResult = currentComputer.touch(touchPath, "jump.src")
        if typeof(touchResult) != "string" then
            //Returns empty string on success, full on failure.
            jumpFile = currentComputer.File(touchPath + "/jump.src")

            if typeof(jumpFile) == "file" then
                contentResult = jumpFile.set_content(jumptext)

                if contentResult != 0 then
                    buildResult = currentShell.build(touchPath + "/jump.src", touchPath)
                    if buildResult == "" then
                        return 1

                    else
                        print("Error while building jump file: " + buildResult)
                        return 0
                    end if
                else
                    print("Failed to write to jump file at: " + touchPath)
                    return 0
                end if

            else
                print("Failed to locate jump file at: " + touchPath + "\n" + touchResult)
                return 0
            end if
        else
            print("Failed to create jump file in: " + touchPath + "\n" + touchResult)
            return 0
        end if
    else
        print("Failed to find usable path for jump file.")
        return 0
    end if
end function

//Either called via sudo, or jump. Sudo takes 2 parameters, jump takes none.
//file_type is a string.
jumpFile = function(current_session, parameters_list, file_type)
    if parameters_list.len != 2 and parameters_list.len != 0 and parameters_list.len != 1 then
        print("Error: Invalid parameters for jump file.")
        return 0
    end if

    currentShell = current_session.object
    currentComputer = currentShell.host_computer
    //file_type_selector is 0 for sudo, 1 for jump, 2 for lan nmap.
    file_type_selector = 0

    if file_type == "sudo" then
        if parameters_list.len == 2 then
            g.jumpuser = parameters_list[0]
            g.jumppass = parameters_list[1]
            g.return_session = null
            g.returned_user = null
        else
            print("Error: Invalid parameters for sudo jump file.")
            return 0
        end if

    else if file_type == "jump" then
        if parameters_list.len == 0 then
            g.session_metax = null
            g.session_router = null
            file_type_selector = 1
        else
            print("Error: Invalid parameters for jump file.")
            return 0
        end if

    else if file_type == "nmaplan" then
        if parameters_list.len == 1 then
            g.deviceports = null
            g.lan_nmap_ip = parameters_list[0]
            g.lan_router = current_session.router
            file_type_selector = 2
        else
            print("Error: Invalid parameters for nmap lan jump file.")
            return 0
        end if

    else if file_type == "rshellsetup" then
        file_type_selector = 3

    else if file_type == "rshellstop" then
        file_type_selector = 4

    else if file_type == "sshsetup" then
        file_type_selector = 5

    else if file_type == "sshstop" then
        file_type_selector = 6
end if

    jumptext = "
    g = get_custom_object()
    g.return_session = null
    username = g.jumpuser
    password = g.jumppass
    loginShell = get_shell(username, password)

    if loginShell == null then
        print(""Login failed."")
        return 0

    else if typeof(loginShell) == ""shell"" then
        print(""Login successful."")
        g.return_session = loginShell
        g.returned_user = g.jumpuser
        return 1
    end if"

    objectGrabText = "
    g = get_custom_object()
    g.session_metax = null
    g.session_router = null
    metax = include_lib(""/lib/metaxploit.so"")
    routerObj = get_router()

    if metax != null then
        g.session_metax = metax
        print(""Obtained metax for session"")
        
    else
        print(""Unable to load metaxploit from /lib"")

    end if
    
    if routerObj != null then
        g.session_router = routerObj
        print(""Obtained router for session"")

    else
        print(""Unable to get router for session"")

    end if

    return 1
    "

    lanNmapText = "
    g = get_custom_object()
    lan_ip = g.lan_nmap_ip
    if get_router(lan_ip) != null then
      router = get_router(lan_ip)
      g.lan_router = router


   else
      router = get_router
      g.lan_router = router
   end if

    g.deviceports = router.device_ports(lan_ip)
    if g.deviceports != null then
        return 1

    else
        print(""No local ports obtained"" + g.deviceports)
        return 0
    end if
    "

    rshellImportText = "
    rshelld = include_lib(""/lib/librshell.so"")
    if not rshelld then
        rshelld = include_lib(current_path + ""/librshell.so"")
    end if
    if not rshelld then exit(""Error: Missing librshell.so library in the /lib path or the current folder"")

    output = rshelld.install_service
    if output != true then exit(output)
    print(""rshell setup successful\n<b>Type 'Browser.exe "" + get_router.local_ip + "":8080' to access the router configuration to make sure the service is accessible</b>"")"

    rshellStopText = "
    rshelld = include_lib(""/lib/librshell.so"")

    if not rshelld then exit(""Error: Missing librshell.so library in the /lib path or the current folder"")
    output = rshelld.stop_service
    if output != true then exit(output)
    print(""rshell service stopped"")"

    sshImportText = "
    sshd = include_lib(""/lib/libssh.so"")
    if not sshd then
        sshd = include_lib(current_path + ""/libssh.so"")
    end if
    if not sshd then exit(""Error: Missing libssh.so library in the /lib path or the current folder"")
    output = sshd.install_service
    if output != true then exit(output)
    print(""ssh setup successful\n<b>Type 'Browser.exe "" + get_router.local_ip + "":8080' to access the router configuration to make sure the service it's accessible</b>"")"

    sshStopText = "
    sshd = include_lib(""/lib/libssh.so"")

    if not sshd then exit(""Error: Missing librssh.so library in the /lib path or the current folder"")
    output = sshd.stop_service
    if output != true then exit(output)
    print(""ssh service stopped"")"

    //Placement logic. Find placement opportunity for jump file.
    touchPath = usablePathForUser(current_session.user, current_session)
    if touchPath != 0 then
        //Test if jump is already there, if so, delete it then continue
        jumpPresentTest = currentComputer.File(touchPath + "/jump.src")
        if typeof(jumpPresentTest) == "file" then
            jumpPresentTest.delete
        end if

        //Make the empty jump file, then use logic to device what kind of jump file we asked for.
        touchResult = currentComputer.touch(touchPath, "jump.src")
        if typeof(touchResult) != "string" then
            //Returns empty string on success, full on failure.
            jumpFile = currentComputer.File(touchPath + "/jump.src")

            if typeof(jumpFile) == "file" then
                if file_type_selector == 0 then
                    buildResult = initializeJumpFile(currentShell, touchPath, jumptext)

                else if file_type_selector == 1 then
                    buildResult = initializeJumpFile(currentShell, touchPath, objectGrabText)

                else if file_type_selector == 2 then
                    buildResult = initializeJumpFile(currentShell, touchPath, lanNmapText)

                else if file_type_selector == 3 then
                    buildResult = initializeJumpFile(currentShell, touchPath, rshellImportText)

                else if file_type_selector == 4 then
                    buildResult = initializeJumpFile(currentShell, touchPath, rshellStopText)

                else if file_type_selector == 5 then
                    if currentComputer.File("/lib/libssh.so") == null then
                        print("No /lib/libssh.so found, attempting upload...")
                        uploadResult = currentShell.scp("/lib/libssh.so", "/lib", g.stack[0], 1)
                        if uploadResult != 1 then
                            print("Failed to upload libssh.so: " + uploadResult)
                            return 0
                        else
                            print("libssh.so uploaded, continuing...")
                        end if
                    end if
                    buildResult = initializeJumpFile(currentShell, touchPath, sshImportText)

                else if file_type_selector == 6 then
                    buildResult = initializeJumpFile(currentShell, touchPath, sshStopText)

                end if

                    if buildResult == 1 then
                        launchResult  = currentShell.launch(touchPath + "/jump")
                        jumpExe = currentComputer.File(touchPath + "/jump")
                        jumpExe.delete
                        jumpFile.delete

                        //Sudo outcome
                        if file_type_selector == 0 then
                            if launchResult == 1 then
                                //Failed login
                                if g.return_session == null then
                                    return 0

                                //Login success
                                else
                                    gainedSession = createSession(g.return_session, g.returned_user)
                                    addSession(gainedSession)
                                    return 1
                                end if

                            else
                                print("Error while launching jump file at: " + touchPath + "\n" + buildResult)
                                return 0
                            end if
                        
                        //Jump outcome
                        else if file_type_selector == 1 then
                            if g.session_metax != null then
                                current_session.metax = g.session_metax
                            end if

                            if g.session_router != null then
                                current_session.router = g.session_router
                            end if

                            return 1

                        else if file_type_selector == 2 then
                            if g.deviceports != null and typeof(g.deviceports) != string then
                                return 1             
                            else
                                return 0
                            end if

                        else if file_type_selector == 3 or file_type_selector == 4 or file_type_selector == 5 or file_type_selector == 6 then
                            gateway = currentComputer.network_gateway
                            if typeof(currentComputer.File("/usr/bin/Browser.exe")) == "file" then
                                currentShell.launch("usr/bin/Browser.exe", gateway + ":8080")
                                return 1
                            else
                                print("Unable to find /usr/bin/Browser.exe")
                            end if
                        end if
                    end if
                else
                    print("Failed to find empty jump file at " + touchPath)
                    return 0
                end if
            else
                print("Failed to create file via touch at " + touchPath)
                return 0
            end if
        else
            print("Failed to create a usable jump path.")
            return 0
        end if
end function

tryDeleteFile = function(file_path, computer)
if computer.File(file_path) != null then
        successOrFail = computer.File(file_path).delete
        if successOrFail.len > 0 then
            print("Error while deleting " + file_path + ": " + successOrFail)
        
        else
            print("Deleted " + file_path)
        end if
    end if
end function

getUsers = function(computer)
users = computer.File("/home").get_folders
if users.len == 0 then
	print("No user accounts found.")
    return []
else
	return users
end if
end function

//Permissions includes the type. Ex: "g+rwx"
tryChmod = function(file, permission_string, recursion_int)
    if file != null then
        chmodResult = file.chmod(permission_string, recursion_int)
    else
        print("A file not found ")
        return 0
    end if

    if chmodResult != "" then
        print("Failed to apply permissions to " + file.name)
        return 0
    else
        return 1
    end if
end function

//Make another secure function to bring secure libs from /root/securelibs
secure = function(current_session, parameters_list)
    if parameters_list.len != 1 or parameters_list[0] == "-h" or parameters_list[0] == "--help" then 
        print("<b>Usage: "+program_path.split("/")[-1]+" [home or server or prepare]</b>")
        return 0
    end if

    homeOrServer = parameters_list[0]
    computer = current_session.object.host_computer

    if active_user != "root" then
        print("Program can only be ran by the root user.")
        return 0
    end if

    //Lock the system, make an exception for terminal, bash, and sudo, then delete /etc/passwd, home/user/Config files (Bank.txt and Mail.txt), make sure guest user is deleted
    //Exceptions should only be g+x, user settings do not apply since root is owner.
    //passwd is a txt file but does not have the .txt suffix, only /etc/passwd.
    if homeOrServer == "home" or homeOrServer == "Home" then
        rootFile = computer.File("/")
        terminalFile = computer.File("/usr/bin/Terminal.exe")
        bashFile = computer.File("/bin/bash")
        sudoFile = computer.File("/bin/sudo")
        manualFile = computer.File("/usr/bin/Manual.exe")
        mailFile = computer.File("/usr/bin/Mail.exe")
        browserFile = computer.File("/usr/bin/Browser.exe")
        textEditorFile = computer.File("/usr/bin/Notepad.exe")
        settingsFile = computer.File("/usr/bin/Settings.exe")
        adminMonitorFile = computer.File("/usr/bin/AdminMonitor.exe")
        chatFile = computer.File("/usr/bin/Chat.exe")
        users = getUsers(computer)

        rootFile.set_owner("root", 1) //1 is for recursion
        tryChmod(rootFile, "o-rwx", 1) 
        tryChmod(rootFile, "g-rwx", 1)
        tryChmod(rootFile, "u-rwx", 1)
        tryChmod(terminalFile, "g+x", 0)
        tryChmod(bashFile,"g+x", 0)
        tryChmod(sudoFile,"g+x", 0)
        tryChmod(manualFile, "g+x", 0)
        tryChmod(mailFile, "g+x", 0)
        tryChmod(browserFile, "g+x", 0)
        tryChmod(textEditorFile, "g+x", 0)
        tryChmod(settingsFile, "g+x", 0)
        tryChmod(chatFile, "g+x", 0)
        tryChmod(adminMonitorFile, "g+x", 0)

        if computer.File("/home/guest") != null then
            successOrFail = computer.File("/home/guest").delete
            if successOrFail.len > 0 then
                print("Error while deleting guest user: " + successOrFail)
            
            else
                print("Deleted guest user.")
            end if
        end if

        tryDeleteFile("/etc/passwd", computer)
        tryDeleteFile("/root/Config/Mail.txt", computer)
        tryDeleteFile("/root/Config/Bank.txt", computer)

        if users.len > 0 then
            for user in users
                tryDeleteFile("/home/" + user.name + "/Config/Bank.txt", computer)
                tryDeleteFile("/home/" + user.name + "/Config/Mail.txt", computer)
                if computer.File("/home/" + user.name + "/Config/Browser.txt") != null then
                    computer.File("/home/" + user.name + "/Config/Browser.txt").chmod("g+rw")
                end if
            end for
        end if

        print("Secure script finished.")
        return 1


    else if homeOrServer == "server" or homeOrServer == "Server" then
    rootFile = computer.File("/")
        users = getUsers(computer)

        rootFile.set_owner("root", 1) //1 is for recursion
        tryChmod(rootFile, "o-rwx", 1) 
        tryChmod(rootFile, "g-rwx", 1)
        tryChmod(rootFile, "u-rwx", 1)

        if computer.File("/home/guest") != null then
            successOrFail = computer.File("/home/guest").delete
            if successOrFail.len > 0 then
                print("Error while deleting guest user: " + successOrFail)
            
            else
                print("Deleted guest user.")
            end if
        end if

        tryDeleteFile("/etc/passwd", computer)
        tryDeleteFile("/root/Config/Mail.txt", computer)
        tryDeleteFile("/root/Config/Bank.txt", computer)

        if users.len > 0 then
            for user in users
                tryDeleteFile("/home/" + user + "/Config/Bank.txt", computer)
                tryDeleteFile("/home/" + user + "/Config/Mail.txt", computer)
            end for
        end if

        print("Secure script finished.")
        return 1


    else if homeOrServer == "Prepare" or homeOrServer == "prepare" then
        chainsawFile = computer.File("/bin/chainsaw")
        binFile = computer.File("/bin")
        scanLanFile = computer.File("/usr/bin/ScanLan.exe")
        metaxLib = computer.File("/lib/metaxploit.so")
        cryptoLib = computer.File("/lib/crypto.so")
        initLib = computer.File("/lib/init.so")
        sshLib = computer.File("/lib/libssh.so")

        tryChmod(binFile, "g+rwx", 1)
        tryChmod(chainsawFile, "o+rwx", 0)
        tryChmod(scanLanFile, "g+rwx", 0)
        tryChmod(metaxLib, "g+rwx", 0)
        tryChmod(cryptoLib, "g+rwx", 0)
        tryChmod(initLib, "g+rwx", 0)
        tryChmod(sshLib, "g+rwx", 0)

        print("System prepared for action.")
        return 1

    end if
end function

crack = function(parameters_list)
    if parameters_list.len != 1 or parameters_list[0] == "-h" or parameters_list[0] == "--help" then 
        print("<b>Usage: "+program_path.split("/")[-1]+" [encrypted password]</b>")
        return 0
    end if
    crypto = include_lib("/lib/crypto.so")
    	if not crypto then
        	crypto = include_lib(current_path + "/crypto.so")
    	end if
    	if not crypto then 
            print("Error: Can't find crypto library in the /lib path nor the current folder.\n")
            return 0
        end if

    decryptedPass = crypto.decipher(parameters_list[0])

    if decryptedPass != null then
    	print(decryptedPass)
        return 1
    else
    	print("Error processing the hash.\n")
        return 0
    end if
end function

ps = function(current_session)
    if params.len > 0 then 
        print(command_info("ps_usage"))
        return 0
    end if
    output = current_session.object.host_computer.show_procs
    print(format_columns(output))
    return 1
end function

readDatabase = function()
    hostComputer = get_shell.host_computer
    databaseFolder = hostComputer.File("/Databases")
    databases = databaseFolder.get_files()
    
    seq_counter = 1
    for database in databases
    	print("[" + seq_counter + "] " + database.name())
    	seq_counter = seq_counter + 1
    end for
    
    selected_int = user_input("Please select the number of which database to read: ")
    if selected_int == "exit" then
    	print("Exiting program...")
    	return 0
    end if
    
    uneditedContent = databases[selected_int.val - 1].get_content()
    editedContent = uneditedContent.replace("Shell", "<color=#27F53F>Shell</color>").replace("root", "<color=#27F53F>root</color>").replace("Failed", "<color=#ED2000>Failed</color>").replace("guest", "<color=#C0C0C0>guest</color>").replace("Computer", "<color=#ABC6FF>Computer</color>").replace("File", "<color=#CEEC7A>File</color>").replace("Other", "<color=#FF46E0>Other</color>").replace("/<color=#27F53F>root</color>", "/root")
    print(editedContent)
    return 1
end function

checklibs = function(current_session, parameters_list)
    metax = current_session.metax

    if metax == null then
        print("No metaxploit.so lib loaded in current session. Use [jump] to try and load.")
        return 0
    end if

    if parameters_list.len > 0 then
        if parameters_list[0] == "-l" and parameters_list.len == 2 then
            fullLibrary = metax.load(parameters_list[1])
            print(fullLibrary.lib_name + " " + fullLibrary.version)

        else
            print("Proper usage [-l] [path to local lib]")
            return 0
        end if

    else
        hostComputer = current_session.object.host_computer
        libs = hostComputer.File("/lib").get_files

        for lib in libs
            fullLibrary = metax.load("/lib/" + lib.name)
            print(fullLibrary.lib_name + " " + fullLibrary.version)
        end for
    end if
end function

clearAllSessionLogs = function()
index_list = g.stack.indexes

for index in index_list
    clearLog(g.stack[index])
end for
return 1
end function

rshellInterface = function(current_session)
	metaxploit = current_session.metax
	if metaxploit == null then
		print("No metaxploit is loaded for current session, please use [jump]")
		return current_session
	end if

	shells = []
	while shells.len == 0	
        print("Listening for upcoming connections...")
		shells = metaxploit.rshell_server
		if(typeof(shells) == "string") then 
			print(shells)
			return current_session
		end if

		if(shells.len == 0) then 
        wait(2)
        quitOrStay = user_input("Exit?\nY or N: ")
        if quitOrStay.lower == "y" or quitOrStay.lower == "yes" then
            print("Exiting rshell-interface")
            return current_session
        else
            continue
        end if
    end if
	end while

	option = 0
	while typeof(option) != "number" or (option < 1 or option > shells.len)
		print(shells.len + " shell(s) connected!\n<b>Select a shell to start a terminal:</b>")
		for i in range(0, shells.len - 1)
			print("\n<b>Shell (" + (i + 1) + ")</b>\nPublic IP: " + shells[i].host_computer.public_ip + "\nLocal IP: " + shells[i].host_computer.local_ip)
		end for
		print("-----------")
		optionRaw = user_input("Select shell>")
		if optionRaw == "exit" or optionRaw == "Exit" then
			print("Exiting program...")
			return current_session
		else
			option = optionRaw.to_int
		end if
	end while
	print("Starting shell #" + option)
	selectedShell = shells[option - 1]
    shellComputer = selectedShell.host_computer
    user = getUserFromHandler(shellComputer)
    rshellSession = createSession(selectedShell, user)
    addSession(rshellSession)
    return rshellSession
end function

start_rshell_client = function(current_session, parameters_list)
    if parameters_list.len != 1 then
        print("Usage: rshell-client [rshell server IP address]")
        return 0
    end if

    rshell_ip = parameters_list[0]
    metax = current_session.metax
	if not metax then
		print("No metax loaded for this session, use [jump] to load.")
		return 0
	end if

    successOrFailure = metax.rshell_client(rshell_ip, 1222, "Xorg")
    if successOrFailure == 1 then
        return 1
    else
        print("Error: Unable to setup " + successOrFailure)
        return 0
    end if
end function

start_sniffer = function(current_session)
	metaxploit = current_session.metax
	if not metaxploit then
		print("No metax loaded for this session, use [jump] to load.")
		return 0
	end if
	print("Starting listener...\nWaiting for incoming data.")
	output = metaxploit.sniffer(1)

	if not output then
		print("Unknown error: can't start listener")
		return 0
	end if
	print(output)
    return 1
end function

openTxt = function()
    hostShell = g.stack[0].object
    hostComputer = hostShell.host_computer
    file = hostComputer.File("/root/mission.txt")

    if  file == null then
        hostComputer.touch("/root", "mission.txt")
        hostShell.launch("/usr/bin/Notepad.exe", "/root/mission.txt")

    else
        hostShell.launch("/usr/bin/Notepad.exe", "/root/mission.txt")
    end if
end function

//Adds computer name, public IP, and password to a tracking file in csv format, ended by a newline character.
//sshConnected is a bool, true or false. Using [track] will let you choose false or true, using [ssh] sets it to true.
addToTracking = function(session, password, sshConnected)
    hostShell = g.stack[0].object
    hostComputer = hostShell.host_computer
    databasesPresent = hostComputer.File("/Databases")
    trackingPresent = hostComputer.File("/Databases/tracking.dat")
    currentIP = session.publicAddress
    currentName = session.computerName
    writeString = ""

    if databasesPresent == null then
        hostComputer.create_folder("/", "Databases")
        print("Created /Databases")
    end if

    if trackingPresent == null then
        hostComputer.touch("/Databases", "tracking.dat")
        print("Created /Databases/tracking.dat")
        trackingPresent = hostComputer.File("/Databases/tracking.dat")
    end if
    
    if trackingPresent == null then
        print("Error: tracking.dat not found: " + trackingPresent)
        return 0
    end if

    if sshConnected != "true" then
        sshConnected = "false"
    end if

    presentInTracking = checkForTrackingEntry(currentName, currentIP, password, sshConnected)
    if presentInTracking == 1 then
        print("Session already tracked.")
        return 0
    end if

    writeString = currentName + "," + currentIP + "," + password + "," + sshConnected + "\n"
    currentContents = trackingPresent.get_content
    appendedContents = currentContents + writeString
    writeResult = trackingPresent.set_content(appendedContents)

    if writeResult == null or typeof(writeResult) == "string" then
        print("Error while writing to /Databases/tracking.dat " + writeResult)
        return 0
    end if
    print("Added " + currentName + " to tracking database.")
    return 1
end function

//1 for if duplicate, 0 if not. Will allow for a new entry if the old one wasn't ssh connected.
checkForTrackingEntry = function(computerName, publicIP, password, sshConnection)
    unpackedLines = unpackTracking()
    for line in unpackedLines
        lineEntries = line.split(",")
        currentName = lineEntries[0]
        currentIP = lineEntries[1]
        currentPassword = lineEntries[2]
        currentSSH = lineEntries[3]

        if currentName == computerName and publicIP == currentIP and currentPassword == password then
            if currentSSH == "false" and sshConnection == "true" then
                return 0
            else
                return 1
            end if
        end if
    end for
    return 0
end function

unpackTracking = function()
    hostComputer = g.stack[0].object.host_computer

    tracking = hostComputer.File("/Databases/tracking.dat")
    trackingLines = tracking.get_content.split("\\n")
    return trackingLines[:-1]
end function

showTrackingOptions = function()
    unpackedLines = unpackTracking()

    index = 0
    for line in unpackedLines
        lineEntries = line.split(",")
        currentName = lineEntries[0]
        currentIP = lineEntries[1]
        currentPassword = lineEntries[2]
        currentSSH = lineEntries[3]

        printString = index + ": <color=#F79B11>" + currentName + "</color> <color=#E66AFF>" + currentIP + "</color> " + currentPassword + " " + currentSSH

        print(printString)
        index = index + 1
    end for
end function

selectSSHTrackingOptions = function()
    sshLinesList = []
    unpackedTracking = unpackTracking()
    if unpackedTracking.len == 0 then
        print("No connections currently being tracked.")
        return 0
    end if

    index = 0
    for line in unpackedTracking
        lineEntries = line.split(",")
        currentName = lineEntries[0]
        currentIP = lineEntries[1]
        currentPassword = lineEntries[2]
        currentSSH = lineEntries[3]

        if currentSSH == "true" then
            sshLinesList.push(line)
            printString = index + ": <color=#F79B11>" + currentName + "</color> <color=#E66AFF>" + currentIP + "</color> " + currentPassword
            print(printString)
            index = index + 1

        else
            continue
        end if
    end for

    if sshLinesList.len == 0 then
        print("No ssh available connections tracked.")
        return 0
    end if

    //selection mechanism
    user_selection = user_input("Select an index: ").to_int
    if typeof(user_selection) != "number" then
        print("Invalid selection: index must be a number.")
        return 0
    end if

    new_index = 0
    for line in sshLinesList
        if new_index == user_selection then
            return line.split(",")
        else
            new_index = new_index + 1
        end if
    end for
    print("Index not found")
    return 0
end function

//Returns the delimited line as a list. index 0 is name, 1 is ip, 2 is password, 3 is ssh status.
//Or returns 0 is failed.
selectTrackingOption = function()
    showTrackingOptions()
    user_selection = user_input("Select an index: ").to_int
    if typeof(user_selection) != "number" then
        print("Invalid selection: index must be a number.")
        return 0
    end if

    index = 0
    for line in unpackTracking()
        if index == user_selection then
            return line.split(",")
        else
            index = index + 1

        end if
    end for
    print("Index not found")
    return 0
end function

//Will display the lan ips connected and let you choose one.
bounceHack = function(ip, metaLib, memory_address, overflow_value)
router = get_router(ip)
lan_addresses = router.devices_lan_ip

index_counter = 0
for address in lan_addresses
    print(index_counter + ": " + address)
    index_counter = index_counter + 1
end for

selected_index = user_input("Select an index to target: ").to_int

if typeof(selected_index) != "number" or lan_addresses.hasIndex(selected_index) == 0 then
    print("Invalid index given, exiting...")
    return 0
end if

lan_address = lan_addresses[selected_index]
result = metaLib.overflow(memory_address, overflow_value, lan_address)

//Computer submenu
    if typeof(result) == "computer" then
	print("Obtained access to computer: " + result.get_name)
	while(true)
		user_answer = user_input("\nPlease pick a subroutine:\n(1)Print user accounts\n(2)Crack passwords\n(3)Get Bank/Email\n(4)Get file/folder contents\n(5)Change password\n(6)Delete a file\n(7)Clear log\n(8)Corrupt system\n(9)Create guest user\n(10)Exit\nInput an integer: ")
		answer = user_answer.val
		print("\n")

		if answer == 1 then
			printUsers(result)

		else if answer == 2 then
			checkPassword(result)
		
		else if answer == 3 then
			printPassEmails(result)

		else if answer == 4 then
			filePath = user_input("Input file/folder path to print: ", 0, 0, 1)
			filePathExists = result.File(filePath)

			if filePathExists == null then 
				print("File/Folder not found.")
				continue

			else if filePathExists.is_folder == 1 then
				print("Permissions: " + filePathExists.permissions)
				printFolderContents(result, filePath)

			else
				print("Permissions: " + filePathExists.permissions)
				printFile(result, filePath)
			end if

		else if answer == 5 then
			passResult = result.change_password("root", "swagger")
            if typeof(passResult) == "string" or passResult == null then
                print("Failed to change password: " + passResult)
            else
                print("Password changed to 'swagger'")
            end if

		else if answer == 6 then
			deleteFilePath = user_input("Input file path to delete: ", 0, 0, 1)
			deleteFile = result.File(deleteFilePath)

			if deleteFile == null then
				print("File not found")

			else if deleteFile.has_permission("w") != 1 then
				print("User does not have write permissions.")
				
			else
				deleteFile = deleteFile.delete
				deleteResult = deleteFile.delete
				if deleteResult.len == 0 then
					print("File deleted successfully.")

				else
					print("Error while deleting file: " + deleteResult)

				end if
			end if

		else if answer == 7 then
			corruptLog(result)

		else if answer == 8 then
			corruptSystem(result)

		else if answer == 9 then
			accountCreateResult = result.create_user("guest2", "Bonzai")
			if accountCreateResult == 1 then
				print("User guest2@Bonzai created")

			else
				print("Failed to create new user: " + accountCreateResult)
			end if

		else if answer == 10 then
			print("Exiting program...")
			return 1

		else
			print("Invalid selection.")

		end if
	end while

else if result == 0 then
    return 0

else
    print("Non-computer object obtained: " + result)
    return 0
end if
end function

doLog = function(parameters_list, current_session)
    if parameters_list.len > 1 then
        print("Usage: Log or Log [dl] or log[dr]")
        return 0
    end if

    currentShell = current_session.object
    currentComputer = currentShell.host_computer
    hostShell = g.stack[0].object
    hostComputer = hostShell.host_computer
    download = false
    viewDownload = false
    logViewer = currentComputer.File("/usr/bin/LogViewer.exe")
    logFile = currentComputer.File("/var/system.log")

    if parameters_list.len > 0 and parameters_list[0] == "dl" then
        download = true

    else if parameters_list.len > 0 and parameters_list[0] == "dr" then
        viewDownload = true
    end if

    if download == false then

        if logViewer == null then
            print("Error: cannot access LogViewer.exe")
            return 0

        else
            if viewDownload == false then
                currentShell.launch("usr/bin/LogViewer.exe")
                return 1

            else if viewDownload == true then
                filePresent = hostComputer.File("/var/Downloads/system.log")
                if filePresent == null then
                    print("No downloaded log to read.")
                    return 0

                else
                    hostShell.launch("usr/bin/LogViewer.exe", "/var/Downloads/system.log")
                    return 1
                end if
            end if
        end if

    else if download == true then

        if  logFile == null then
            print("Error: cannot access log file.")
            return 0

        else
            if hostComputer.File("/var/Downloads") == null then
                hostComputer.create_folder("/var", "Downloads")
                print("/var/Downloads created...")
            end if

            takeResult = tryTakeFile("/var/system.log", "/var/Downloads", current_session)
            if takeResult == 1 then
                print("Log downloaded.")
                return 1

            else
                print("Failed to download log.")
                return 0
            end if
        end if
    end if


end function

getUsersNet = function(comp)
    homeFile = comp.File("/home")
    result = homeFile.get_folders
    return result
end function

searchEmails = function(computers)
for comp in computers
    users = getUsersNet(comp)
    for user in users
        emailFile = comp.File("/home/" + user.name + "/Config/Mail.txt")
        if emailFile == null then
            print("No email found for user " + user.name + " on pc " + comp.local_ip + "\n")
        else
            print("Email from " + comp.local_ip + " user: " + user.name + "\n" + emailFile.get_content + "\n")
        end if
    end for
end for
end function

searchBanks = function(computers)
for comp in computers
    users = getUsersNet(comp)
    for user in users
        emailFile = comp.File("/home/" + user.name + "/Config/Bank.txt")
        if emailFile == null then
            print("No bank found for user " + user.name + " on pc " + comp.local_ip + "\n")
        else
            print("Bank from " + comp.local_ip + " user: " + user.name + "\n" + emailFile.get_content + "\n")
        end if
    end for
end for
end function

searchPasswords = function(computers)
for comp in computers
    result = comp.File("/etc/passwd")
    if result == null then
        print("Passwd file not found for comp: " + comp.local_ip + "\n")
    else
        print("Passwords from " + comp.local_ip + ":\n" + result.get_content + "\n")
    end if
end for
end function

//Hacks computers connected to a router.
//Make it reach for a poison lib in /root/poison
nethack = function(current_session)
    if current_session.router != null then
        router = current_session.router
    else
        print("Error: No router loaded. Use [jump] to load router for this session.")
        return 0
    end if
    if current_session.metax != null then
        metax = current_session.metax
    else
        print("Error: No metaxploit.so lib loaded. Use [jump] to load metax for this session.")
        return 0
    end if

    routerShell = current_session.object
    routerComputer = routerShell.host_computer
    
    lib = "/lib/init.so"
    libVersion = "1.0.4"
    mem_value = "0x3A986814"
    vuln_value = "dividen"
    libFolder = routerComputer.File("/lib")
    fullLib = routerComputer.File("/lib/init.so")
    
    devicesLanIP = router.devices_lan_ip
    
    //Check for access to /lib, check for init.so version, if version is not the hard-coded one, then upload the poison version. Then load into metalib and overflow away.
    if not libFolder.has_permission("w") then
        print("No local write permissions to /lib. Exiting...")
        return 0
    end if
    
    if fullLib == null or metax.load(lib).version != libVersion then
        tryPullLib(lib, routerShell)
    end if
    
    //Begin attack.
    metalib = metax.load(lib)
    
    computers = []
    for device in devicesLanIP
        comp = metalib.overflow(mem_value, vuln_value, device)
        if comp then computers.push(comp)
    end for
    
    print("\nObtained computers: ")
    for comp in computers
        print(comp.local_ip)
    end for
    
    //Result submenu.
    while(true)
    selection = user_input("\nSelect a subroutine:\n(1)Print emails\n(2)Print bank information\n(3)Search for passwords\n(4)Exit\nInput an integer: ").val
    
    if selection == 1 then
        searchEmails(computers)
    
    else if selection == 2 then
        searchBanks(computers)
    
    else if selection == 3 then
        searchPasswords(computers)
    
    else if selection == 4 then
        print("Exiting program...")
        return 1
    else
        print("Invalid input given. Please only input an integer between 1 and 4.")
    end if
    end while
end function



//Program starts.
//Don't bother adding computers and files to stack currently, just shells. Can modify for computers later, just keep submenu for now.
baseComputer = get_shell.host_computer
hostSession = createSession(get_shell, active_user)
addSession(hostSession)
current_session = g.stack[0] //need to be careful, some commands require shells.
current_session.router = get_router()
loadMetax(current_session)

while(true)
    computer_name = ""
    if current_session.type == "Shell" or current_session.type == "Computer" then
        computer_name = current_session.computerName
    else
        computer_name = "File"
    end if
    //For getting the real name of the host in case user used a cached hack which contained a different user's name.
    sessionComputer = current_session.object.host_computer
    realUser = getUserFromHandler(sessionComputer)
    if realUser == "unknown" then
        realUser = current_session.user
    end if

    print("\n<color=#F79B11>" + realUser + "@" + current_session.computerName + "</color>:<color=#C1FDFF>" + current_path +"</color>--(<color=#E66AFF>" + current_session.publicAddress + "</color>)-" + "-(<color=#FA5D91>" + current_session.lanAddress + "</color>)--" + "[<color=#27F53F>" + current_session.type + "</color>]")
    command_input = user_input("~$ ", 0, 0, 1).split(" ")

    command = command_input[0].lower
    parameters_list = command_input[1:]
    parameters = parameters_list.join(" ")

    if command == "swap" then
        if parameters_list.len == 0 then
            presentSessions()
            selected_session = user_input("Select which session: ").to_int
            current_session = swapSession(selected_session, current_session)
        else if parameters_list.len == 1 then
            index = parameters_list[0].to_int
            current_session = swapSession(index, current_session)
        
        else
            print("Usage: Swap or Swap [session index]")
        end if

    else if command == "createcache" then
        createCache(current_session, parameters_list)

    else if command == "testdatabase" then
        testDatabase(current_session, parameters_list)
   
    else if command == "hack" then
        result = targetedHack(current_session, parameters_list)
        if typeof(result) == "map" then
            session_index = getSessionIndex(result)
            current_session = swapSession(session_index, current_session)
        end if

    else if command == "connect" then
        new_index = connect(current_session)
        current_session = swapSession(new_index, current_session)
        if current_session.object.host_computer.File("/lib/metaxploit.so") == null then
                tryPullLib("/lib/metaxploit.so", current_session.object)
            end if
            jumpFile(current_session, parameters_list, "jump")
            current_session = updateSession(current_session)

    else if command == "take" then
        tryDownloadToPath(current_session, parameters_list)

    else if command == "pull" then
        if parameters_list.len != 2 then
            print("Usage: [host PC filepath] [remote PC destination]")
        else
            target_file = parameters_list[0]
            fileLocation = parameters_list[1]
            hostShell = current_session.object
            tryPullFile(target_file, hostShell, fileLocation)
        end if

    else if command == "sl" then
        if sessionComputer.File("/usr/bin/ScanLan.exe") == null then
            tryPullFile("/usr/bin/ScanLan.exe", current_session.object, "/usr/bin")
        end if
        current_session.object.launch("/usr/bin/ScanLan.exe")

    else if command == "libs" then
            hostShell = current_session.object
            tryPullLib("/lib/metaxploit.so", hostShell)
            tryPullLib("/lib/crypto.so", hostShell)
            tryPullLib("/lib/librshell.so", hostShell)

    else if command == "nmap" then
        if parameters_list.len != 1 then
            print("Usage: [public IP]")

        else
            doNmap(parameters_list[0], current_session)
        end if

    else if command == "findpass" then
        passwordFile = current_session.object.host_computer.File("/etc/passwd")
        if passwordFile != null then
            print(passwordFile.get_content)
        else
            print("No passwd file found at /etc/passwd")
        end if

    else if command == "findmail" then
        currentComputer = [current_session.object.host_computer]
        searchEmails(currentComputer)

    else if command == "findbank" then
        currentComputer = [current_session.object.host_computer]
        searchBanks(currentComputer)

    else if command == "checklibs" then
        checklibs(current_session, parameters_list)

    else if command == "readdatabase" then
        readDatabase()

    else if command == "crack" then
        crack(parameters_list)

    else if command == "txt" then
        openTxt()

    else if command == "secure" then
        secure(current_session, parameters_list)

    else if command == "nethack" then
        nethack(current_session)

    else if command == "sniffer" then
        start_sniffer(current_session)

    else if command == "admon" then
        launchResult = g.stack[0].object.launch("/usr/bin/AdminMonitor.exe")
        if launchResult != 1 then
            print("Failed to launch AdminMonitor.exe from /usr/bin")
        end if

    else if command == "log" then
        doLog(parameters_list, current_session)

    else if command == "ps" then
        ps(current_session)

    else if command == "rshell-server" then
        if parameters_list.len != 0 then
            print("Usage: rshell-server")
        else
            jumpFile(current_session, parameters_list, "rshellsetup")
        end if

    else if command == "rshell-stop" then
        if parameters_list.len != 0 then
            print("Usage: [stop-rshell]")
        else
            jumpFile(current_session, parameters_list, "rshellstop")
        end if

    else if command == "rshell-interface" then
        rshellSession = rshellInterface(current_session)
        current_session = rshellSession

    else if command == "rshell-client" then
        start_rshell_client(current_session, parameters_list)

    else if command == "ssh-server" then
        if parameters_list.len != 0 then
            print("Usage: ssh-server")
        else
            jumpFile(current_session, parameters_list, "sshsetup")
        end if

    else if command == "ssh-stop" then
        if parameters_list.len != 0 then
            print("Usage: ssh-server")
        else
            jumpFile(current_session, parameters_list, "sshstop")
        end if

    else if command == "corrupt-system" then
        systemComputer = current_session.object.host_computer
        hostComputer = g.stack[0].object.host_computer
        if systemComputer.local_ip == hostComputer.local_ip and systemComputer.public_ip == hostComputer.public_ip then
            print("Ipsum unable to corrupt the host system.")
        else
            decision = user_input("Are you sure you want to corrupt\ncomputer name: " + systemComputer.get_name + "\npublic IP: " +systemComputer.public_ip + "\nlan IP: " + systemComputer.local_ip + "\nY or N: ")
            if decision.lower == "yes" or decision.lower == "y" then
                current_index = findIndexOfSession(current_session)
                current_session = swapSession(current_index - 1, current_session)
                deleteSession(current_index)
                corruptSystem(systemComputer)
            else
                print("Cancelling corruption call.")
            end if
        end if

    else if command == "jump" then
        if parameters_list.len != 0 then
            print("Usage: jump")

        else if parameters_list.len == 0 then
            if current_session.object.host_computer.File("/lib/metaxploit.so") == null then
                tryPullLib("/lib/metaxploit.so", current_session.object)
            end if
            jumpFile(current_session, parameters_list, "jump")
            current_session = updateSession(current_session)
        end if

    //Can use password cracker for root password. Takes username password.
    else if command == "sudo" then
        if parameters_list.len != 2 then
            print("Usage: [username] [password]")
        
        else if parameters_list.len == 2 then
            jumpFile(current_session, parameters_list, "sudo")
            current_session = updateSession(current_session)
        end if

    else if command == "ssh" then
        if parameters_list.len != 1 and parameters_list.len != 2 then
            print("Usage: ssh [user@password] [public ip] or ssh list")
        else
            if parameters_list[0].lower == "list" and parameters_list.len == 1 then
                trackingInfoList = selectSSHTrackingOptions()
                if trackingInfoList == 0 then
                    print("Unable to connect.")
                else
                    sshResult = trackingSSH(trackingInfoList, current_session)
                    current_session = sshResult
                end if


            else
                sshResult = internalSSH(parameters_list, current_session)
                current_session = sshResult
            end if
        end if
    
    else if command == "smtp-users" then
        smtp_users(parameters_list)

    else if command == "track" then
        if parameters_list.len != 2 and parameters_list.len != 1 then
            print("Usage: [list] or [password] [ssh connection available true or false]")

        else if parameters_list[0].lower == "list" then
            showTrackingOptions()

        else
            password = parameters_list[0]
            sshConnected = parameters_list[1]
            addToTracking(current_session, password, sshConnected)
        end if

    else if command == "remind" then
        remind(current_session)

    else if command == "clearsessions" then
        clearAllSessionLogs()
        clearStack()
        addSession(hostSession)
        current_session = hostSession
        print("Sessions cleared.\n")

    else if command == "delsession" then
        presentSessions()
        selected_session = user_input("Select which session: ").to_int
        if g.stack.hasIndex(selected_session) then
            clearLog(g.stack[selected_session])
            if g.stack[selected_session].publicAddress == current_session.publicAddress and g.stack[selected_session].lanAddress == current_session.lanAddress then
                current_session = swapSession(selected_session -1, current_session)
            end if
            deleteSession(selected_session)
        else
            print("Invalid index given.")
        end if

    else if command == "clear" then
        clear_screen

    else if command == "clearlog" then
        clearLog(current_session)

    else if command == "clearall" then
        clearAllSessionLogs()

    else if command == "terminal" then
        current_session.object.launch("/bin/bash")

    else if command == "help" then
        printHelpInfo()

    else if command == "exit" then
        print("Exiting program...")
        clearAllSessionLogs()
        clearStack()
        exit

    //For normal bin commands.
    //Check first if it matches a program name in the /bin directory, /usr/bin, or current directory before failing. Use command_inpput[0] to retain capitalization.
    else
        if parameters.len == 0 then
            launchSuccess = current_session.object.launch("/bin/" + command_input[0])
            if launchSuccess == 0 then
                launchSuccess = current_session.object.launch("/usr/bin/" + command_input[0])
                if launchSuccess == 0 then
                    launchSuccess = current_session.object.launch(current_path + "/" + command_input[0])
                end if
            end if

        else
            launchSuccess = current_session.object.launch("/bin/" + command_input[0], parameters)
            if launchSuccess == 0 then
                launchSuccess = current_session.object.launch("/usr/bin/" + command_input[0], parameters)
                if launchSuccess == 0 then
                    launchSuccess = current_session.object.launch(current_path + "/" + command_input[0], parameters)
                end if
            end if

        end if

        if launchSuccess == 0 then print("Error: Command not recognized.")

    end if
end while