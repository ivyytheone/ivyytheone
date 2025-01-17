Utils = {}; 

Utils.GetAccountMoney = function(callback)
    local Data = {}
    MySQL.Async.fetchAll('SELECT * FROM addon_account_data WHERE account_name = @ac', {
        ['@ac'] = 'society_cardealer'
    }, function(Resp)
        callback(Resp[1].money)
    end)    
end


Utils.GenerateUUID = function()
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
        return string.format('%x', v)
    end)
end
