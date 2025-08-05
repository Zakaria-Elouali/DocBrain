import { Shield, Eye } from 'lucide-react';

export const USER_TYPES = {
    EMPLOYEE: 'employees',
    CLIENT: 'clients',
};

export const ROLE_CONFIGS = {
    superadmin: { icon: Shield, color: 'text-red-500' },
    admin: { icon: Shield, color: 'text-blue-500' },
    viewer: { icon: Eye, color: 'text-gray-500' },
};