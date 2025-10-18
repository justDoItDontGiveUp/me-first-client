export function Summary({ summary, currentUserId }) {
  const isMe = summary.from_user_id === currentUserId;

  return (
    <div className={`summary-bubble ${isMe ? "me" : "other"}`}>
      {!isMe && <div className="summary-name">{summary.user_name}</div>}
      <div className="summary-text">{summary.summary_text}</div>
      <div className="summary-time">
        {new Date(summary.summary_time).toLocaleString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
      </div>
    </div>
  );
}