import { useEffect, useState } from 'react';
import { CopyDocToFolder } from '../documents/CopyDocToFolder';
import { useParams } from 'react-router-dom';

export function GoogleDocViewer({ projectId, docType, stageId, token, user_id }) {
    const [docUrl, setDocUrl] = useState(null);      // קישור תצוגה בלבד
    const [newDocUrl, setNewDocUrl] = useState(null); // קישור לעריכה
    const [isEditing, setIsEditing] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const { username } = useParams();

    useEffect(() => {
        fetchDocUrl();
    }, [projectId, docType, username]);

    const fetchDocUrl = async () => {
        try {
            const res = await fetch(`http://localhost:3333/${username}/documents/getFilePath/${projectId}/${docType}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Doc not found');
            const data = await res.json();
            const cleanedUrl = data.file_path.replace(/\/(edit|view).*$/, '/view');
            setDocUrl(cleanedUrl);
        } catch (err) {
            console.error('Error loading doc:', err);
        }
    };

    const handleEdit = async () => {
        if (isCopying) return;
        setIsCopying(true);
        try {
            console.log('username:', username);
            console.log('Copy params:', {
                projectId, docType, stageId, userId: user_id, username
            });

            const newDoc = await CopyDocToFolder({ projectId, docType, stageId, token, userId: user_id, username });
            if (!newDoc || !newDoc.fileId) {
                throw new Error('Failed to copy document');
            }
            const newUrl = `https://docs.google.com/document/d/${newDoc.fileId}/edit`;
            window.open(newUrl, '_blank', 'noopener,noreferrer');
            setIsEditing(true);
        } catch (err) {
            console.error('Error copying doc:', err);
        } finally {
            setIsCopying(false); // שחרור כפתור תמיד (גם בשגיאה)
        }
    };

    if (isEditing && newDocUrl) {

        return (
            <div style={{ marginTop: '2rem' }}>
                <p style={{ color: '#2c4e91' }}>
                    Edit the document in a new window
                </p>
                <a
                    href={newDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '10px 16px',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        marginTop: '1rem',
                    }}
                >
                    Open the document again
                </a>
            </div>
        );
    }

    return (
        <div
            style={{
                width: 200,
                border: '1px solid #ccc',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                userSelect: 'none',
                margin: 'auto',
            }}
            onClick={handleEdit}
            title="Click to edit the document"
        >
            {/* סמל מסמך */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#4285f4"
                viewBox="0 0 24 24"
                width="64px"
                height="64px"
                style={{ marginBottom: 12 }}
            >
                <path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM13 3.5V9h5.5L13 3.5z" />
            </svg>

            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{docType}</div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                }}
                disabled={isCopying}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isCopying ? '#9aa4b2' : '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: isCopying ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    opacity: isCopying ? 0.6 : 1,
                    transition: 'background-color 0.3s ease',
                }}
            >
                {isCopying ? 'opening' : 'Edit Document'}
            </button>
        </div>
    );
}
