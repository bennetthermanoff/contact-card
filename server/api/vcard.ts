import express from 'express';
import fs from 'fs';
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

// export const createVcardFile = async (
// 	req: express.Request,
// 	res: express.Response,
// ) => {
// 	try {
// 		const { id, name, pronouns, year, description, majors, photoBinary, photoType  } = req.body;
// 		const vCard = vCardsJS();
// 		vCard.firstName = name;
// 		vCard.organization = majors;
// 		vCard.photo.embedFromString(photoBinary, photoType);
// 		vCard.note = description;
// 		vCard.role = year;
// 		vCard.title = pronouns;
// 		vCard.version = '3.0';
// 		let fileName = id;
// 		while (fs.existsSync(`./contacts/${fileName}.vcf`)){
// 			fileName += Math.floor(Math.random() * 100);
// 		}
// 		vCard.saveToFile(`./contacts/${fileName}.vcf`);
// 		res.status(200).json({ message: 'Success' , newId: fileName });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: 'Server Error' });
// 	}
// };

	
