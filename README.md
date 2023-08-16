# Contact Card Sharer
this is very work in progress right now.

frontend - only for contact viewing, shows details from contact file, name, desc, headshot, download contact, etc

Route determines contact id, /:contactId

backend - no database, just 'contacts' folder containing contact card files, name of the file is the contactId/route.

This allows us to make qr codes to link to contact card, as well as the website has meaningful data. Allowing users to use their mobile phone’s browser history to keep track of who they saw

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
 - [ ] STRETCH: create contact card (low priority)
# Backend
## TODO
 - [x] find contact card file and download contact card (GET /api/vcard/:contactId)
 - [x] read contact card file and return json details for frontend (GET /api/person/:contactId)
 - [ ] create contact card file (POST /api/vcard) (low priority)
 - [ ] update contact card file (PUT /api/vcard/:contactId) (extreme low priority)
 - [ ] delete contact card file (DELETE /api/vcard/:contactId) (extreme low priority)

