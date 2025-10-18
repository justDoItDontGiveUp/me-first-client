import { useState } from "react";
import { Modal } from "../Modal";

export function UploadFile({ projectId, docType, token }) {

    const [show, setShow] = useState(true);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const uploadDocument = async () => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:3333/${projectId}/upload/${docType}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log('הקובץ הועלה בהצלחה:', data);
            alert(`הקובץ הועלה בגרסה v${data.version}`);
        } else {
            console.error('שגיאה בהעלאה:', data.error);
            alert('אירעה שגיאה בהעלאת הקובץ');
        }
    }

    return (
        show && (
            <Modal onClose={() => setShow(false)}>
                <div style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <p>Choose a .Word file to upload</p>

                    <input
                        type="file"
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                    />

                    {file && <p>Chosen file: {file.name}</p>}

                    <button onClick={() => uploadDocument()}>
                        Submit
                    </button>
                </div>
            </Modal>
        )
    );

}


