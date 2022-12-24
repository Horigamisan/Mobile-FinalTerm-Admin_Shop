const { Vonage } = require('@vonage/server-sdk');
const Nexmo = require('nexmo');

const nexmo = new Nexmo(
	{
		apiKey: '41eddb0f',
		apiSecret: 'FDuwgVX5XejW0zvb',
	},
	{ debug: true }
);

const vonage = new Vonage(
	{
		apiKey: '41eddb0f',
		apiSecret: 'FDuwgVX5XejW0zvb',
	},
	{ debug: true }
);

const from = 'Vonage APIs';
const to = '84898228317';
const text = 'A text message sent using the Vonage SMS API';

// nexmo.message.sendSms(from, to, text, , {}, (err, responseData) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		if (responseData.messages[0]['status'] === '0') {
// 			console.log('Message sent successfully.');
// 		} else {
// 			console.log(
// 				`Message failed with error: ${responseData.messages[0]['error-text']}`
// 			);
// 		}
// 	}
// });

(async () => {
	await vonage.sms
		.send({ from, to, text })
		.then((resp) => {
			console.log('Message sent successfully');
			console.log(resp);
		})
		.catch((err) => {
			console.log('There was an error sending the messages.');
			console.error(err);
		});
})();
