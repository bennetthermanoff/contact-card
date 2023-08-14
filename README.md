# Contact Card Sharer
this is very work in progress right now.

frontend - only for contact viewing, shows details from contact file, name, desc, headshot, download contact, etc

Route determines contact id, /:contactId

backend - no database, just 'contacts' folder containing contact card files, name of the file is the contactId/route.

This allows us to make qr codes to link to contact card, as well as the website has meaningful data. Allowing users to use their mobile phone’s browser history to keep track of who they saw

# Frontend
## TODO
 - [] download contact card button
 - [] view contact card details
    - [] view contact card headshot
    - [] view contact card name
    - [] view contact card description
    - [] view contact card social media links (low priority)
    - [] display qr code for contact card (low priority but easy)
 - [] STRETCH: create contact card (low priority)
# Backend
## TODO
 - [x] find contact card file and download contact card (GET /api/vcard/:contactId)
 - [] read contact card file and return json details for frontend (GET /api/person/:contactId)
 - [] create contact card file (POST /api/vcard) (low priority)
 - [] update contact card file (PUT /api/vcard/:contactId) (low priority)
 - [] delete contact card file (DELETE /api/vcard/:contactId) (low priority)

