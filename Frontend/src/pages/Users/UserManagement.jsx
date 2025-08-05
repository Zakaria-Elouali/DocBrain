import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, UserPlus } from 'lucide-react';
import {
    fetchEmployeesRequest,
    fetchClientsRequest,
    deleteEmployeeRequest,
    deleteClientRequest,
} from '@/store/users/action';
import { useAuth } from "@/helpers/auth_helper";
import { UserCard } from "components/SideBar/Users/UserCard";
import UserForm from "components/SideBar/Users/UserForm";
import {useTranslation} from "react-i18next";

export const UserManagement = () => {
    const dispatch = useDispatch();
    const { isAdmin, isSuperAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('EMPLOYEE');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const { t } = useTranslation();

    const { employees, clients, loading, error } = useSelector((state) => state.UserReducer);

    useEffect(() => {
        if (isAdmin || isSuperAdmin) {
            if (activeTab === 'EMPLOYEE') {
                dispatch(fetchEmployeesRequest());
            } else {
                dispatch(fetchClientsRequest());
            }
        }
    }, [activeTab, dispatch, isAdmin, isSuperAdmin]);

    const handleAddUser = useCallback(() => {
        setModalMode('create');
        setSelectedUser(null);
        setModalOpen(true);
    }, []);

    const handleEditUser = useCallback((user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setModalOpen(true);
    }, []);

    const handleDeleteUser = useCallback((id) => {
        const action = activeTab === 'EMPLOYEE'
            ? deleteEmployeeRequest
            : deleteClientRequest;
        dispatch(action(id));
    }, [activeTab, dispatch]);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setSelectedUser(null);
    }, []);

    return (
        <div className="users-management-container">
            <div className="users-management-wrapper">
                <div className="users-management-content">
                    <Tabs
                        defaultValue="EMPLOYEE"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="users-management-tabs"
                    >
                        <div className="users-management-header">
                            <TabsList className="users-management-tab-list">
                                <TabsTrigger
                                    value="EMPLOYEE"
                                    className="users-management-tab-trigger"
                                >
                                    <Users className="users-management-tab-icon"/>
                                    {t("Employees")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="CLIENT"
                                    className="users-management-tab-trigger"
                                >
                                    <Briefcase className="users-management-tab-icon"/>
                                    {t("Clients")}
                                </TabsTrigger>
                            </TabsList>
                            {(isAdmin || isSuperAdmin) && (
                                <Button
                                    onClick={handleAddUser}
                                    className="users-management-add-button"
                                >
                                    <UserPlus className="users-management-add-icon"/>
                                    {t("Add")} {activeTab === 'EMPLOYEE' ? t('Employee') : t('Client')}
                                </Button>
                            )}
                        </div>

                        <TabsContent value="EMPLOYEE" className="users-management-tab-content">
                            {employees.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isEmployee={true}
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                />
                            ))}
                            {employees.length === 0 && (
                                <div className="users-management-empty-state">
                                    {t("No employees found.")}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="CLIENT" className="users-management-tab-content">
                            {Array.isArray(clients) && clients.length > 0 ? (
                            clients.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isEmployee={false}
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                />
                            ))
                            ) : (
                                <div className="users-management-empty-state">
                                    {t("No clients found.")}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <UserForm
                        isOpen={modalOpen}
                        onClose={handleModalClose}
                        user={selectedUser}
                        mode={modalMode}
                        userType={activeTab.toLowerCase()}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;