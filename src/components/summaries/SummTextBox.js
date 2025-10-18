import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import '../../css/Summaries.css'

//עובד גם עם DB וגם עם דרייב
// export function SummTextBox({ projectId, username }) {
//     const [inputText, setInputText] = useState('');
//     const [documentId, setDocumentId] = useState();
//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         fetchSummeryFilePath();
//     }, [username, projectId])

//     const fetchSummeryFilePath = async () => {
//         try {
//             const res = await fetch(`http://localhost:3333/${username}/documents/getFilePath/${projectId}/Summaries`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: 'Bearer ' + token,
//                     'Content-Type': 'application/json',
//                 }
//             });
//             const data = await res.json();
//             if (data.file_path) {
//                 const docId = extractDocId(data.file_path);
//                 setDocumentId(docId);
//             } else {
//                 console.error('ERROR response:', data);
//             }
//         } catch (error) {
//             console.error('Network error:', error.message);
//         }
//     };

//     const extractDocId = url => {
//         const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
//         return match ? match[1] : null;
//     };

//     const handleAddSumm = async () => {
//         if (!inputText.trim() || !documentId) return;
//         try {
//             const res = await fetch(`http://localhost:3333/${username}/summaries/${projectId}/addSummaryRow`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: 'Bearer ' + token,
//                 },
//                 body: JSON.stringify({
//                     docId: documentId,
//                     summery_text: inputText
//                 })
//             });

//             const data = await res.json();
//             if (data.success) {
//                 setInputText('');
//             } else {
//                 console.error('ERROR:', data.error || data.message);
//             }
//         } catch (error) {
//             console.error('Network error:', error.message);
//         }
//     };

//     return (
//         <div className="text-box-container">
//             <input
//                 className="text-box"
//                 type="text"
//                 value={inputText}
//                 onChange={e => setInputText(e.target.value)}
//                 placeholder="הוסף סיכום..."
//             />
//             <SendHorizontal size={36} onClick={handleAddSumm} className="send-icon" />
//         </div>
//     );
// }

//עובד רק עם DB
export function SummTextBox({ projectId, username, onSummaryAdded }) {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleAddSumm = async () => {
        if (!inputText.trim()) return;

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:3333/${username}/summaries/${projectId}/addSummaryRow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({ summery_text: inputText })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setInputText('');
                if (onSummaryAdded) onSummaryAdded(); 
            } else {
                console.error('Error:', data.error || data.message);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleAddSumm();
    };

    return (
        <div className="text-box-container">
            <input
                className="text-box"
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="הוסף סיכום..."
                disabled={loading}
            />
            <SendHorizontal
                size={30}
                onClick={handleAddSumm}
                className={`send-icon ${loading ? 'disabled' : ''}`}
            />
        </div>
    );
}