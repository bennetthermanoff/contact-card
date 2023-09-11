//Hi maddie u should make the contact here 

import { postContact } from './api/contactApi';

export const CreateContact = () => {

    const createContact = async () => {
        //TODO
        // await postContact(newContact);
    };

    return (
        <div className="App">
            <p>View a contact at /contact/:id or print a contact at /pdf/:id</p>
            <button onClick={()=>(window.location.href = 'https://hermanoff.dev')}>
                Go to hermanoff.dev (my website)
            </button>
        </div>
        
    );
};