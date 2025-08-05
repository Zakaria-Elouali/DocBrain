import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import {
  Home,
  Folder,
  Calendar,
  Settings,
  Users,
  Share2,
  Star,
  Clock,
  FileArchive, FilesIcon,SignatureIcon
} from 'lucide-react';
import React from "react";
import {SiEgnyte} from "react-icons/si";

export  const navDataCategories = [
  {
    id: "dashboard",
    englishTitle: "Dashboard",
    arabicTitle: "لوحة التحكم",
    sort: 1,
    englishDescription:
        "Overview of your recent activities, file statistics, and quick access to key features.",
    arabicDescription:
        "نظرة عامة على أنشطتك الأخيرة وإحصائيات الملفات والوصول السريع إلى الميزات الرئيسية.",
    isVisible: true,
    icon: <FeatherIcon icon="home" size="60" />,
    navigationLink: "/dashboard",
    titleColor: "#000",
    backgroundColor: "#f0f8ff",
    isExpanded: false,
    menuItems: [],
  },
  {
    id: "filePage",
    englishTitle: "Case Files",
    arabicTitle: "ملفات القضايا",
    sort: 2,
    englishDescription:
        "Organize files by legal cases for easy access and management.",
    arabicDescription: "تنظيم الملفات حسب القضايا القانونية للوصول السهل والإدارة.",
    isVisible: true,
    icon: <FeatherIcon icon="folder" size="60" />,
    navigationLink: "/case-files",
    titleColor: "#000",
    backgroundColor: "#d1e7dd",
    isExpanded: false,
    menuItems: [
      {
        id: "create_case",
        label: "Create Case",
        icon: <FeatherIcon icon="file-plus" />,
        link: "/case-files/create",
      },
      {
        id: "view_cases",
        label: "View Cases",
        icon: <FeatherIcon icon="list" />,
        link: "/case-files",
      },
    ],
  },
  {
    id: "document_management",
    englishTitle: "Document Management",
    arabicTitle: "إدارة الوثائق",
    sort: 3,
    englishDescription:
        "Upload, search, and categorize documents with ease.",
    arabicDescription:
        "تحميل الوثائق والبحث فيها وتصنيفها بسهولة.",
    isVisible: true,
    icon: <FeatherIcon icon="file-text" size="60" />,
    navigationLink: "/documents",
    titleColor: "#000",
    backgroundColor: "#f8d7da",
    isExpanded: false,
    menuItems: [
      {
        id: "upload_documents",
        label: "Upload Documents",
        icon: <FeatherIcon icon="upload" />,
        link: "/documents/upload",
      },
      {
        id: "search_documents",
        label: "Search Documents",
        icon: <FeatherIcon icon="search" />,
        link: "/documents/search",
      },
      {
        id: "categorize_documents",
        label: "Categorize Documents",
        icon: <FeatherIcon icon="tags" />,
        link: "/documents/categorize",
      },
    ],
  },
  {
    id: "collaboration",
    englishTitle: "Collaboration",
    arabicTitle: "التعاون",
    sort: 4,
    englishDescription:
        "Share files and manage collaboration with team members and clients securely.",
    arabicDescription:
        "مشاركة الملفات وإدارة التعاون مع أعضاء الفريق والعملاء بشكل آمن.",
    isVisible: true,
    icon: <FeatherIcon icon="users" size="60" />,
    navigationLink: "/collaboration",
    titleColor: "#000",
    backgroundColor: "#e2e3e5",
    isExpanded: false,
    menuItems: [
      {
        id: "share_files",
        label: "Share Files",
        icon: <FeatherIcon icon="share" />,
        link: "/collaboration/share",
      },
      {
        id: "track_activity",
        label: "Track Activity",
        icon: <FeatherIcon icon="activity" />,
        link: "/collaboration/activity",
      },
    ],
  },
  {
    id: "client_portal",
    englishTitle: "Client Portal",
    arabicTitle: "بوابة العملاء",
    sort: 5,
    englishDescription:
        "Allow clients to securely access shared files and updates.",
    arabicDescription:
        "تمكين العملاء من الوصول الآمن إلى الملفات المشتركة والتحديثات.",
    isVisible: true,
    icon: <FeatherIcon icon="briefcase" size="60" />,
    navigationLink: "/client-portal",
    titleColor: "#000",
    backgroundColor: "#ffe5b4",
    isExpanded: false,
    menuItems: [],
  },
  {
    id: "archive",
    englishTitle: "Archive",
    arabicTitle: "الأرشيف",
    sort: 6,
    englishDescription:
        "Store older or inactive cases and documents in a secure archive.",
    arabicDescription:
        "تخزين القضايا القديمة أو غير النشطة والوثائق في أرشيف آمن.",
    isVisible: true,
    icon: <FeatherIcon icon="archive" size="60" />,
    navigationLink: "/archive",
    titleColor: "#000",
    backgroundColor: "#e0f7fa",
    isExpanded: false,
    menuItems: [
      {
        id: "view_archive",
        label: "View Archive",
        icon: <FeatherIcon icon="box" />,
        link: "/archive",
      },
      {
        id: "restore_archive",
        label: "Restore Archived Items",
        icon: <FeatherIcon icon="rotate-ccw" />,
        link: "/archive/restore",
      },
    ],
  },
];

