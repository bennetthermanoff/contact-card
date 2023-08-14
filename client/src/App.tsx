import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';

function App() {
  const [contact, setContact] = React.useState<VcardJson>({});
  const [contactId, setContactId] = React.useState<string>('bennett');

  React.useEffect(() => {
    getContact();
  },[contactId]);

  const getContact = async () => {
    try {
    const response = await axios.get(`/api/person/${contactId}`);
    setContact(response.data);
    }
    catch (error) {
      console.log(error);
    }
  };
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{`Name: ${getEntry(contact, "FN")}`}</h2>
        <ContactImage contact={contact} />
        <input type="text" value={contactId} onChange={(e) => setContactId(e.target.value)} />
      </header>
    </div>
  );
}

export default App;
