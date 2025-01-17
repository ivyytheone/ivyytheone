(function(){

	window.Phone = {};
	Phone.apps = {};
	Phone.opened = [];
	Phone.contacts = [];
	Phone.messages = [];
	Phone.tweets = [];
	Phone.appData = {};

	Phone.contacts.sort((a,b) => a.name.localeCompare(b.name));

	Phone.move = function(direction) {

		const currrent = this.current();

		if(currrent != null)
			this.apps[currrent].move(direction);

	}

	Phone.enter = function(direction) {

		const currrent = this.current();

		if(currrent != null)
			this.apps[currrent].enter();

	}

	Phone.open = function(appName, data = {}) {
		
		Phone.appData[appName] = data;
		Phone.opened.push(appName);

		Phone.apps[appName].open(data);
		
		$('.app').hide();
		$('#app-' + appName).show();

	}

	Phone.addContact = function(name, number) {
		this.contacts.push({name, number});
		this.contacts.sort((a,b) => a.name.localeCompare(b.name));
	}

	Phone.close = function() {
			
		const currrent = this.current();

		if(currrent != null) {

			if(typeof this.apps[this.current()].close != 'undefined') {
				
				const canClose = this.apps[this.current()].close();

				if(canClose) {

					this.opened.pop();

					if(this.opened.length > 0) {

						Phone.apps[this.current()].open(this.appData[this.current()]);

						$('.app').hide();
						$('#app-' + this.current()).show();
					}

				}
			} else {

				this.opened.pop();

				if(this.opened.length > 0) {

					Phone.apps[this.current()].open(this.appData[this.current()]);
				
					$('#phone').css("background-image", "url(https://cdn.discordapp.com/attachments/564475496419557386/647621628678897683/phone.png)")
					$('.status-bar .status').css("background-image", "url(https://cdn.discordapp.com/attachments/564475496419557386/647641917684842509/Untitled-1.png)")
					$('.status-bar').css("color", "#ddd");
					
					$('.app').hide();
					$('#app-' + this.current()).show();
				}else {
					$.post('http://esx_phone3/escape');
					$('#phone').hide();
				}
			
			} 

		}

	}

	Phone.current = function() {
		return this.opened[this.opened.length - 1] || null;
	}

	document.onkeyup = function(e) {

		switch(e.which) {

			// ESC
			case 27 : {
				Phone.close();
				break;
			}

			// ENTER
			case 13: {
				Phone.enter();
				break;
			}

			// U
			/*case 71: {
					
					if(Phone.current() === 'contact-action-message') {
						Phone.apps['contact-action-message'].activateGPS()
					}

				break;
			}*/

		}

	}

	document.onkeydown = function (e) {

		switch(e.which) {

			case 38: {
				Phone.move('TOP');
				break;
			}

			case 40: {
				Phone.move('DOWN');
				break;
			}

			case 37: {
				Phone.move('LEFT');
				break;
			}

			case 39: {
				Phone.move('RIGHT');
				break;
			}

			default: break;
		}
	};

	window.onData = function(data){

		if(data.controlPressed === true) {

			switch(data.control) {

				case 'TOP': Phone.move('TOP'); break;
				case 'DOWN': Phone.move('DOWN'); break;
				case 'LEFT': Phone.move('LEFT'); break;
				case 'RIGHT': Phone.move('RIGHT'); break;
				case 'ENTER': Phone.enter(); break;
				case 'BACKSPACE': Phone.close(); break;

				default: break;

			}
		}

		if(data.showPhone === true) {

			Phone.opened.length = 0;

			Phone.open('home');

			$('#phone').show();
		}

		if(data.showPhone === false) {
			$('#phone').hide();
		}

		if(data.reloadPhone == true) {

			Phone.contacts.length = 0;
			Phone.apps['twitter'].registerCharacterName(data.phoneData.characterName);

			$('#app-contacts .contact-me .contact-number').text(data.phoneData.phoneNumber);

			for(let i=0; i<data.phoneData.contacts.length; i++)
				Phone.addContact(data.phoneData.contacts[i].name, data.phoneData.contacts[i].number);

		}

		if(data.incomingCall === true) {
			let name = "";
			
			if (data.emergency) {
				name = "Växeln";
			}

			for(let i=0; i<Phone.contacts.length; i++)
				if(Phone.contacts[i].number == data.number)
					if (!data.emergency) {
						name = Phone.contacts[i].name;
					}

					Phone.open('incoming-call', {
						["name"]: name,
						["target"]: data.target,
						["channel"]: data.channel,
						["number"]: data.number,
					});

		}

		if(data.acceptedCall === true) {
			Phone.apps['contact-action-call'].startCall(data.channel, data.target);
		}

		if(data.endCall === true) {
			Phone.close();
		}

		if(data.newMessage === true) {

			const date = new Date();

			Phone.messages.push({
				["number"]: data.phoneNumber,
				["body"]: data.message,
				["position"]: data.position,
				["anon"]: data.anon,
				["job"]: data.job,
				["self"]: false,
				["time"]: date.toISOString().substring(0, 10) + " " + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0'),
				["timestamp"]: +date,
				["read"]: false
			});
		}

		if(data.newTweet === true) {

			const date = new Date();

			Phone.tweets.push({
				["time"]: date.toISOString().substring(0, 10) + " " + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0'),
				["body"]: data.message,
				["read"]: false
			});
		}

		if(data.reloadTweets === true) {

			Phone.tweets.push({
				["time"]: data.date,
				["body"]: data.message,
				["read"]: true
			});
		}

		if(data.contactAdded === true) {
			Phone.addContact(data.name, data.number);
		}

		if(data.activateGPS === true && Phone.current() === 'contact-action-message') {
			Phone.apps['contact-action-message'].activateGPS()
		}
	}

	window.onload = function(e){
		window.addEventListener('message', function(event){
			onData(event.data);
		});
	}

	setInterval(() => {

		const date = new Date;

		$('.status-bar .time .hour')  .text(date.getHours()  .toString().padStart(2, '0'));
		$('.status-bar .time .minute').text(date.getMinutes().toString().padStart(2, '0'));

	}, 1000);

})();
