import { Express, RequestHandler } from 'express';
import { eventsDB, contactsDB } from '../models';
import vCardsJS from 'vcards-js';
import vcard from 'vcard';
import multer from 'multer';
import sharp from 'sharp';
import { ContactModel } from '../models/contacts';
import { getEntry } from '../types/vcardjson';
import xlsx from 'node-xlsx';
import { PhotoBinaryContact, PhotoNameContact } from '../types/importContactTypes';
import { EventModel } from '../models/events';
import { Op } from 'sequelize';


const MAX_CONTACT_UPLOAD = 500;
export const useContactRoutes = (app:Express, upload:multer.Multer):void => {
	app.get('/api/contacts/single/:id', getContact);
	app.get('/api/contacts/all/:eventId/:adminSecret', getAllContacts);
	app.get('/api/contacts/pdf/:eventId/:adminSecret', getAllContactsPdf);
	app.post('/api/contacts/single', upload.single('photo'), createContact);
	app.put('/api/contacts/:id', upload.single('photo'), updateContact);
	app.post('/api/contacts/delete/', deleteContact);
	app.post('/api/contacts/', upload.fields([{ name:'photos', maxCount:MAX_CONTACT_UPLOAD },{ name:'xlsx', maxCount:1 }]), createContacts);
};


type createContactBody = {
    name:string,
    pronouns?:string,
    role?:string, //year, major, etc
    tags?:string, //comma separated list of tags
    note?:string, //anything! Introduction, etc
    eventId:string,
    eventRegistrationSecret:string
};
const createContact:RequestHandler = async (req, res) => {
	const { name, pronouns, role, tags, note, eventId, eventRegistrationSecret } = req.body as createContactBody;
	const photo = req.file;

	try {
		if (!name || !eventId || !eventRegistrationSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		const event = await eventsDB.findOne({ where:{ id:eventId, registerSecret:eventRegistrationSecret } });
		if (!event) {
			res.status(401).send('Unauthorized');
			return;
		}
		const photoBuffer = photo ? await sharp(photo.buffer).jpeg().resize(512,512).withMetadata().toBuffer() : null;
		const photoURI = photoBuffer ? photoBuffer.toString('base64') : null;
		const vCard = vCardsJS();
		vCard.firstName = name;
		vCard.organization = tags as string;
		vCard.photo.embedFromString(photoURI as string, 'image/jpeg');
		vCard.note = (note as string).replace(/(\r\n|\n|\r)/gm, '\u000A');
		vCard.role = role as string;
		vCard.title = pronouns as string;
		vCard.version = '3.0';
		const vCardString = vCard.getFormattedString();
        
		const contact = await contactsDB.create({ vcard:vCardString, eventId });
		res.status(201).send(contact);
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

const getContact:RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const contact = await contactsDB.findOne({ where:{ id } }).then((contact) =>contact?.toJSON() as ContactModel);
		const card = new vcard();
		card.readData(contact.vcard, (err:any, json:any) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: err });
			} else {
				res.status(200).json(json);
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};
const getAllContacts:RequestHandler = async (req, res) => {
	const card = new vcard();
	const { eventId, adminSecret } = req.params;
	const event = await eventsDB.findOne({ where:{ id:eventId, adminSecret } }).then((event) => event?.toJSON() as EventModel);
	if (!event) {
		res.status(401).send('Unauthorized');
		return;
	}
	const contacts = await contactsDB.findAll({ where:{ eventId } }).then((contacts) => contacts.map((contact) => contact.toJSON() as ContactModel));
	const people: any[] = [];
	for (const contact of contacts) {
		card.readData(contact.vcard, (err: any, json: any) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: err });
			} else {
				//add id to json, id has no spaces
				json.id = contact.id.split('.')[0].replace(/\s/g, '');
				people.push(json);
			}
		});
	}
	res.status(200).json(people);
};

