import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");  // New state for first name
  const [lastname, setLastname] = useState("");    // New state for last name

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Firstname:", firstname);
    console.log("Lastname:", lastname);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // Inline styles object
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '50px',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '300px',
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1rem',
    },
    button: {
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter your first name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter your last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
