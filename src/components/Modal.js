import '../css/Modal.css'

export function Modal({ children, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(183, 172, 172, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div className="modal-content"
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
