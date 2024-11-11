import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faQuestionCircle, faComments, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Header component
const Header = ({
    title = 'CraftNess',          // Default title
    showLeftButton = true,        // Controls the display of the left button
    isHelpButton = false,         // Toggle between back and help button on the left
    onBackClick,                  // Function to call on back button click
    onHelpClick,                  // Function to call on help button click
    rightButtonType = 'dm',       // Type of right button ('dm', 'publish', or none)
    onDMClick,                    // Function to call on DM button click
    onPublishClick,               // Function to call on Publish button click
    titleFont = 'Mansalva',       // Default font set to Mansalva
    titleSize = '1.3rem',
    headerHeight = '40px',        // option to customize height (for profile.jsx)
    paddingBottom = '20px',           // option to customize padding (for profile.jsx)
  }) => {

  // Handle left button click (back or help)
    const handleLeftButtonClick = () => {
        if (isHelpButton && onHelpClick) {
            onHelpClick()          // Call help button function
        } else if (onBackClick) {
            onBackClick()          // Call back button function
        } else {
            window.history.back()  // Browser's back navigation
        }
    }

    const navigate = useNavigate()

    const handleSettingsButtonClick = () => {
        navigate('/settings')
    }

    // Determine which icon and function to use for the right button
    const renderRightButton = () => {
        if (rightButtonType === 'dm') {
            return (
                <button onClick={onDMClick} style={styles.button}>
                    <FontAwesomeIcon icon={faComments} aria-label="Direct messages" />
                </button>
            )
        } else if (rightButtonType === 'publish') {
            return (
                <button onClick={onPublishClick} style={styles.icon}>
                    Publish
                </button>
            )
        } else if (rightButtonType === 'settings') {
            return (
                <button onClick={handleSettingsButtonClick} style={styles.icon}>
                    <FontAwesomeIcon icon={faCog} aria-label="Settings" />
                </button>
            )
        }
        return null
    }

    return (
        <header style={{ ...styles.header, height: headerHeight, paddingBottom: paddingBottom}}>
            {showLeftButton && (
                <button onClick={handleLeftButtonClick} style={styles.button}>
                <FontAwesomeIcon icon={isHelpButton ? faQuestionCircle : faArrowLeft} />
              </button>
            )}

            <h1 style={{ ...styles.title, fontFamily: titleFont, fontSize: titleSize}}>{title}</h1>

            {renderRightButton()}
        </header>
    )
  }
// Styles for the header and buttons
const styles = {
    header: {
        width: '390px',
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateColumns: '100px 1fr 100px',
        alignItems: 'center',
        padding: '20px 0px',
        background: 'linear-gradient(90deg, #FFB997, #FF5A5F)',
        color: 'white',
        zIndex: 1000,

    },
    title: {
        margin: 0,
        fontFamily: 'Mansalva, sans-serif',
        textAlign: 'center',
        flex: 1,
    },
    button: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: 'white',
    },
    icon: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'white',
    },
}

export default Header