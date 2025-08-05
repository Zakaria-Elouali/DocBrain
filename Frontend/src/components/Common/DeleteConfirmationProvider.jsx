import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

// Create a context to manage the delete confirmation state
export const DeleteConfirmationContext = React.createContext(null);

export const DeleteConfirmationProvider = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [pendingId, setPendingId] = React.useState(null);
    const [pendingCallback, setPendingCallback] = React.useState(null);

    const confirmDelete = React.useCallback((id, onConfirm) => {
        setPendingId(id);
        setPendingCallback(() => onConfirm);
        setIsOpen(true);
    }, []);

    const handleConfirm = React.useCallback(() => {
        if (pendingCallback) {
            pendingCallback(pendingId);
        }
        setIsOpen(false);
        setPendingId(null);
        setPendingCallback(null);
    }, [pendingCallback, pendingId]);

    const handleCancel = React.useCallback(() => {
        setIsOpen(false);
        setPendingId(null);
        setPendingCallback(null);
    }, []);

    return (
        <DeleteConfirmationContext.Provider value={{ confirmDelete }}>
            {children}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DeleteConfirmationContext.Provider>
    );
};
