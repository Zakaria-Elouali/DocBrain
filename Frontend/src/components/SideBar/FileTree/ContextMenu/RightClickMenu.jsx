// Enhanced RightClickMenu component
import {useRightClick} from "./useRightClick";
import { Upload, Download, Edit, Trash2, FolderPlus } from 'lucide-react';

const RightClickMenu = () => {
    const { menuState, closeMenu } = useRightClick();
    const { position, target } = menuState || {};

    if (!position || !target) return null;

    const menuOptions = [
        {
            label: 'Create Folder',
            icon: <FolderPlus size={16} style={{ marginRight: '8px' }} />,
            action: () => {
                target.onCreateFolder();
                closeMenu();
            },
        },
        {
            label: 'Upload',
            icon: <Upload size={16} style={{ marginRight: '8px' }} />,
            action: () => {
                target.onUpload();
                closeMenu();
            },
        },
        {
            label: 'Download',
            icon: <Download size={16} style={{ marginRight: '8px' }} />,
            action: () => {
                target.onDownload();
                closeMenu();
            },
        },
        {
            label: 'Rename',
            icon: <Edit size={16} style={{ marginRight: '8px' }} />,
            action: () => {
                target.onRename();
                closeMenu();
            },
        },
        {
            label: 'Delete',
            icon: <Trash2 size={16} style={{ marginRight: '8px' }} />,
            action: () => {
                target.onDelete();
                closeMenu();
            },
        },
    ];

    return (
        <ul
            className="right-click-menu"
            style={{
                top: position.y,
                left: position.x,
                position: 'fixed',
                zIndex: 1000,
            }}
        >
            {menuOptions.map((option, index) => (
                <li
                    key={index}
                    className="menu-item"
                    onClick={option.action}
                >
                    {option.icon}
                    {option.label}
                </li>
            ))}
        </ul>
    );
};

export default RightClickMenu;