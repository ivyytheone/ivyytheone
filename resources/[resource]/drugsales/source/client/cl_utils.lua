UTILS = {
    DRAWTEXT3D = function(Data)
        local onScreen, _x, _y = World3dToScreen2d(Data.Coords.x, Data.Coords.y, Data.Coords.z) 
    
        SetTextScale(0.38, 0.38)
        SetTextFont(4)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 200)
        SetTextEntry("STRING")
        SetTextCentre(1)
    
        AddTextComponentString(Data.Text)
        DrawText(_x, _y)
    
        local factor = string.len(Data.Text) / 370
        DrawRect(_x, _y + 0.0125, 0.015 + factor, 0.03, 41, 11, 41, 68)
    end, 

    GETCHARACTERITEM = function(item)  
        local characterItem = ESX.PlayerData['inventory'] 

        if characterItem then  
            for i = 1, #characterItem do  
                if characterItem[i]['name'] == item then  
                    if characterItem[i]['count'] > 0 then  
                        return true
                    end
                end
            end
        end

        return false
    end 
}