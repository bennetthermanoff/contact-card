import express from 'express';
import { getPerson } from './api/person';
import { getVcardFile } from './api/vcard';
let PORT = 3001;
const app = express();
import path from 'path';

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get('/api/person/:id', getPerson);
app.get('/api/vcard/:id', getVcardFile);
if (process.env.IS_PROD) {
	PORT = 3000;
	app.use(express.static(path.join(__dirname, '../client/build')));
	console.log('IS_PROD');
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build/index.html'));
	});
}


app.listen(PORT, () => console.log('Server running'));
