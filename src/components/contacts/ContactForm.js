import { useState, useEffect } from 'react';

export function ContactForm({ contact = null, onSave, onClose, type = 'customer' }) {
  const isEditMode = !!contact;

  const [formData, setFormData] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    company_name: '',
    country: '',
    address: '',
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        contact_name: contact.contact_name || '',
        contact_phone: contact.contact_phone || '',
        contact_email: contact.contact_email || '',
        company_name: contact.company_name || '',
        country: contact.country || '',
        address: contact.address || '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">×</button>
        <h3>{isEditMode ? `Edit ${type === 'supplier' ? 'Supplier' : 'Customer'}` : `Add ${type === 'supplier' ? 'Supplier' : 'Customer'}`}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="contact_name"
            placeholder="Full Name"
            value={formData.contact_name}
            onChange={handleChange}
            required
          />
          <input
            name="contact_phone"
            placeholder="Phone Number"
            value={formData.contact_phone}
            onChange={handleChange}
          />
          <input
            name="contact_email"
            placeholder="Email Address"
            value={formData.contact_email}
            onChange={handleChange}
          />
          <input
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <button type="submit">{isEditMode ? 'Update' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
