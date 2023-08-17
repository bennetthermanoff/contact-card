import express from 'express';
import { vCardsJs } from 'vcards-js';
export const getVcardFile = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const { id } = req.params;
		res.download(`./contacts/${id}.vcf`);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

export const createVcardFile = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const { id, name, pronouns, year, description, majors, photoBinary, photoType  } = req.body;
		const vCard = vCardsJs();
		vCard.firstName = name;
		vCard.organization = majors;
		vCard.photo.embedFromString(photoBinary, photoType);
		vCard.note = description;
		vCard.role = year;
		vCard.suffix = pronouns;
		vCard.version = '3.0';
		vCard.saveToFile(`./contacts/${id}.vcf`);
		const output = vCard.getFormattedString();
		res.status(200).json({ message: 'Success' , output });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

	
