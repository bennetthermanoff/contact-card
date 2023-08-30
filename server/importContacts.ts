import fs from 'fs';
import vCardsJS from 'vcards-js';
import prompts from 'prompts';
import xlsx from 'node-xlsx';
import { PhotoBinaryContact, PhotoNameContact } from './types/importContactTypes';


type columnLookup = {
    [key:string]:number;
};
const worksheetFromFile = xlsx.parse('./contacts.xlsx')[0];
const csvColumns = worksheetFromFile.data[0];
csvColumns.forEach((column:string, index:number) => {
	console.log(`${index}: ${column}`);
});
const neededColumns = ['name', 'pronouns', 'year', 'description', 'majors', 'photoName'];

const promptUserForColumns = async (csvColumns:string[]):Promise<columnLookup> => {
	const columnLookup:columnLookup = {};
	for (const column of neededColumns){
		let columnNumber = -1;
		while (columnNumber === -1){
			const response = await prompts({
				type: 'number',
				name: 'columnNumber',
				message:`What column index is the ${column} column?`, 
				validate: (value:number) => {
					if (value < 0 || value >= csvColumns.length){
						return `Column index must be between 0 and ${csvColumns.length - 1}`;
					}
					//if ctrl-c is pressed
					if (value === undefined){
						process.exit(0);
					}
					return true;
				}
			});
			columnNumber = response.columnNumber;
		}
		columnLookup[column] = columnNumber;
	}
	console.log(columnLookup);
	return columnLookup;
};

const getPhotoBinary = async (nameContact:PhotoNameContact):Promise<PhotoBinaryContact> => {
	const photoBinaryContact:PhotoBinaryContact = {
		id: nameContact.id,
		name: nameContact.name,
		pronouns: nameContact.pronouns,
		year: nameContact.year,
		description: nameContact.description,
		majors: nameContact.majors,
		photoBinary: undefined,
		photoType: undefined
	};
	const photoName = nameContact.photoName;
	if (photoName === undefined){
		return photoBinaryContact;
	}
	const photoPath = `./photos/${photoName}`;
	if (!fs.existsSync(photoPath)){
		console.log(`Photo ${photoName} does not exist`);
		return photoBinaryContact;
	}
	const photo = fs.readFileSync(photoPath);
	photoBinaryContact.photoBinary = photo.toString('base64');
	photoBinaryContact.photoType = 'image/' + photoName.split('.')[photoName.split('.').length - 1];
	return photoBinaryContact;
};



promptUserForColumns(csvColumns).then((columnLookup:columnLookup) => {
	const contacts:Array<PhotoNameContact> = [];
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
		for (const column of neededColumns){// replace colon with unicode colon
			contact[column as keyof PhotoNameContact] = (worksheetFromFile.data[i][columnLookup[column]]).toString().replace(':', '：');
		}
		contacts.push(contact);
	}
	console.log(contacts);
	const photoBinaryContacts = contacts.map((contact:PhotoNameContact) => getPhotoBinary(contact));
	Promise.all(photoBinaryContacts).then((photoBinaryContacts:PhotoBinaryContact[]) => {
		const contactFiles = photoBinaryContacts.map((contact:PhotoBinaryContact) => createContactFile(contact));
		console.log(contactFiles);
		contactFiles.forEach((contactFile:string) => {
			console.log(`Created contact file ${contactFile}.vcf`);
		});
		//output json of contact ids:
		const contactIds = contactFiles.map((contactFile:string) => contactFile.split('.')[0] + '\n');
		fs.writeFileSync('./contactIds.json', JSON.stringify(contactIds));	
	});
		
});





const createContactFile = (contact:PhotoBinaryContact):string => {
	const { name, pronouns, year, description, majors, photoBinary, photoType } = contact;
	const id = (name as string).replace(/\s/g, '');
	const vCard = vCardsJS();
	vCard.firstName = name as string;
	vCard.organization = majors as string;
	vCard.photo.embedFromString(photoBinary as string, photoType as string);
	vCard.note = description as string;
	vCard.role = year as string;
	vCard.title = pronouns as string;
	vCard.version = '3.0';
	let fileName = id;
	while (fs.existsSync(`./contacts/${fileName}.vcf`)){
		fileName += Math.floor(Math.random() * 100);
	}
	vCard.saveToFile(`./contacts/${fileName}.vcf`);
	return fileName;
};