export const SideBarData = [
  {
    id: "dashboard",
    englishTitle: "Dashboard",
    arabicTitle: "لوحة التحكم",
    icon: <Home size={20} />,
    menuItems: [],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "CLIENT"], // Firm users only FOR NOW I ADD CLIENT FOR TEST
  },
  {
    id: "files",
    englishTitle: "Files",
    arabicTitle: "الملفات",
    icon: <Folder size={20} />,
    menuItems: ["fileExplorer"],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // All users
  },
  {
    id: "calendar",
    englishTitle: "Calendar",
    arabicTitle: "التقويم",
    icon: <Calendar size={20} />,
    menuItems: [],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // All users
  },
  {
    id: "invoice",
    englishTitle: "Invoice",
    arabicTitle: "الفاتورة",
    icon: <Share2 size={20} />,
    menuItems: ["fileExplorer"],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // Firm users only
  },
  {
    id: "cases",
    englishTitle: "Cases",
    arabicTitle: "القضايا",
    icon: <FileArchive size={20} />,
    menuItems: [],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // Firm users only
  },
  {
    id: "client-documents",
    englishTitle: "My Documents",
    arabicTitle: "مستنداتي",
    icon: <FilesIcon size={20} />,
    menuItems: [],
    roles: ["CLIENT"], // Temporarily showing for all users
  },
  {
    id: "signatures",
    englishTitle: "Signatures",
    arabicTitle: "التوقيعات",
    icon: <SignatureIcon size={20} />,
    menuItems: [],
    roles: ["CLIENT"], // Temporarily showing for all users
  },
  // {
  //   id: "recent",
  //   englishTitle: "Recent",
  //   arabicTitle: "الأخيرة",
  //   icon: <Clock size={20} />,
  //   menuItems: ["fileExplorer"],
  //   roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "CLIENT"], // All users
  // },
  // {
  //   id: "starred",
  //   englishTitle: "Starred",
  //   arabicTitle: "المميز بنجمة",
  //   icon: <Star size={20} />,
  //   menuItems: ["fileExplorer"],
  //   roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // All users
  // },
  {
    id: "users",
    englishTitle: "Team",
    arabicTitle: "الفريق",
    icon: <Users size={20} />,
    menuItems: [],
    roles: ["SUPER_ADMIN", "ADMIN"], // Admin users only
  },
  {
    id: "settings",
    englishTitle: "Settings",
    arabicTitle: "الإعدادات",
    icon: <Settings size={20} />,
    menuItems: [],
    roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "CLIENT"], // All users
  }
];


