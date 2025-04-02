import React, { useState} from 'react';
import { API_LOCATION, ADMIN } from '../../config';
import Loading from '../components/loading';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState(sessionStorage.getItem("Email"));
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false)
  const [user, setUser] = useState({})

  async function handleSubmit (event) {
    event.preventDefault();

    let data = {
        "Email": email,
        "Password": password
    }

    await fetch(`${API_LOCATION}/login/api`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res=>{
        if(res.ok){
            return res.json().then(data=>{
                if(data.success){
                    const [storeInfo] = data?.data
                    if(storeInfo?.Role == ADMIN.business){
                      setUser(storeInfo)
                      setAdmin(true)
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

  if(admin){
    setTimeout(() => {
      handleNavigate()
      setAdmin(!admin)
    }, 3000);
  }

  function handleNavigate(){
    navigate("/Home", {state: user})
  }  

 

  
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
      { admin &&
        <div style={{backgroundColor:'#f7f7f7', width:'500px', height:"500px", display:'flex', position:'fixed', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Loading/>
        </div>
      }
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
