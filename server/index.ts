import express from 'express';
import { getPerson } from './api/person';
import { getVcardFile } from './api/vcard';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get('/api/person/:id', getPerson);
app.get('/api/vcard/:id', getVcardFile);


app.listen(3000, () => console.log('Server started'));