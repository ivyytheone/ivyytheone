ESX = nil

Citizen.CreateThread(function()
    while ESX == nil do
        Citizen.Wait(5)

        ESX = exports["es_extended"]:getSharedObject()
    end

    if ESX.IsPlayerLoaded() then
		ESX.PlayerData = ESX.GetPlayerData()

		HandleSkill()
	end
	
	LoadBlip()
end)

RegisterNetEvent("esx:playerLoaded")
AddEventHandler("esx:playerLoaded", function(response)
	ESX.PlayerData = response

	HandleSkill()
end)

Citizen.CreateThread(function()
	Citizen.Wait(100)

	while true do
		local sleepThread = 500

		local ped = PlayerPedId()
		local pedCoords = GetEntityCoords(ped)

		for workout, vals in pairs(Config.WorkOuts) do
			if vals["usable"] or workoutsDone < Config.MaxWorkOuts then
				local dstCheck = GetDistanceBetweenCoords(pedCoords, vals["Pos"], true)

				if dstCheck <= 5.0 then
					sleepThread = 5

					Draw3DText({
						Coords = vals["Pos"],
						Text = "[~g~E~s~] - " .. workout
					})

					if dstCheck <= 1.2 then
						if IsControlJustPressed(0, 38) then
							StartWorkout(vals, workout)
						end
					end
				end
			end
		end

		Citizen.Wait(sleepThread)
	end
end)