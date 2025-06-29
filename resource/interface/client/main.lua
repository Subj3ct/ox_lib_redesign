--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

---@alias IconProp 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fab' | 'fak' | 'fass'

local keepInput = false -- Initialize as false, will be properly set when needed

function lib.setNuiFocus(allowInput, disableCursor)
    -- FIX: Only save keepInput if we haven't already saved it
    if not lib._oxLibHasFocus then
        keepInput = IsNuiFocusKeepingInput()
        lib._oxLibHasFocus = true
        print(string.format("[ox_lib] Saving focus state - keepInput: %s", tostring(keepInput)))
    end
    
    print(string.format("[ox_lib] Setting NUI focus - allowInput: %s, disableCursor: %s", tostring(allowInput), tostring(not disableCursor)))
    SetNuiFocus(true, not disableCursor)
    SetNuiFocusKeepInput(allowInput)
end

function lib.resetNuiFocus()
    print(string.format("[ox_lib] Resetting NUI focus - restoring keepInput: %s", tostring(keepInput)))
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(keepInput)
    -- Reset flag so we can save fresh state next time
    lib._oxLibHasFocus = false
    
    -- Add small delay to ensure other scripts can reclaim focus
    Citizen.SetTimeout(50, function()
        print(string.format("[ox_lib] Final focus state after reset - keepInput: %s", tostring(IsNuiFocusKeepingInput())))
    end)
end
