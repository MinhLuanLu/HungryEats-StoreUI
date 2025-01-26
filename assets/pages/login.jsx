import React, { useState } from 'react';
import Launch_Page from './launch_page';

const Login = () => {
  // State for handling inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [display_launch_page, set_Display_Launch_Page] = useState(false)
  const [store_name, setStore_name] = useState();
  const [store_description, setStore_Description] = useState()

  async function handleSubmit(e) {
    e.preventDefault();
    let data = {
      "Email": email,
      "Password": password
    }

    await fetch('http://localhost:3000/login/api',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>{
      if(res.ok){
        return res.json().then(data=>{
          if(data){
            console.log(data)
            let user_role = data.User_info[0]['Role']
            if(user_role === 'Seller'){
              alert(data.message)
              set_Display_Launch_Page(true)
              setStore_name(data.User_info[0]['Store_name'])
              setStore_Description(data.User_info[0]['Store_description'])
            }
          }
        })
      }
      if(res === 400){
        return res.json()
      }
    })
    .catch(error=>{
      console.error(error)
    })
  }



  if(display_launch_page) return <Launch_Page store_name={store_name} store_description={store_description}/>

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" onClick={handleSubmit} style={styles.button}>Login</button>
      </form>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Login;
