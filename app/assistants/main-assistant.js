function MainAssistant() {}

MainAssistant.prototype.setup = function()
{
	try
	{
		this.ipkgServiceVersion = 12;
		
		$$('body')[0].addClassName('palm-dark');
		$$('body')[0].removeClassName('palm-default');
		
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, { visible: false });
		
		this.controller.setupWidget
		(
			'Rescan',
			this.attributes = 
			{
				type: Mojo.Widget.activityButton
			},
			this.model =
			{
				buttonLabel: 'Rescan',
				buttonClass: 'palm-button',
				disabled: false
			}
		);
		this.controller.setupWidget
		(
			'RestartLuna',
			this.attributes = 
			{
				type: Mojo.Widget.activityButton
			},
			this.model =
			{
				buttonLabel: 'Restart Luna',
				buttonClass: 'palm-button',
				disabled: false
			}
		);
		this.controller.setupWidget
		(
			'RestartJava',
			this.attributes = 
			{
				type: Mojo.Widget.activityButton
			},
			this.model =
			{
				buttonLabel: 'Restart Java',
				buttonClass: 'palm-button',
				disabled: false
			}
		);
		
		this.controller.listen('Rescan',	Mojo.Event.tap, this.doRescan.bindAsEventListener(this));
		this.controller.listen('RestartLuna',	Mojo.Event.tap, this.doRestartLuna.bindAsEventListener(this));
		this.controller.listen('RestartJava',	Mojo.Event.tap, this.doRestartJava.bindAsEventListener(this));
		
		var r = new Mojo.Service.Request
		(
			'palm://org.webosinternals.ipkgservice',
			{
				method: 'version',
				onSuccess: this.callbackFunction.bindAsEventListener(this),
				onFailure: this.callbackFunction.bindAsEventListener(this)
			}
		);

	}
	catch (e)
	{
		Mojo.Log.logException(e, 'main#setup');
		this.alertMessage('main#setup Error', e);
	}
}

MainAssistant.prototype.callbackFunction = function(payload, item)
{
	//for (p in payload) alert(p + ': ' + payload[p]);
	
	if (!payload) 
	{
		this.alertMessage('Luna Manager', $L("Cannot access the service. Have you installed Preware? If so, reboot your phone and try again."));
	}
	else if (payload.errorCode == -1 && item != 'RestartJava') 
	{
		if (payload.errorText == "org.webosinternals.ipkgservice is not running.") 
		{
			this.alertMessage('Luna Manager', $L("The service is not running. Have you installed Preware? If so, reboot your phone and try again."));
		}
		else 
		{
			this.alertMessage('Luna Manager', payload.errorText);
		}
	}
	else if (payload.errorCode == "ErrorGenericUnknownMethod") 
	{
		this.alertMessage('Luna Manager', $L("The service version is too old. First try rebooting your phone, or reinstall Preware and try again."));
	}
	else 
	{
		if (payload.apiVersion && payload.apiVersion < this.ipkgServiceVersion) 
		{
			this.alertMessage('Luna Manager', $L("The service version is too old. First try rebooting your phone, or reinstall Preware and try again."));
		}
	}
	
	if (item) this.controller.get(item).mojo.deactivate();
}

MainAssistant.prototype.doRescan = function()
{
	try
	{
		var r = new Mojo.Service.Request
		(
			'palm://org.webosinternals.ipkgservice',
			{
				method: 'rescan',
				onSuccess: this.callbackFunction.bindAsEventListener(this, 'Rescan'),
				onFailure: this.callbackFunction.bindAsEventListener(this, 'Rescan')
			}
		);
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'main#doRescan');
		this.alertMessage('main#doRescan Error', e);
	}
}

MainAssistant.prototype.doRestartLuna = function()
{
	try
	{
		var r = new Mojo.Service.Request
		(
			'luna://org.webosinternals.ipkgservice',
			{
				method: 'restartLuna',
				onSuccess: this.callbackFunction.bindAsEventListener(this, 'RestartLuna'),
				onFailure: this.callbackFunction.bindAsEventListener(this, 'RestartLuna')
			}
		);
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'main#doRestartLuna');
		this.alertMessage('main#doRestartLuna Error', e);
	}
}

MainAssistant.prototype.doRestartJava = function()
{
	try
	{
		var r = new Mojo.Service.Request
		(
			'palm://org.webosinternals.ipkgservice',
			{
				method: 'restartJava',
				onSuccess: this.callbackFunction.bindAsEventListener(this, 'RestartJava'),
				onFailure: this.callbackFunction.bindAsEventListener(this, 'RestartJava')
			}
		);
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'main#doRestartJava');
		this.alertMessage('main#doRestartJava Error', e);
	}
}


MainAssistant.prototype.alertMessage = function(title, message)
{
	this.controller.showAlertDialog(
	{
	    onChoose: function(value) {},
		allowHTMLMessage: true,
	    title: title,
	    message: message,
	    choices:[{label:$L('Ok'), value:""}]
    });
}

MainAssistant.prototype.activate = function(event) {}

MainAssistant.prototype.deactivate = function(event) {}

MainAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening('Rescan',		Mojo.Event.tap, this.doRescan.bindAsEventListener(this));
	this.controller.stopListening('RestartLuna',	Mojo.Event.tap, this.doRestartLuna.bindAsEventListener(this));
	this.controller.stopListening('RestartJava',	Mojo.Event.tap, this.doRestartJava.bindAsEventListener(this));
}
