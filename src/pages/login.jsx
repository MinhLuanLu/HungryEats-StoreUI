import React, { useState , useContext} from 'react';
import { UserContext } from '../context/user_Context';
import Store from '../components/store';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [store_name, setStore_name] = useState()
  const [store_description, setStore_description] = useState()
  const [display_store, setDisplay_store] = useState(false)

  const {  public_Email, setPublic_Email} = useContext(UserContext);
  const {public_Store_name,setPublic_Store_name} = useContext(UserContext)
  const {public_user_id, setPublic_User_id} = useContext(UserContext)

  async function handleSubmit (event) {
    event.preventDefault();

    let data = {
        "Email": email,
        "Password": password
    }

    await fetch('http://localhost:3000/login/api',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res=>{
        if(res.ok){
            return res.json().then(data=>{
                if(data){
                    alert(data.message)
                    setStore_name(data.Seller_info[0]['Store_name'])
                  
                    sessionStorage.setItem('User_id', data.Seller_info[0]['User_id'])
                    sessionStorage.setItem('Store_name',data.Seller_info[0]['Store_name'])
                    sessionStorage.setItem('Email', email)

                    setStore_description(data.Seller_info[0]['Store_description'])
                    if(data.User_info[0]['Role'] == "Seller"){
                      setDisplay_store(true)
                    }
                }
            })
        }
        if(data === 400){
            return res.json()
        }
    })
    .catch(error=>{
        console.error(error)
    })
    
  };


  if(display_store) return <Store store_name={store_name} store_description={store_description}/>



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
        <button type="submit" style={styles.button}>Login</button>
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
