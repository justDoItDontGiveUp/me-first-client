
import { useState, useEffect } from 'react';
import '../../css/EditAgentForm.css';

export function AddOrEditAgentForm({ agent, onSubmit, onClose, mode = 'edit' }) {
  const [formData, setFormData] = useState({
    user_id: '',
    username: '',
    role: 'agent',
    phone: '',
    email: '',
    address: '',
    language: 'he',
    birthdate: '',
    password: '',
  });

  useEffect(() => {
    if (mode === 'edit' && agent) {
      setFormData({
        user_id: agent.user_id || '',
        username: agent.username || '',
        role: agent.role || 'agent',
        phone: agent.phone || '',
        email: agent.email || '',
        address: agent.address || '',
        language: agent.language || 'he',
        birthdate:agent.birthdate ? new Date(agent.birthdate).toISOString().split('T')[0] : '',

        password: '',
      });
    } else if (mode === 'add') {
      setFormData({
        user_id: '',
        username: '',
        role: 'agent',
        phone: '',
        email: '',
        address: '',
        language: 'he',
        birthdate: '',
        password: '',
      });
    }
  }, [agent, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <label>
            <div>Username:</div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <div>Password:</div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={mode === 'edit' ? 'Change password (optional)' : 'Enter password'}
              required={mode === 'add'}
            />
          </label>

          {mode === 'add' && (
            <label>
              <div>Id:</div>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <label>
            <div>Role:</div>
            <input
              type="text"
              name="role"
              value={formData.role}
              readOnly
            />
          </label>

          <label>
            <div>Phone:</div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            <div>Email:</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <div>Address:</div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <label>
            <div>Language:</div>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">en</option>
              <option value="he">he</option>
            </select>
          </label>

          <label>
            <div>Birthdate:</div>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </label>

          <button type="submit">
            {mode === 'edit' ? 'Update Agent' : 'Add Agent'}
          </button>
        </form>
      </div>
    </div>
  );
}
