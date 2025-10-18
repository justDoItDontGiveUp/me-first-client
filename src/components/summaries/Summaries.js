import { useEffect, useState } from "react";
import { Summary } from "./Summary";
import "../../css/Summaries.css";

// export function Summaries({ projectId }) {
//   const [summaries, setSummaries] = useState([]);
//   const [summaryText, setSummaryText] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {

//     fetchSummaries();
//   }, [projectId]);

//   const fetchSummaries = async () => {
//     try {
//       const res = await fetch(`http://localhost:3333/summaries/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch summaries");
//       const data = await res.json();

//       // מיון לפי זמן (חדש -> ישן)
//       data.sort((a, b) => new Date(a.summary_time) - new Date(b.summary_time));
//       setSummaries(data);
//     } catch (error) {
//       console.error("Error fetching summaries:", error);
//     }
//   };

//   const sendSummary = async () => {
//     if (!summaryText.trim()) return;

//     try {
//       const res = await fetch(`http://localhost:3333/summaries`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           project_id: projectId,
//           summary_text: summaryText,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to send summary");

//       const newSummary = await res.json();
//       setSummaries((prev) => [...prev, newSummary]);
//       setSummaryText("");
//     } catch (error) {
//       console.error("Error sending summary:", error);
//     }
//   };

//   return (
//     <div className="summary-wrapper">
//       <h3 className="summaryTitle">Project Chat Summary</h3>

//       <div className="summary-messages">
//         {summaries.length > 0 ? (
//           summaries.map((s) => (
//             <Summary key={s.summary_id} summary={s} />
//           ))
//         ) : (
//           <p>No summaries yet.</p>
//         )}
//       </div>

//       <form
//         className="summary-input"
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendSummary();
//         }}
//       >
//         <input
//           type="text"
//           placeholder="כתוב סיכום שיחה..."
//           value={summaryText}
//           onChange={(e) => setSummaryText(e.target.value)}
//         />
//         <button type="submit">שלח</button>
//       </form>
//     </div>
//   );
// }

export function Summaries({ projectId, username }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!projectId) return;
    fetchSummaries();
  }, [projectId,]);

  const fetchSummaries = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3333/${username}/summaries/${projectId}/summaries`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch summaries");
      }

      const data = await res.json();
      setSummaries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>טוען סיכומים...</div>;
  if (error) return <div>שגיאה בטעינת הסיכומים: {error}</div>;

  if (summaries.length === 0)
    return <div>אין סיכומים להצגה עבור פרויקט זה.</div>;

  return (
    <div>
      <h3>סיכומי הפרויקט</h3>
      <ul>
        {summaries.map(({ summary_id, summary_time, summary_text, from_user_id }) => (
          <li key={summary_id} style={{ marginBottom: "1rem" }}>
            <div>
              <strong>תאריך:</strong>{" "}
              {new Date(summary_time).toLocaleString("he-IL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>
              <strong>סיכום:</strong> {summary_text}
            </div>
            <div>
              <small>מזהה משתמש: {from_user_id}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
