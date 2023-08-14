import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { VcardJson } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';

function App() {
  const [contact, setContact] = React.useState<VcardJson>({});

  React.useEffect(() => {
    getContact();
  },[]);
  const getContact = async () => {
    const response = await axios.get('/api/person/bennett');
    setContact(response.data);
  };
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ContactImage contact={contact} />
      </header>
    </div>
  );
}

export default App;
