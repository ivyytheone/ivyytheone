fx_version 'adamant'

game 'gta5'

client_scripts {
	'client/*.lua'
} 

server_scripts { 
	'@mysql-async/lib/MySQL.lua',
	'server/*.lua'
} 

ui_page "nui/index.html" 

files {
    'nui/**/**/**/**', 
}

shared_script {
	'config.lua'
}