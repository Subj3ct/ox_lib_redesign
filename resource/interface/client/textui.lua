--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

---@class TextUIOptions
---@field position? 'right-center' | 'left-center' | 'top-center' | 'bottom-center';
---@field icon? string | {[1]: IconProp, [2]: string};
---@field iconColor? string;
---@field style? string | table;
---@field alignIcon? 'top' | 'center';

local isOpen = false
local currentText

-- Validate and sanitize style data to prevent CSSStyleDeclaration errors
local function validateStyle(style)
    if not style then return nil end
    
    -- If it's already a valid table, return it
    if type(style) == 'table' and not table.type(style) == 'empty' then
        return style
    end
    
    -- If it's a string or any other invalid type, return nil
    -- This prevents the CSSStyleDeclaration error when spread in NUI
    return nil
end

---@param text string
---@param options? TextUIOptions
function lib.showTextUI(text, options)
    if currentText == text then return end

    if not options then options = {} end

    options.text = text
    currentText = text
    
    -- Validate style data to prevent CSSStyleDeclaration errors
    options.style = validateStyle(options.style)

    SendNUIMessage({
        action = 'textUi',
        data = options
    })

    isOpen = true
end

function lib.hideTextUI()
    SendNUIMessage({
        action = 'textUiHide'
    })

    isOpen = false
    currentText = nil
end

---@return boolean, string | nil
function lib.isTextUIOpen()
    return isOpen, currentText
end
