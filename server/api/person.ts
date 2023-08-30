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
			}
		});
	} catch (err) {
		console.log(err);
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
