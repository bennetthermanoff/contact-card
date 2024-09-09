import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

let PORT = 28873;
const app = express();
import path from 'path';
import { useContactRoutes } from './api/contacts';
import { useEventRoutes } from './api/events';
import { log } from 'console';

const storage = multer.memoryStorage();
const filter = (req: any, file: any, cb: any) => {
	//only images, including newer formats and xlsx
	const ext = path.extname(file.originalname);

	if (file.mimetype.startsWith('image') || 
	file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	|| ext === '.HEIF' || ext === '.HEIC' || ext === '.heif' || ext === '.heic') {
		cb(null, true);
	} else {
		console.log(file);
		cb(new Error('Invalid file type'), false);
	}
};
const upload = multer({ storage, fileFilter: filter });


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
