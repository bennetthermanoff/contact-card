import axios from 'axios';

export const getContactById = async (id:string) => axios.get(`/api/person/${id}`);


interface ContactPostBase {
    name:string;
    pronouns:string;
    year:string, 
    description:string; 
    majors:string; 
}
interface ContactPostInput extends ContactPostBase{
    photo:File;
}
interface ContactPostBody extends ContactPostBase{
    id:string;
    photoBinary:string;
    photoType:string;
}
export const postContact = async (contact:ContactPostInput) => {
    const body:ContactPostBody = {
        id: contact.name.toLowerCase().replace(/ /g, '-'),
        name: contact.name,
        pronouns: contact.pronouns,
        year: contact.year,
        description: contact.description,
        majors: contact.majors,
        photoBinary: await contact.photo.arrayBuffer().then((buf) => Buffer.from(buf).toString('base64')),
        photoType: contact.photo.type,
    };
    return axios.post('/api/vcard', body);
};
export const getAllContacts = async () => axios.get('/api/people');
