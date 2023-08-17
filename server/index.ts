import express from 'express';
import { getPerson } from './api/person';
import { getVcardFile, createVcardFile } from './api/vcard';
let PORT = 3001;
const app = express();
import path from 'path';

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get('/api/person/:id', getPerson);
app.get('/api/vcard/:id', getVcardFile);
app.post('/api/vcard', createVcardFile);

if (process.env.IS_PROD) {
	if (process.pid) {
		console.log('This process is running on pid ' + process.pid);
	}
	PORT = 3000;
	app.use(express.static(path.join(__dirname, '../client/build')));
	console.log('IS_PROD');
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build/index.html'));
	});
	process.on('unhandledRejection', (reason, p) => {
		console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
		// application specific logging, throwing an error, or other logic here
	});
}


app.listen(PORT, () => console.log('Server running'));
