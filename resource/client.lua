--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

local _registerCommand = RegisterCommand

---@param commandName string
---@param callback fun(source, args, raw)
---@param restricted boolean?
function RegisterCommand(commandName, callback, restricted)
	_registerCommand(commandName, function(source, args, raw)
		if not restricted or lib.callback.await('ox_lib:checkPlayerAce', 100, ('command.%s'):format(commandName)) then
			callback(source, args, raw)
		end
	end)
end

RegisterNUICallback('getConfig', function(_, cb)
    cb({
        primaryColor = GetConvar('ox:primaryColor', 'red'),
        primaryShade = GetConvarInt('ox:primaryShade', 8)
    })
end)

-- Debug command to check NUI focus state
RegisterCommand('checkfocus', function()
    local currentFocus = IsNuiFocused()
    local currentKeepInput = IsNuiFocusKeepingInput()
    local oxLibHasFocus = lib._oxLibHasFocus or false
    
    print("=== NUI Focus Debug ===")
    print(string.format("IsNuiFocused: %s", tostring(currentFocus)))
    print(string.format("IsNuiFocusKeepingInput: %s", tostring(currentKeepInput)))
    print(string.format("ox_lib has focus flag: %s", tostring(oxLibHasFocus)))
    print("=====================")
end, false)

-- Debug command to test manual focus reset
RegisterCommand('resetfocus', function()
    print("Manually resetting NUI focus...")
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    lib._oxLibHasFocus = false
    print("Focus reset complete")
end, false)
