$.support.cors = true;

var titanDebug = false;
var localIPAddress = null;

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined'
		  ? args[number]
		  : match
		;
	});
};

function setTitanDebug(debugMode) {
	titanDebug = debugMode;
}

function changeIpAddress() {
	ipString = prompt("Please enter the console IP Address:", "");
	localStorage.setItem("ip", ipString);
}

function setIPAddress(address) {
	localIPAddress = address
}

function ipAddress() {
	var ipString = (localIPAddress == null ? localStorage.getItem("ip") : localIPAddress);

	if (ipString == null) {
		changeIpAddress();
	}
	return ipString;
};

function runAcw(script, success) {
	var functionEnd = script.indexOf("(", 0);
	var functionName = script.substring(0, functionEnd).replace(/\./g, "/").trim();
	var arguments = script.substring(functionEnd + 1).replace(/,/g, "&").replace(/'/g, "").trim();
	arguments = arguments.substring(0, arguments.length - 1)

	var url = "http://{0}:4430/titan/script/2/{1}".format(ipAddress(), functionName + "?" + arguments);
	
	if(titanDebug)
	{
		alert(url);
	}
	else
	{
		$.get(url, function () {
			success();			
		}).always(function() {
			setTimeout(processHandleStatus,200);
		  });
	}
	
	
};

function getAcw(script, success, fail) {
    script = script.replace(/\./g, "/").replace(/,/g, "&").replace("(", "?").replace(")", "");
    var url = "http://{0}:4430/titan/get/{1}".format(ipAddress(), script);
    $.getJSON(url, success)
        .fail(function (jqXHr, textStatus, errorThrown) {
            if (fail === undefined || fail === null) {
                throw "Unable to connect to {0}. Error message: {1} - {2} - {3}"
                    .format(ipAddress(), jqXHr.statusText, textStatus, errorThrown);
            } else {
                fail(jqXHr, textStatus, errorThrown);
            }
        });
}

function baseGet(urlParts, success, fail) {
    var url = "http://{0}:4430/titan/{1}".format(ipAddress(), urlParts);
    $.getJSON(url, success)
        .fail(function (jqXHr, textStatus, errorThrown) {
            if (fail === undefined || fail === null) {
                throw "Unable to connect to {0}. Error message: {1} - {2} - {3}"
                    .format(ipAddress(), jqXHr.statusText, textStatus, errorThrown);
            } else {
                fail(jqXHr, textStatus, errorThrown);
            }
        });
}

var statusTimer = null;

function startStatusUpdate() {
	setTimeout(processHandleStatus, 1000);
    statusTimer = setInterval(processHandleStatus, 10000);
}

function stopStatusUpdate() {
    clearInterval(statusTimer);
}

function processHandleStatus()
{
	if(statusListeners.size >0)
	{
		updateHandleGroupStatus("Playbacks");
        updateHandleGroupStatus("PlaybackWindow");
    }

    propertyListeners.forEach(updatePropertyStatus);
}

function updatePropertyStatus(sponsors, propertyId)
{
    getAcw(propertyId, function (value) {
        if (sponsors) {
            sponsors.forEach(function (report) {
                if (report.pause > 0) {
                    report.pause--;
                }
                else {
                    if (value != report.value) {
                        report.callback(report.sender, value, report.defaultValue);
                        report.value = value;
                    }
                }
            });
        }
    });
}

function updateHandleGroupStatus(groupName)
{
		var url = "http://{0}:4430/titan/handles/{1}?verbose=true".format(ipAddress(),groupName);
		
		$.getJSON(url, function (data) {
			data.forEach(function (value) {
				var sponsors = statusListeners.get(value["UserNumber"]["hashCode"]);
				if(sponsors)
				{		
					sponsors.forEach(function (report){
						if(report.pause > 0)
						{
							report.pause--;
						}
						else
						{
							if(report.select(value) != report.value)
							{
								report.callback(report.sender, value,report.defaultValue);
								report.value = value[report.key];
							}
						}
					});
				}
			});
		})
		.fail(function (jqXHr, textStatus, errorThrown) {
			//alert(jqXHr.statusText);
		});
}

var statusListeners = new Map();

function addTitanStatusListener(userNumber,sender, select, defaultValue,callback)
{
	var sponsors = statusListeners.get(parseInt(userNumber));
	if(!sponsors)
	{
		sponsors = new Array();
	}

	var report = {};
	report["sender"] = sender;
	report["callback"] = callback;
	report["select"] = select;
	report["defaultValue"] = defaultValue;
	report["pause"] = 0;
	report["value"] = null;
	sponsors.push(report);
	
	statusListeners.set(parseInt(userNumber), sponsors);
}

function pauseTitanStatusListener(userNumber)
{
	var sponsors = statusListeners.get(parseInt(userNumber));
	if(sponsors)
	{
		sponsors.forEach(function (value){
			value.pause ++;
		});
	}
}

var propertyListeners = new Map();

function addTitanPropertyListener(sender, propertyId, defaultValue, callback) {
   
    var sponsors = propertyListeners.get(propertyId);
    if (!sponsors) {
        sponsors = new Array();
    }

    var report = {};
    report["sender"] = sender;
    report["callback"] = callback;
    report["select"] = null;
    report["defaultValue"] = defaultValue;
    report["pause"] = 0;
    report["value"] = null;
    sponsors.push(report);

    propertyListeners.set(propertyId, sponsors);
}

function deviceInfo(success) {
	getAcw("Titan.DeviceInfo", success);
}

function killPlayback(groupId, titanId) {
	runAcw("Playbacks.KillAllPlaybacks()");
};

function killAllPlaybacks() {
	runAcw("Playbacks.KillAllPlaybacks()");
};

function firePlaybackLocation(page, index, level) {
	runAcw("Playbacks.FirePlaybackAtLevel(location=(Playbacks_{0}_{1}),level={2},bool=false)".format(page, index, level));
};

function firePlayback(userNumber, level) {
	runAcw("Playbacks.FirePlaybackAtLevel(handle_userNumber={0},level_level={1},alwaysRefire=false)".format(userNumber, level));
};

function refirePlayback(userNumber, level) {
	runAcw("Playbacks.FirePlaybackAtLevel(handle_userNumber={0},level={1},bool=true)".format(userNumber, level));
};

function togglePlayback(userNumber) {
	runAcw("Playbacks.ToggleLatchPlayback(handle_userNumber={0})".format(userNumber));
};

function killPlayback(userNumber) {
	runAcw("Playbacks.KillPlayback(handle_userNumber={0})".format(userNumber));
}

function setNextCue(userNumber, cueNumber) {
	runAcw("CueLists.SetNextCue(handle_userNumber={0},stepNumber={1})".format(userNumber, cueNumber));
};

function go(userNumber) {
	runAcw("CueLists.Play(handle_userNumber={0})".format(userNumber));
};

function pause(userNumber) {
	runAcw("CueLists.Pause(handle_userNumber={0})".format(userNumber));
};

function goBack(userNumber) {
	runAcw("CueLists.GoBack(handle_userNumber={0})".format(userNumber));
};

function snapNext(userNumber) {
	runAcw("CueLists.CutNextCueToLive(handle_userNumber={0})".format(userNumber));
};

function snapBack(userNumber) {
	runAcw("CueLists.SnapBack(handle_userNumber={0})".format(userNumber));
};

function fireMacro(userNumber) {
	runAcw("UserMacros.RecallMacro(handle_userNumber={0})".format(userNumber));
};

function lampOn() {
	runAcw("Fixtures.Macros.FireMacro('Lamp On')");
}

function lampOff() {
	runAcw("Fixtures.Macros.FireMacro('Lamp Off')");
}

function getPresets(success, fail) {
    baseGet("handles", success, fail);
}

function enableTimecode(enabled) {
    runAcw("Timecode.SetEnabled(enabled={0})".format(enabled));
}

function setTimecodeSource(streamId, source) {
    runAcw("Timecode.SetTimecodeSource(timecodeId={0},source={1})".format(89 + streamId,source));
}

function playTimecode(streamId) {
    runAcw("Timecode.Play(timecodeId={0})".format(89 + streamId));
}

function pauseTimecode(streamId) {
    runAcw("Timecode.Pause(timecodeId={0})".format(89 + streamId));
}

function restartTimecode(streamId) {
    runAcw("Timecode.Restart(timecodeId={0})".format(89 + streamId));
}

function getTimecodeSource(streamId, processValue) {
    getAcw("Timecode.TimecodeOne.Source", processValue);    
}