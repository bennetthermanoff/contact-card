# Contact Card Sharer
This was developed for Tulane Theta Tau (Nu Epsilon Chapter) Professional Engineering Fraternity Recruitment week.

Import/PDF: Can import xlsx data, then create a pdf for the landyards of every attendee.

<img width="374" alt="image" src="https://github.com/bennetthermanoff/contact-card/assets/19416922/eab53550-1e03-4f36-a3e7-b6af16155888">


frontend - only for contact viewing, shows details from contact file, name, desc, headshot, download contact, etc

<img width="422" alt="image" src="https://github.com/bennetthermanoff/contact-card/assets/19416922/e53cc3f6-b81e-4261-a7af-d48110c9e8c2">


Route determines contact id, /:contactId

backend - no database, just 'contacts' folder containing contact card files, name of the file is the contactId/route.

This allows us to make qr codes to link to contact card, as well as the website has meaningful data. Allowing users to use their mobile phone’s browser history to keep track of who they saw.

# Frontend
## TODO
 - [x] download contact card button
 - [x] view contact card details
    - [x] view contact card headshot
    - [x] view contact card name
    - [x] view contact card description
    - [x] view contact card pronouns
    - [x] view contact card class year
    - [x] display qr code for contact card
 - [ ] STRETCH: create contact card (This was migrated in favor of making a script for importing xlsx data)
# Backend
## TODO
 - [x] find contact card file and download contact card (GET /api/vcard/:contactId)
 - [x] read contact card file and return json details for frontend (GET /api/person/:contactId)
# Scripts
 - [x] mass import from xlsx file
   - to run: npm run import, xlsx file should be in server folder, named 'contacts.xlsx'. photos should be in server/photos folder. photo filenames should be given in a column in the xlsx file. columns will be prompted in CLI. 
