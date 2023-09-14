import Axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [password, setPassword] = useState('');
  const [service, setService] = useState('');
  const [passwordData, setPasswordData] = useState([]);

  const addPassword = async() => {
    console.log('adding password');
    await Axios.post('http://localhost:3001/api/users/addpassword',{
      password: password,
      service: service
    }).then((response) => {
      console.log(response.data);
    });
  }

  const decryptPassword = async(encryption) => {
    Axios.post('http://localhost:3001/api/users/decrypt', {
      password: encryption.password,
      iv: encryption.iv
    })
    .then((response) => {
      setPasswordData(passwordData.map((val) => {
        return val.id === encryption.id ? {id: val.id, password: val.password, service: response.data, iv: val.iv} : val
      }));
    });
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/api/users/getpasswords')
    .then((response) => {
      console.log(response.data);
      setPasswordData(response.data);
    })
  }, []);

  return(
    <div className="App">
      <div className="password-add-form">
        <input type="text" placeholder='Facebook' onChange={(e) => {setService(e.target.value)}} />
        <input type="text" placeholder='password123' onChange={(e) => {setPassword(e.target.value)}} />
        <button onClick={addPassword}>Add Password</button>
      </div>
      <div className='password-list'>
        {passwordData.map((val, key) => {
          return(
            <div className='password' key={key} onClick={() => {decryptPassword({password: val.passwords, iv: val.iv, id: val.id})}}>
              <h1>{val.service}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;