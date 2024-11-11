import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function OptionsMenu({ isAuthor, onViewProfile, onEditPost, onDeletePost, onSharePost }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="options-menu-icon">
            <FontAwesomeIcon icon={faEllipsisV} onClick={handleMenuToggle} />
            {menuOpen && (
                <div className="options-menu">
                    <ul>
                        <li onClick={onViewProfile}>View profile</li>
                        {isAuthor && <li onClick={onEditPost}>Edit post</li>}
                        {isAuthor && <li onClick={onDeletePost}>Delete post</li>}
                        <li onClick={onSharePost}>Share project</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default OptionsMenu;