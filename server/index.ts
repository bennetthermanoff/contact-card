import express from 'express';
import multer from 'multer';


let PORT = 3001;
const app = express();
import path from 'path';
import { useContactRoutes } from './api/contacts';
import { useEventRoutes } from './api/events';

const upload = multer({ dest: './uploads/' });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
useContactRoutes(app, upload);
useEventRoutes(app, upload);
//set upload limit to 1gb
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));



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
