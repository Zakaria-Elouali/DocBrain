import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { ROLE_CONFIGS } from '@/components/constants/userManagementType';

export const UserCard = ({ user, isEmployee, onEdit, onDelete }) => {
    const RoleIcon = isEmployee ? ROLE_CONFIGS[user.role]?.icon : null;

    return (
        <Card className="mb-4 overflow-hidden border-0 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800 dark:text-white">
            <div className="h-1 bg-indigo-500 dark:bg-indigo-600"></div>
            <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                    {/* Left section with icon and name */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-gray-700 flex-shrink-0">
                            {isEmployee ?
                                <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> :
                                <Briefcase className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            }
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-base truncate">{user.fullName}</h3>
                            {user.jobTitle && (
                                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 truncate">{user.jobTitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Middle section with contact info */}
                    <div className="hidden md:flex items-center space-x-4 flex-grow mx-4 max-w-sm">
                        <div className="flex items-center space-x-1 min-w-0">
                            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center space-x-1 min-w-0">
                                <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.phone}</span>
                            </div>
                        )}
                    </div>

                    {/* Role badge (visible on larger screens) */}
                    {isEmployee && RoleIcon && (
                        <div className="hidden md:block">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                                <RoleIcon className={`w-3 h-3 ${ROLE_CONFIGS[user.roles]?.color}`} />
                                <span className="ml-1 capitalize">{user.roles}</span>
                            </span>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-1 ml-auto flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(user)}
                            className="w-8 h-8 rounded-full transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(user.id)}
                            className="w-8 h-8 rounded-full transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile-only row for contact & role info */}
                <div className="flex flex-wrap items-center mt-1.5 gap-2 md:hidden">
                    <div className="flex items-center space-x-1 min-w-0">
                        <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="flex items-center space-x-1 min-w-0">
                            <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.phone}</span>
                        </div>
                    )}
                    {isEmployee && RoleIcon && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                            <RoleIcon className={`w-3 h-3 ${ROLE_CONFIGS[user.roles]?.color}`} />
                            <span className="ml-1 capitalize">{user.roles}</span>
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};