//List of months for determining z-day dates.
months = {
"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
"May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
"Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}

//Prints a file tree of all files/folders on the current PC. Used by tree command and targetedhack.
//This is the function to be called for a recursive file search, not buildRecursiveFileList.
generateFileTree = function(currentComputer)
    root_file = currentComputer.File("/")
    if root_file == null then
        print("Unable to begin tree, no access to root directory.")
        return 0
    end if

    tree_list = recursiveFileSearch(root_file)
    print("<color=#FFFFFF>/</color>")
    printFileTree(tree_list)
end function

//takes a starting folder File object. Returns the nested list with all files/folders.
recursiveFileSearch = function(root)

    tree = []

    root_files = root.get_files()
    root_folders = root.get_folders()
    if root_files == null or root_folders == null then
        print("Unable to begin tree, no access to root directory. Permissions: " + root.permissions)
        return 0
    end if

    for file in root_files
        tree.push(file)
    end for
    
    
    for folder in root_folders
        tree.push(buildRecursiveFileList(folder))
    end for

    return tree
end function

//Passed in a File object to start from. Builds a nested list object where files are file objects and folders are nested lists with their file objects.
//Remember, subsequent folder lists have parent folder as first object, slice via [1:]
buildRecursiveFileList = function(folder)

    folder_list = []

    // First element is the folder itself
    folder_list.push(folder)

    files = folder.get_files()
    if files != null then
        for file in files
            folder_list.push(file)
        end for
    end if

    subfolders = folder.get_folders()
    if subfolders != null then
        for subfolder in subfolders
            folder_list.push(buildRecursiveFileList(subfolder))
        end for
    end if

    return folder_list
end function

//Prints the actual file tree.
//Remember that for folder lists, first file within is always the parent folder. Slice via [1:]
printFileTree = function(tree, prefix="")
    uninteresting_files = ["xorg.conf", "fstab", "init.so", "kernel_module.so", "net.so", "aptclient.so", "xorg.sys", "config.sys", "network.cfg", "system.log", "cd", "ls", "ps", "pwd",
    "ifconfig", "iwconfig", "iwlist", "cat", "rm", "mv", "cp", "ssh", "ftp", "mkdir", "rmdir", "chmod", "reboot", "whois", "passwd", "sudo", "useradd", "userdel", "nslookup",
    "build", "touch", "chown", "chgrp", "groupadd", "groupdel", "groups", "kill", "ping", "apt-get", "man", "whoami", "ln", "scp", "bash", "FileExplorer.exe", "Terminal.exe",
    "Mail.exe", "Browser.exe", "Notepad.exe", "Settings.exe", "LogViewer.exe", "CodeEditor.exe", "ImageViewer.exe", "PDFReader.exe", "System.map", "initrd.img", "kernel.img",
    "sshd", "sshd.conf", "ftpd", "ftpd.conf", "httpd", "httpd.conf", "smtpd", "smtpd.conf", "criminals.db", "criminald", "employees.db", "employeesd", "students.db", "studentsd",
    "account.db", "accountsd", "camd.conf", "camd", "rshelld.conf", "rshelld", "repod.conf", "repod", "sappl.conf", "sappl", "adbd.conf", "adbd", "website.html", "kernel_router.so",
    "libhttp.so", "libsql.so", "libssh.so", "encode.src", "decode.bin", "libsmartappliance.so", "libftp.so", "libcam.so", "Clock.exe", "libsmtp.so", "libtrafficnet.so"]

    if tree == null or tree.len == 0 then return
    
    for i in range(0, tree.len - 1)

        item = tree[i]
        isLast = (i == tree.len - 1)

        if typeof(item) == "list" then

            if item.len == 0 then continue

            folder = item[0]

            if isLast then
                print(prefix + "└── " + "["+ folder.permissions + "]  " + "<color=#FFFFFF>" + folder.name + "</color>")
                childPrefix = prefix + "    "
            else
                print(prefix + "├── " + "["+ folder.permissions + "]  "  + "<color=#FFFFFF>" + folder.name + "</color>")
                childPrefix = prefix + "│   "
            end if

            children = item[1:]
            printFileTree(children, childPrefix)

        else
            printed_name = item.name

            if uninteresting_files.indexOf(item.name) == null then
                printed_name = "<color=#FFDE21>" + item.name + "</color>"
            end if

            if isLast then
                print(prefix + "└── " + "["+ item.permissions + "]  " + printed_name)
            else
                print(prefix + "├── " + "["+ item.permissions + "]  " + printed_name)
            end if

        end if

    end for
end function

is_leap_year = function(year)
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
end function

days_in_month = function(month, year)
    if month == 2 then

    if is_leap_year(year) then return 29 else return 28
    else if [4, 6, 9, 11].indexOf(month) != null then
        return 30
    end if

    return 31
end function

//Code lifted from GSQ's time until z-day script.
time_to_next_cycle = function()
    raw = current_date
    splitDateTime = raw.split(" - ")
    dmy = splitDateTime[0].split("/")
    hm = splitDateTime[1].split(":")

    day = dmy[0].to_int
    monthStr = dmy[1]
    month = months[monthStr]
    year = dmy[2].to_int

    hour = hm[0].to_int
    minute = hm[1].to_int
    second = 0

    if month % 2 == 0 and day >= 1 and day <= 14 then
        return "A 0-Day Cycle is Active"
    end if

    next_month = month + 1
    next_year = year
    if next_month > 12 then
        next_month = 1
        next_year = year + 1
    end if

    if next_month % 2 != 0 then
        next_month = next_month + 1
        if next_month > 12 then
            next_month = 2
            next_year = next_year + 1
        end if
    end if

    days_remaining = days_in_month(month, year) - day

    curr_month = month + 1
    y = year
        while curr_month != next_month or y != next_year
            if curr_month > 12 then
                curr_month = 1
                y = y + 1
            end if
            days_remaining = days_remaining + days_in_month(curr_month, y)
            curr_month = curr_month + 1
        end while

    days_remaining = days_remaining + 1
    total_seconds = days_remaining * 86400 - (hour * 3600 + minute * 60 + second)

    real_seconds = total_seconds / 14.0
    hrs = floor(real_seconds / 3600)
    mins = floor((real_seconds % 3600) / 60)
    secs = floor(real_seconds % 60)

    return "Real-time until next 0-Day cycle <color=white>" + hrs + "h:" + mins + "m:" + secs + "s</color>"
end function

delFromTracking = function(target_ip)
    hostComputer = g.stack[0].object.host_computer
    tracking_entries = unpackTracking()
    if tracking_entries.len == 0 then
        return 0
    end if

    index_counter = 0
    for tracking_line in tracking_entries
        if tracking_line.split(",")[1] == target_ip then
            tracking_entries.remove(index_counter)
        end if
        index_counter = index_counter + 1
    end for

    //Error message will get thrown by unpackTracking, don't need one here.
    tracking = hostComputer.File("/Databases/tracking.dat")
    if tracking == null then
        return 0
    end if

    tracking.set_content(tracking_entries.join(char(10)) + char(10))
    return 1
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

    writeString = currentName + "," + currentIP + "," + password + "," + sshConnected + char(10)
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
//Checks if a given computer name/public ip combo are already in tracking, and decides whether to update it or not.
checkForTrackingEntry = function(computerName, publicIP, password, sshConnection)
    unpackedLines = unpackTracking()
    if unpackedLines.len == 0 then
        return 0
    end if

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
    if tracking == null then
        print("No tracking file found")
        return []
    end if
    if tracking.get_content().len == 0 or tracking.get_content() == null then
        print("No connections tracked.")
        return []
    end if
    trackingLines = tracking.get_content.split(char(10))
    return trackingLines[:-1]
end function

showTrackingOptions = function()
    unpackedLines = unpackTracking()
    if unpackedLines.len == 0 then
        return 0
    end if

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
    return 1
end function

selectSSHTrackingOptions = function()
    sshLinesList = []
    unpackedTracking = unpackTracking()
    if unpackedTracking.len == 0 then
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
//Or returns null if failed to prevent deleting 0 index in tracking.
selectTrackingOption = function()
    showTrackingOptions()
    unpacked_tracking = unpackTracking()
    if unpacked_tracking.len == 0 then
        return 0
    end if
    user_selection = user_input("Select an index: ").to_int
    if typeof(user_selection) != "number" then
        print("Invalid selection: index must be a number.")
        return null
    end if

    index = 0
    for line in unpacked_tracking
        if index == user_selection then
            return line.split(",")
        else
            index = index + 1

        end if
    end for
    print("Index not found")
    return null
end function

selectTrackingEntryToDelete = function()
    delimited_selection_entry = selectTrackingOption()
    if not delimited_selection_entry then return 0
    ip_to_delete = delimited_selection_entry[1]
    delFromTracking(ip_to_delete)
    return 1
end function