const getAllContactsPdf:RequestHandler = async (req, res) => {
	const card = new vcard();
	const { eventId , adminSecret } = req.params;
	const event = await eventsDB.findOne({ where:{ id:eventId, adminSecret } }).then((event) => event?.toJSON() as EventModel);
	if (!event) {
		res.status(401).send('Unauthorized');
		return;
	}
	const contacts = await contactsDB.findAll().then((contacts) => contacts.map((contact) => contact.toJSON() as ContactModel));
	const people: any[] = [];
	for (const contact of contacts) {
		card.readData(contact.vcard, (err: any, json: any) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: err });
			} else {
				//remove photo from json
				delete json.PHOTO;
				//add id to json, id has no spaces
				json.id = contact.id.split('.')[0].replace(/\s/g, '');
				people.push(json);
			}
		});
	}
	res.status(200).json(people);
};

const extractPhotoBase64 = (vcardText:string)=> {
	const regex = /PHOTO;.*?:(.*?)(?=\n)/s;
	const match = vcardText.match(regex);
  
	if (match && match[1]) {
		return match[1];
	}
  
	return null;
};

type updateContactBody = {
    name?:string,
    pronouns?:string,
    role?:string, //year, major, etc
    tags?:string, //comma separated list of tags
    note?:string, //anything! Introduction, etc
    eventId?:string,
    adminSecret:string
};
const updateContact:RequestHandler = async (req, res) => {
	const { id } = req.params;
	const { name, pronouns, role, tags, note, eventId, adminSecret } = req.body as updateContactBody;
	const photo = req.file;
	

	try {
		if (!id || !adminSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		const contact = await contactsDB.findOne({ where:{ id } }).then((contact) => contact?.toJSON() as ContactModel);
		if (!contact) {
			res.status(404).send('Contact not found');
			return;
		}
		const event = await eventsDB.findOne({ where:{ id:eventId, adminSecret } }).then((event) => event?.toJSON() as EventModel);
		if (!event) {
			res.status(401).send('Unauthorized');
			return;
		}

		if (contact.eventId !== eventId) {
			res.status(401).send('Unauthorized');
			return;
		}
		const oldPhoto = extractPhotoBase64(contact.vcard);

		const photoBuffer = photo ? await sharp(photo.buffer).jpeg().resize(512,512).withMetadata().toBuffer() : null;
		const photoURI = photoBuffer ? photoBuffer.toString('base64') : oldPhoto;
		const vCard = vCardsJS();
		vCard.firstName = name ? name : getEntry(contact, 'FN') as string;
		vCard.organization = tags ? tags : getEntry(contact, 'ORG') as string;
		vCard.photo.embedFromString(photoURI as string, 'image/jpeg');
		vCard.note = note ? (note as string).replace(/(\r\n|\n|\r)/gm, '\u000A')
			: getEntry(contact, 'NOTE') as string;
		vCard.role = role ? role : getEntry(contact, 'ROLE') as string;
		vCard.title = pronouns ? pronouns : getEntry(contact, 'TITLE') as string;
		vCard.version = '3.0';
		const vCardString = vCard.getFormattedString();
		await contactsDB.update({ vcard:vCardString }, { where:{ id } });
		res.send('Contact updated');
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

const deleteContact:RequestHandler = async (req, res) => {
	const { adminSecret, ids } = req.body as { adminSecret:string, ids:string[] };
	try {
		if (!ids || !adminSecret) {
			res.status(400).send('Missing required fields');
			return;
		}
		const event = await eventsDB.findOne({ where:{ adminSecret } }).then((event) => event?.toJSON() as EventModel);
		if (!event) {
			res.status(401).send('Unauthorized');
			return;
		}
		await contactsDB.destroy({ where:{ id:ids, eventId:event.id } });
		res.send('Contacts deleted');
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};

type cell = {id:number,name:string};
type createContactsBody = {
    columnLookup:{
		photoName:cell,
		name:cell,
		pronouns:cell,
		year:cell,
		description:cell,
		majors:cell
	}
    eventId:string,
    adminSecret:string,
};
const createContacts:RequestHandler = async (req, res) => {
	const { columnLookup, adminSecret, eventId } = JSON.parse(req.body.body) as createContactsBody;
	const contacts:Array<PhotoNameContact> = [];
	
	
	const { photos, xlsx: xlsxFile } = req.files as { photos:Express.Multer.File[], xlsx:Express.Multer.File[] };
	console.log(req.files);
	try {
		if (!columnLookup || !adminSecret || !eventId ) {
			console.log({ columnLookup, adminSecret, eventId });
			
			res.status(400).send('Missing required fields');
			return;
		}
		if (xlsxFile.length !== 1){
			res.status(400).send('Only one xlsx file allowed');
		}
		const event = await eventsDB.findOne({ where:{ id:eventId, adminSecret } }).then((event) => event?.toJSON() as EventModel);

		
		const worksheetFromFile = xlsx.parse(xlsxFile[0].buffer)[0];
		for (let i = 1; i < worksheetFromFile.data.length; i++){
			const contact: PhotoNameContact = {
				photoName: undefined,
				id: undefined,
				name: undefined,
				pronouns: undefined,
				year: undefined,
				description: undefined,
				majors: undefined
			};
			const row = worksheetFromFile.data[i];
			for (const [key, value] of Object.entries(columnLookup)){
				if (value.id === -1){
					continue;
				}
				//replace semicolon with lookalike
				const field:string = row[value.id];
				contact[key as keyof PhotoNameContact] = field;
			}
			contacts.push(contact);
		}
		
		Promise.all(contacts.map( async(contact:PhotoNameContact) => {
			const photoBinaryContact:PhotoBinaryContact = {
				id: contact.id,
				name: contact.name,
				pronouns: contact.pronouns,
				year: contact.year,
				description: contact.description,
				majors: contact.majors,
				photoBinary: undefined,
				photoType: undefined
			};
			const photoName = contact.photoName;
			if (photoName === undefined){
				return photoBinaryContact;
			}
			
			const photoNameSplit = photoName.split('.');
			const photoNameWithoutExtension = photoNameSplit.slice(0, photoNameSplit.length - 1).join('.');
			const photo = photos.find((photo) => photo.originalname.includes(photoNameWithoutExtension));
			if (!photo){
				console.log(`Photo ${photoName} does not exist`);
				return photoBinaryContact;
			}
			const photoBuffer = await sharp(photo.buffer).jpeg().resize(512,512).withMetadata().toBuffer();
			photoBinaryContact.photoBinary = photoBuffer.toString('base64');
			photoBinaryContact.photoType = 'image/jpeg';
			return photoBinaryContact;

		})).then((photoBinaryContacts:PhotoBinaryContact[]) => {
			Promise.all(photoBinaryContacts.map(async(contact:PhotoBinaryContact) => {
				const vCard = vCardsJS();
				vCard.firstName = contact.name as string;
				vCard.organization = contact.majors as string;
				vCard.photo.embedFromString(contact.photoBinary as string, contact.photoType as string);
				vCard.note = contact.description as string;
				vCard.role = contact.year as string;
				vCard.title = contact.pronouns as string;
				vCard.version = '3.0';
				const vCardString = vCard.getFormattedString();
				//check if contact already exists
				const existingContact = await contactsDB.findOne({ where:{ 
					vcard:{
						[Op.like]:`%FN;CHARSET=UTF-8:${contact.name}%`
					},
					eventId
				} }).then((contact) => contact?.toJSON() as ContactModel);
				const contactAlreadyExists = existingContact !== undefined;
				if (!contactAlreadyExists && contact.name){
					return contactsDB.create({ vcard:vCardString, eventId });
				}
			})).then(() => {
				res.send('Contacts created');
			});
		});
	}
	catch (e){
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
};
