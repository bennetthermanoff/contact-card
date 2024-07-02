import { Express, RequestHandler } from 'express';
import { eventsDB, contactsDB } from '../models';
import multer from 'multer';
import sharp from 'sharp';

export const useEventRoutes = (app:Express, upload:multer.Multer) => {
	app.post('/event/create', upload.single('icon'), createEvent);
	app.get('/event/:id/:adminSecret', getEvent);
	app.delete('/event/:id/:adminSecret', deleteEvent);
	app.put('/event/:id/:adminSecret', upload.single('icon'), updateEvent);

};

type createEventBody = {
    name:string,
    password:string
    primaryColor?:string,
    secondaryColor?:string,
};
const createEvent:RequestHandler = async (req, res) => {
	const { name, password, primaryColor, secondaryColor } = req.body as createEventBody;
	const icon = req.file;

	try {
		if (!name || !password) {
			res.status(400).send('Missing required fields');
			return;
		}
		if (password !== process.env.GLOBAL_PASSWORD) {
			res.status(401).send('Unauthorized');
			return;
		}
		const iconBuffer = icon ? await sharp(icon.buffer).jpeg().resize(256,256).toBuffer() : null;
		const iconURI = iconBuffer ? `data:image/jpeg;base64,${iconBuffer.toString('base64')}` : null;

		const event = await eventsDB.create({ name, adminSecret: process.env.GLOBAL_PASSWORD, registerSecret: process.env.GLOBAL_PASSWORD, icon: iconURI, primaryColor, secondaryColor });

		res.status(201).send(event);
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

const getEvent:RequestHandler = async (req, res) => {
	try {
		const { id, adminSecret } = req.params;
		if (!id || !adminSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		const event = await eventsDB.findOne({ where:{ id, adminSecret } });
		if (!event) {
			res.status(404).send('Event not found');
			return;
		}
		res.send(event);
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

type deleteEventBody = {
    adminSecret:string
};
const deleteEvent:RequestHandler = async (req, res) => {
	try {
		const { id, adminSecret } = req.params;
		const { adminSecret: bodyAdminSecret } = req.body as deleteEventBody;
		if (!id || !adminSecret || !bodyAdminSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		if (adminSecret !== bodyAdminSecret) {
			res.status(401).send('Unauthorized');
			return;
		}
		const event = await eventsDB.findOne({ where:{ id, adminSecret } });
		if (!event) {
			res.status(404).send('Event not found');
			return;
		}
		await event.destroy();
		// Delete all contacts associated with the event
		await contactsDB.destroy({ where:{ eventId: id } });
		res.send('Event deleted');
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

type updateEventBody = {
    name?:string,
    primaryColor?:string,
    secondaryColor?:string,
}
const updateEvent:RequestHandler = async (req, res) => {
	try {
		const { id, adminSecret } = req.params;
		const { name, primaryColor, secondaryColor } = req.body as updateEventBody;
		const icon = req.file;
		if (!id || !adminSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		const event = await eventsDB.findOne({ where:{ id, adminSecret } });
		if (!event) {
			res.status(404).send('Event not found');
			return;
		}
		const iconBuffer = icon ? await sharp(icon.buffer).jpeg().resize(256,256).toBuffer() : undefined;
		const iconURI = iconBuffer ? `data:image/jpeg;base64,${iconBuffer.toString('base64')}` : undefined;

		await event.update({ name, icon: iconURI, primaryColor, secondaryColor });
		res.send(event);
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};