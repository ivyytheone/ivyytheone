RegisterNetEvent("qalle_motels:keyTransfered")
AddEventHandler("qalle_motels:keyTransfered", function(keyData)
    table.insert(cachedData["keys"], keyData)

    ESX.ShowNotification("Du tog emot en nyckel.", "error", 3500)
end)

AddKey = function(keyData)
    if not keyData["id"] then return end
    if not keyData["label"] then keyData["label"] = "Nyckel - Okänd" end

    keyData["uuid"] = UUID()

    ESX.TriggerServerCallback("qalle_motels:addKey", function(added)
        if added then
            table.insert(cachedData["keys"], keyData)

            ESX.ShowNotification("Nyckel tillagd.", "warning", 3500)
        end
    end, keyData)
end

RemoveKey = function(keyUUID)
    if not keyUUID then return end

    for keyIndex, keyData in ipairs(cachedData["keys"]) do
        if keyData["uuid"] == keyUUID then
            ESX.TriggerServerCallback("qalle_motels:removeKey", function(removed)
                if removed then
                    table.remove(cachedData["keys"], keyIndex)

                    ESX.ShowNotification("Nyckel borttagen.", "error", 3500)
                end
            end, keyUUID)

            return
        end
    end
end

TransferKey = function(keyData, newPlayer)
    if not keyData["uuid"] then return end

    for keyIndex, currentKeyData in ipairs(cachedData["keys"]) do
        if keyData["uuid"] == currentKeyData["uuid"] then
            ESX.TriggerServerCallback("qalle_motels:transferKey", function(removed)
                if removed then
                    table.remove(cachedData["keys"], keyIndex)

                    ESX.ShowNotification("Nyckel borttagen.", "error", 3500)
                end
            end, keyData, GetPlayerServerId(newPlayer))

            return
        end
    end
end

HasKey = function(keyId)
    if not keyId then return end

    for keyIndex, keyData in ipairs(cachedData["keys"]) do
        if keyData["id"] == keyId then
            return true
        end
    end

    return false
end

ShowKeyMenu = function()
    local menuElements = {}

    if #cachedData["keys"] == 0 then return ESX.ShowNotification("Du har inga nycklar förvarade på dig.", "error", 3000) end

    for keyIndex, keyData in ipairs(cachedData["keys"]) do
        table.insert(menuElements, {
            ["label"] = keyData["label"],
            ["key"] = keyData
        })
    end

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "key_main_menu", {
        ["title"] = "Nyckelförvaring",
        ["align"] = Config.AlignMenu,
        ["elements"] = menuElements
    }, function(menuData, menuHandle)
        local currentKey = menuData["current"]["key"]

        if not currentKey then return end

        menuHandle.close()

        ConfirmGiveKey(currentKey, function(confirmed)
            if confirmed then
                TransferKey(currentKey, confirmed)

                DrawBusySpinner("Lämnar över...")

                Citizen.Wait(1000)

                RemoveLoadingPrompt()
            end

            ShowKeyMenu()
        end)
    end, function(menuData, menuHandle)
        menuHandle.close()
    end)
end

ConfirmGiveKey = function(keyData, callback)
    local closestPlayer, closestPlayerDistance = ESX.Game.GetClosestPlayer()

    if closestPlayer ~= -1 and closestPlayerDistance > 3.0 then
        return ESX.ShowNotification("Du har ingen individ nära som du kan lämna över nyckeln till.")
    end

    Citizen.CreateThread(function()
        while ESX.UI.Menu.IsOpen("default", GetCurrentResourceName(), "main_accept_key") do
            Citizen.Wait(5)

            local cPlayer, cPlayerDst = ESX.Game.GetClosestPlayer()

            if cPlayer ~= closestPlayer then
                closestPlayer = cPlayer
            end

            local cPlayerPed = GetPlayerPed(closestPlayer)

            if DoesEntityExist(cPlayerPed) then
                DrawScriptMarker({
					["type"] = 2,
					["pos"] = GetEntityCoords(cPlayerPed) + vector3(0.0, 0.0, 1.2),
					["r"] = 0,
					["g"] = 0,
					["b"] = 255,
					["sizeX"] = 0.3,
					["sizeY"] = 0.3,
					["sizeZ"] = 0.3,
                    ["rotate"] = true,
                    ["bob"] = true
				})
            end
        end
    end)

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "main_accept_key", {
        ["title"] = "Vill du lämna över nyckeln?",
        ["align"] = Config.AlignMenu,
        ["elements"] = {
            {
                ["label"] = "Ja, lämna över.",
                ["action"] = "yes"
            },
            {
                ["label"] = "Nej, avbryt.",
                ["action"] = "no"
            }
        }
    }, function(menuData, menuHandle)
        local action = menuData["current"]["action"]
        
        menuHandle.close()

        if action == "yes" then
            callback(closestPlayer)
        else
            callback(false)
        end
    end, function(menuData, menuHandle)
        menuHandle.close()
    end)
end