function LoginWarningModal({ isOpen, onClose }) {
    if (!isOpen) return null
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Sign In Required</h2>
                <p>You need to sign in to use this feature</p>
                <button onClick={onClose}>Got it!</button>
            </div>
        </div>
    )
}

export default LoginWarningModal