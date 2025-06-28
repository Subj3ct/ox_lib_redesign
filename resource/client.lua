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

-- UI Test Commands for FiveM
if GetConvar('ox:debug', 'false') == 'true' then


    -- Test Notifications (Redesigned)
    RegisterCommand('test-notify', function()
        lib.notify({
            title = 'Success Notification!',
            description = 'This is a **redesigned** notification with booooooobies and ass and stuff and test make it long hehe haha',
            type = 'success',
            duration = 5000
        })
        
        Wait(1000)
        
        lib.notify({
            title = 'Error Notification!',
            description = 'Something went wrong with the new design...',
            type = 'error',
            duration = 5000
        })
        
        Wait(1000)
        
        lib.notify({
            title = 'Info Notification',
            description = 'This is an informational message with the new style',
            type = 'inform',
            duration = 5000
        })
        
        Wait(1000)
        
        lib.notify({
            title = 'Warning!',
            description = 'This is a warning notification',
            type = 'warning',
            duration = 5000
        })
    end)

    -- Test Progress Bar
    RegisterCommand('test-progress', function()
        lib.progressBar({
            duration = 5000,
            label = 'Testing new progress bar design...',
            useWhileDead = false,
            canCancel = true,
            disable = {
                move = true,
                car = true,
                combat = true,
            }
        })
    end)

    -- Test Circle Progress  
    RegisterCommand('test-circle', function()
        lib.progressCircle({
            duration = 3000,
            label = 'Hacking system...',
            position = 'middle-right',
            useWhileDead = false,
            canCancel = true,
        })
    end)

    -- Test Context Menu - ALL OPTION TYPES
    RegisterCommand('test-context', function()
        -- Register submenu FIRST
        lib.registerContext({
            id = 'test_context_sub',
            title = 'Submenu Test',
            menu = 'test_context_complete',
            options = {
                {
                    title = 'Submenu Option 1',
                    description = 'First submenu option',
                    icon = 'star',
                    iconColor = '#fbbf24',
                    event = 'test_context_sub1'
                },
                {
                    title = 'Submenu Option 2',
                    description = 'Another submenu option with progress',
                    icon = 'cog',
                    iconColor = '#ef4444',
                    progress = 75,
                    colorScheme = 'blue',
                    metadata = {
                        { label = 'Progress', value = '75%', progress = 75, colorScheme = 'blue' }
                    },
                    event = 'test_context_sub2'
                },
                {
                    title = 'Long Submenu Title That Should Wrap Properly Within The Container',
                    description = 'This is a very long description that should demonstrate proper text wrapping functionality within the glassmorphism container without overflowing or getting cut off when hovering',
                    icon = 'text-width',
                    iconColor = '#8b5cf6',
                    colorScheme = 'purple',
                    metadata = {
                        'Text wrapping test',
                        'Multiple metadata lines',
                        'Glassmorphism UI design',
                    },
                    event = 'test_context_sub3'
                },
                {
                    title = 'Back to Main',
                    description = 'Return to main menu',
                    icon = 'arrow-left',
                    iconColor = '#6b7280',
                    menu = 'test_context_complete'
                }
            }
        })

        -- Register main menu SECOND
        lib.registerContext({
            id = 'test_context_complete',
            title = 'Complete Context Menu Test',
            options = {
                {
                    title = 'Basic Option',
                    description = 'Simple option with icon',
                    icon = 'user',
                    iconColor = '#3b82f6',
                    event = 'test_context_basic'
                },
                {
                    title = 'Option with Metadata',
                    description = 'This option shows metadata info',
                    icon = 'info-circle',
                    iconColor = '#10b981',
                    metadata = {'Metadata 1', 'Metadata 2', 'Metadata 3'},
                    event = 'test_context_metadata'
                },
                {
                    title = 'Submenu Option (Test Functionality)',
                    description = 'Opens another context menu - this actually works now!',
                    icon = 'bars',
                    iconColor = '#f59e0b',
                    colorScheme = 'green',
                    metadata = {'Submenu functionality is now properly implemented'},
                    menu = 'test_context_sub'
                },
                {
                    title = 'Server Event Option',
                    description = 'Triggers server-side event',
                    icon = 'server',
                    iconColor = '#8b5cf6',
                    serverEvent = 'test_server_event',
                    args = {test = true, value = 123}
                },
                {
                    title = 'Export Function',
                    description = 'Calls an export function',
                    icon = 'external-link',
                    iconColor = '#ef4444',
                    export = 'ox_lib.testExport'
                },
                {
                    title = 'Disabled Option',
                    description = 'This option cannot be selected',
                    icon = 'ban',
                    iconColor = '#6b7280',
                    disabled = true
                },
                {
                    title = 'Arrow Option',
                    description = 'Option with arrow indicator',
                    icon = 'arrow-right',
                    iconColor = '#06b6d4',
                    arrow = true,
                    event = 'test_context_arrow'
                },
                {
                    title = 'Long Title Option That Might Wrap Cockadoodle DOo The cow says moo',
                    description = 'This is a very long description to test how the context menu handles longer text content and whether it wraps properly',
                    icon = 'text-width',
                    iconColor = '#f97316',
                    metadata = {'Long meta 1', 'Very long metadata item 2', 'Meta 3'},
                    event = 'test_context_long'
                },
                {
                    title = 'Image Option',
                    description = 'Option with custom image (Rick Roll!)',
                    image = 'https://i.redd.it/teo04yn25z1b1.jpg',
                    event = 'test_context_image'
                },
                {
                    title = 'Progress Option',
                    description = 'Shows a progress indicator',
                    icon = 'chart-bar',
                    iconColor = '#84cc16',
                    progress = 75,
                    colorScheme = 'green',
                    event = 'test_context_progress'
                }
            }
        })

        lib.showContext('test_context_complete')
    end)

    -- Event handlers for comprehensive context menu test
    RegisterNetEvent('test_context_basic', function()
        lib.notify({title = 'Basic Option', description = 'You selected the basic option!', type = 'success'})
    end)

    RegisterNetEvent('test_context_metadata', function()
        lib.notify({title = 'Metadata Option', description = 'Option with metadata was selected!', type = 'inform'})
    end)

    RegisterNetEvent('test_context_arrow', function()
        lib.notify({title = 'Arrow Option', description = 'Arrow option was selected!', type = 'warning'})
    end)

    RegisterNetEvent('test_context_long', function()
        lib.notify({title = 'Long Option', description = 'The long title option was selected!', type = 'inform'})
    end)

    RegisterNetEvent('test_context_image', function()
        lib.notify({title = 'Image Option', description = 'Image option was selected!', type = 'success'})
    end)

    RegisterNetEvent('test_context_progress', function()
        lib.notify({title = 'Progress Option', description = 'Progress option was selected!', type = 'warning'})
    end)

    RegisterNetEvent('test_context_sub1', function()
        lib.notify({title = 'Submenu 1', description = 'First submenu option selected!', type = 'success'})
    end)

    RegisterNetEvent('test_context_sub2', function()
        lib.notify({title = 'Submenu 2', description = 'Second submenu option selected!', type = 'inform'})
    end)

    RegisterNetEvent('test_context_sub3', function()
        lib.notify({title = 'Submenu 3', description = 'Long title submenu option selected! Text wrapping works!', type = 'success'})
    end)

    -- Server event handler (if you want to test server events)
    RegisterNetEvent('test_server_event', function(args)
        lib.notify({
            title = 'Server Event', 
            description = 'Server event triggered with args: ' .. json.encode(args), 
            type = 'success',
            duration = 5000
        })
    end)

    -- Test List Menu - ALL MENU ITEM TYPES
    RegisterCommand('test-menu', function()
        lib.registerMenu({
            id = 'test_menu_complete',
            title = 'Complete List Menu Test',
            position = 'top-right',
            options = {
                {
                    label = 'Basic Menu Item',
                    description = 'Simple menu item with icon',
                    icon = 'home',
                    iconColor = '#3b82f6'
                },
                {
                    label = 'Checkbox Item',
                    description = 'Item with checkbox (toggleable)',
                    icon = 'check-square',
                    iconColor = '#10b981',
                    checked = true
                },
                {
                    label = 'Multiple Values Item',
                    description = 'Use left/right arrows to change',
                    icon = 'exchange',
                    iconColor = '#f59e0b',
                    values = {'Option A', 'Option B', 'Option C', 'Option D'}
                },
                {
                    label = 'Progress Bar Item',
                    description = 'Shows progress with colored bar',
                    icon = 'chart-line',
                    iconColor = '#8b5cf6',
                    progress = 65,
                    colorScheme = 'red'
                },
                {
                    label = 'Progress Different Color',
                    description = 'Progress bar with different theme',
                    icon = 'battery',
                    iconColor = '#06b6d4',
                    progress = 85,
                    colorScheme = 'green'
                },
                {
                    label = 'Progress Blue Theme',
                    description = 'Blue themed progress bar',
                    icon = 'wifi',
                    iconColor = '#3b82f6',
                    progress = 45,
                    colorScheme = 'blue'
                },
                {
                    label = 'Disabled Menu Item',
                    description = 'This item cannot be selected',
                    icon = 'ban',
                    iconColor = '#6b7280',
                    disabled = true
                },
                {
                    label = 'Item with Close Option',
                    description = 'Selecting this will close menu',
                    icon = 'sign-out',
                    iconColor = '#ef4444',
                    close = true
                },
                {
                    label = 'Long Title That Might Need Wrapping',
                    description = 'This is a very long description to test how the list menu handles longer text content and see if it displays properly without breaking the layout',
                    icon = 'text-width',
                    iconColor = '#f97316'
                },
                {
                    label = 'Special Characters',
                    description = 'Testing: éñ特殊字符 & symbols!@#$%',
                    icon = 'language',
                    iconColor = '#84cc16'
                },
                {
                    label = 'Numeric Values',
                    description = 'Numeric value selection',
                    icon = 'calculator',
                    iconColor = '#ec4899',
                    values = {10, 25, 50, 75, 100}
                },
                {
                    label = 'Mixed Type Values',
                    description = 'Mixed string and number values',
                    icon = 'shuffle',
                    iconColor = '#14b8a6',
                    values = {'Low', 50, 'Medium', 75, 'High', 100}
                }
            }
        }, function(selected, scrollIndex, args)
            local selectedOption = selected and 'Option ' .. selected or 'None'
            local scrollValue = scrollIndex and ' (Value: ' .. tostring(scrollIndex) .. ')' or ''
            
            lib.notify({
                title = 'Menu Selection',
                description = 'Selected: ' .. selectedOption .. scrollValue,
                type = 'success',
                duration = 3000
            })
            
            print('=== MENU SELECTION ===')
            print('Selected Index:', selected)
            print('Scroll Index:', scrollIndex)
            print('Args:', json.encode(args))
        end)
        lib.showMenu('test_menu_complete')
    end)

    -- Test Input Dialog - ALL FIELD TYPES
    RegisterCommand('test-input', function()
        local input = lib.inputDialog('Complete Input Dialog Test', {
            {type = 'input', label = 'Text Input', placeholder = 'Enter text here...', required = true, icon = 'edit'},
            {type = 'number', label = 'Number Input', placeholder = 'Enter number...', min = 0, max = 1000, icon = 'hashtag'},
            {type = 'password', label = 'Password Input', placeholder = 'Enter password...', icon = 'lock'},
            {type = 'select', label = 'Select Dropdown', icon = 'list', options = {
                {value = 'option1', label = 'Option 1'},
                {value = 'option2', label = 'Option 2'},
                {value = 'option3', label = 'Option 3'},
                {value = 'option4', label = 'Option 4'}
            }},
            {type = 'multi-select', label = 'Multi-Select', icon = 'check-square', options = {
                {value = 'item1', label = 'Item 1'},
                {value = 'item2', label = 'Item 2'},
                {value = 'item3', label = 'Item 3'},
                {value = 'item4', label = 'Item 4'}
            }},
            {type = 'checkbox', label = 'Checkbox Option', checked = false},
            {type = 'textarea', label = 'Textarea Input', placeholder = 'Enter multiple lines here...', autosize = true, icon = 'align-left'},
            {type = 'slider', label = 'Slider Value', min = 0, max = 100, default = 50, step = 5, icon = 'sliders'},
            {type = 'color', label = 'Color Picker', default = '#ff0000', icon = 'palette'},
            {type = 'date', label = 'Date Picker', icon = 'calendar', format = 'DD/MM/YYYY'},
            {type = 'time', label = 'Time Picker', icon = 'clock', format = '24'},
            {type = 'datetime', label = 'DateTime Picker', icon = 'calendar-clock'}
        })
        
        if input then
            lib.notify({
                title = 'All Input Fields Received!',
                description = 'Check F8 console for detailed input values',
                type = 'success',
                duration = 5000
            })
            print('=== INPUT DIALOG RESULTS ===')
            for i, value in ipairs(input) do
                print(('Field %d: %s'):format(i, json.encode(value)))
            end
        else
            lib.notify({title = 'Cancelled', description = 'Input dialog was cancelled', type = 'error'})
        end
    end)

    -- Test Alert Dialog
    RegisterCommand('test-alert', function()
        local alert = lib.alertDialog({
            header = 'Test Alert',
            content = 'This is a **test alert** with markdown support!\n\nDoes the glassmorphism look good?',
            centered = true,
            cancel = true,
            size = 'md'
        })
        
        if alert == 'confirm' then
            lib.notify({title = 'Confirmed!', description = 'You clicked confirm!', type = 'success'})
        else
            lib.notify({title = 'Cancelled', description = 'You clicked cancel', type = 'error'})
        end
    end)

    -- Test TextUI
    RegisterCommand('test-textui', function()
        lib.showTextUI('[E] Interact', {
            position = "right-center",
            icon = 'hand-pointer'
        })
        
        -- Auto hide after 5 seconds
        SetTimeout(5000, function()
            lib.hideTextUI()
        end)
    end)

    -- Test Skill Check
    RegisterCommand('test-skillcheck', function()
        local success = lib.skillCheck({'easy', 'medium', 'hard'}, {'W', 'A', 'S', 'D'})
        
        if success then
            lib.notify({title = 'Success!', description = 'You passed the skill check!', type = 'success'})
        else
            lib.notify({title = 'Failed!', description = 'You failed the skill check!', type = 'error'})
        end
    end)

    -- Test All Components
    RegisterCommand('test-all-ui', function()
        lib.notify({title = '🎨 UI Test Started', description = 'Testing all redesigned UI components...', type = 'inform'})
        
        -- Test notifications first
        ExecuteCommand('test-notify')
        
        -- Test other components with delays
        SetTimeout(2000, function() ExecuteCommand('test-textui') end)
        SetTimeout(4000, function() ExecuteCommand('test-progress') end)
        SetTimeout(10000, function() ExecuteCommand('test-alert') end)
        SetTimeout(12000, function() ExecuteCommand('test-context') end)
        SetTimeout(15000, function() ExecuteCommand('test-menu') end)
        SetTimeout(18000, function() 
            lib.notify({title = 'Radial Test', description = 'Press F1 (or your radial key) to test the radial menu design!', type = 'inform'})
        end)
        SetTimeout(21000, function() ExecuteCommand('test-input') end)
        SetTimeout(25000, function() ExecuteCommand('test-skillcheck') end)
        SetTimeout(28000, function() ExecuteCommand('test-circle') end)
    end)

    print('^2[ox_lib] ^7COMPREHENSIVE UI test commands loaded! Use:')
    print('^3/test-notify ^7- Test all notification types') 
    print('^3/test-progress ^7- Test progress bar')
    print('^3/test-circle ^7- Test circle progress')
    print('^3/test-context ^7- Test ALL context menu options')
    print('^3/test-menu ^7- Test ALL list menu item types')
    print('^3/test-input ^7- Test ALL input field types')
    print('^3/test-alert ^7- Test alert dialog')
    print('^3/test-textui ^7- Test TextUI')
    print('^3/test-skillcheck ^7- Test skill check')
    print('^3/test-all-ui ^7- Test all components sequentially')
    print('^1NOTE: ^7These are COMPREHENSIVE tests showing every available option!')
end
