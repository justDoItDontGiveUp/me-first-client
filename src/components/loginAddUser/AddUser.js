import { useState } from 'react';
import { NavigationBar } from '../homePage/NavigationBar'

const AddUser = () => {
    const [agent, setAgent] = useState({
        username: '',
        role: 'agent',
        email: '',
        phone: '',
        address: '',
        language: 'en',
        birthdate: ''
    });
    const [error, setError] = useState('');

    const onAddAgent = (newAgent) => {
        try {
            const response=fetch('http://localhost:3333/addUser', {
                method: 'POST',
                body: JSON.stringify(newAgent)
            });
        }
        catch (error) {
            console.error('שגיאה בהוספת סוכן:', error);
        }
        console.log('סוכן חדש נוסף:', newAgent);
    }

    const handleChange = (e) => {
        setAgent({ ...agent, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // בדיקת שדות חובה
        if (!agent.username || !agent.email || !agent.phone || !agent.address) {
            setError('יש למלא את כל השדות החובה');
            return;
        }
        setError('');
        if (onAddAgent) {
            onAddAgent(agent);
        }
        setAgent({
            username: '',
            role: 'agent',
            email: '',
            phone: '',
            address: '',
            language: 'en',
            birthdate: ''
        });
    };

    return (        
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <NavigationBar/>
            <h2>הוספת סוכן חדש</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>שם משתמש:</label>
                    <input
                        type="text"
                        name="username"
                        value={agent.username}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label>אימייל:</label>
                    <input
                        type="email"
                        name="email"
                        value={agent.email}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label>טלפון:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={agent.phone}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label>כתובת:</label>
                    <input
                        type="text"
                        name="address"
                        value={agent.address}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label>שפה:</label>
                    <select name="language" value={agent.language} onChange={handleChange}>
                        <option value="he">עברית</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div>
                    <label>תאריך לידה:</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={agent.birthdate}
                        onChange={handleChange}
                    />
                </div>
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                <button type="submit" style={{ marginTop: 16 }}>הוסף סוכן</button>
            </form>
        </div>
    );
};

export default AddUser;