/* eslint-disable @typescript-eslint/no-explicit-any */
import vcard from 'vcard';
import express from 'express';
import fs from 'fs';
export const getPerson = async (
	req: express.Request,
	res: express.Response,
) => {
	const { id } = req.params;
	getPersonFromVcard(id, res);
};
export const getPersonFromVcard = (id: string, res: express.Response) => {
	const card = new vcard();
	try {
		const readFile = fs.readFileSync(`./contacts/${id}.vcf`, 'utf8');
		card.readData(readFile, (err: any, json: any) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: err });
			} else {
				res.status(200).json(json);
				if (fs.existsSync('./log.txt') === false){
					fs.writeFileSync('./log.txt', '');
				}
				fs.appendFileSync( './log.txt', `${new Date().toISOString()}, ${id} \n`);	
			}
		});
	} catch (err) {
		res.status(500).json({ error: err });
	}
};
export const getAllPeople = (req: express.Request,res: express.Response) => {
	const card = new vcard();
	const people: any[] = [];
	try {
		const files = fs.readdirSync('./contacts');
		for (const file of files) {
			const readFile = fs.readFileSync(`./contacts/${file}`, 'utf8');
			card.readData(readFile, (err: any, json: any) => {
				if (err) {
					console.log(err);
					res.status(500).json({ error: err });
				} else {
					//remove photo from json
					delete json.PHOTO;
					//add id to json, id has no spaces
					json.id = file.split('.')[0].replace(/\s/g, '');
					people.push(json);
				}
			});
		}
		res.status(200).json(people);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};
export const getLastPeople = (req: express.Request,res: express.Response) => {
	const card = new vcard();
	const people: any[] = [];
	try {
		const files = fs.readdirSync('./contacts');
		const lastIdFile = fs.readFileSync('./contactIds.json', 'utf8');
		const lastIds:string[] = JSON.parse(lastIdFile);
		for (const file of files) {
			if (lastIds.includes(file.split('.')[0])){
				const readFile = fs.readFileSync(`./contacts/${file}`, 'utf8');
				card.readData(readFile, (err: any, json: any) => {
					if (err) {
						console.log(err);
						res.status(500).json({ error: err });
					} else {
					//remove photo from json
						delete json.PHOTO;
						//add id to json, id has no spaces
						json.id = file.split('.')[0].replace(/\s/g, '');
						people.push(json);
					}
				});
			}
		}
		res.status(200).json(people);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};
