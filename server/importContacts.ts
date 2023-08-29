
// import vCardsJS from '@tapni/vcards-js';
import fs from 'fs';
import prompt from 'prompt';

const contactCSV = fs.readFileSync('./contacts/import.csv', 'utf8');


type columnLookup = {
    [key:string]:number;
};
const neededColumns = ['id', 'name', 'pronouns', 'year', 'description', 'majors', 'photo'];

const promptUserForColumns = async (csvColumns:string[]):Promise<columnLookup> => {
	prompt.start();
	const columnLookup:columnLookup = {};
	console.log(`Columns in CSV with index: ${csvColumns.map((column, index) => `${column}: ${index}`).join(', ')}`);
	for (const column of neededColumns){
		let columnNumber = -1;
		while (columnNumber === -1){
			console.log(`Please enter the column index for ${column}`);
			await prompt.get(['columnNumber'], (err, result) => {
				if (result.columnNumber)
					columnNumber = result.columnNumber as number;
			});
            
		}
		columnLookup[column] = columnNumber;
	}
	console.log(columnLookup);
	return columnLookup;
};
promptUserForColumns(contactCSV.split('\n')[0].split(','));




// const createContactFile = ({ id, name, pronouns, year, description, majors, photoBinary, photoType  }:{
//     id:string;
//     name:string;
//     pronouns:string;
//     year:string,
//     description:string;
//     majors:string;
//     photoBinary:string;
//     photoType:string;
// }):string => {

// 	const vCard = vCardsJS();
// 	vCard.firstName = name;
// 	vCard.organization = majors;
// 	vCard.photo.embedFromString(photoBinary, photoType);
// 	vCard.note = description;
// 	vCard.role = year;
// 	vCard.title = pronouns;
// 	vCard.version = '3.0';
// 	let fileName = id;
// 	while (fs.existsSync(`./contacts/${fileName}.vcf`)){
// 		fileName += Math.floor(Math.random() * 100);
// 	}
// 	vCard.saveToFile(`./contacts/${fileName}.vcf`);
// 	return fileName;
// };