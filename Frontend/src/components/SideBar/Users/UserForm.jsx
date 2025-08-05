import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmployeeRequest,
    updateEmployeeRequest,
    addClientRequest,
    updateClientRequest,
} from "@/store/users/action";
import { useAuth } from "@/helpers/auth_helper";
import { fetchRolesRequest } from "@/store/roles/action";
import { useFormik } from "formik";
import * as Yup from "yup";

const UserForm = ({ isOpen, onClose, user, mode, userType }) => {
    const dispatch = useDispatch();
    const { isSuperAdmin } = useAuth();
    const allRoles = useSelector((state) => state.rolesReducer.roles);

    useEffect(() => {
        dispatch(fetchRolesRequest());
    }, [dispatch]);

    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required("Full name is required")
            .min(2, "Full name must be at least 2 characters"),
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters"),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email address"),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
        ...(userType === "employee"
            ? {
                roleIds: Yup.string().required("Role is required"),
            }
            : {}),
    });

    const initialValues = userType === "employee"
        ? {
            fullName: user?.fullName || "",
            username: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
            roleIds: user?.roleIds ? String(Array.from(user.roleIds)[0]) : "3",
        }
        : {
            fullName: user?.fullName || "",
            username: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
        };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { roleIds, ...userData } = values;

            if (userType === "employee") {
                const roleIdsArray = [Number(roleIds)];
                if (mode === "edit") {
                    dispatch(updateEmployeeRequest({
                        id: user.id,
                        userData,
                        roleIds: roleIdsArray
                    }));
                } else {
                    dispatch(addEmployeeRequest({
                        userData,
                        roleIds: roleIdsArray
                    }));
                }
            } else {
                if (mode === "edit") {
                    dispatch(updateClientRequest({ id: user.id, ...userData }));
                } else {
                    dispatch(addClientRequest(userData));
                }
            }
            onClose();
        },
    });

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>
                    {mode === "edit"
                        ? `Edit ${userType === "employee" ? "Employee" : "Client"}`
                        : `Add New ${userType === "employee" ? "Employee" : "Client"}`}
                </h2>

                <form onSubmit={formik.handleSubmit} className="modal-form">
                    <div className="modal-fields">
                        <div className="modal-field">
                            <label>Full Name</label>
                            <input
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter full name"
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                                <div className="error">{formik.errors.fullName}</div>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Username</label>
                            <input
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Choose a username"
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="error">{formik.errors.username}</div>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Email</label>
                            <input
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="email"
                                placeholder="Enter email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="error">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Phone Number</label>
                            <input
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter phone number"
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="error">{formik.errors.phone}</div>
                            )}
                        </div>

                        {userType === "employee" && (
                            <div className="modal-field">
                                <label>Role</label>
                                <select
                                    name="roleIds"
                                    value={formik.values.roleIds}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" disabled>Select role</option>
                                    {allRoles
                                        .filter((role) => role.name !== "CLIENT")
                                        .map((role) => (
                                            <option key={role.id} value={String(role.id)}>
                                                {role.name.replace(/_/g, " ")}
                                            </option>
                                        ))}
                                </select>
                                {formik.touched.roleIds && formik.errors.roleIds && (
                                    <div className="error">{formik.errors.roleIds}</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-button-group">
                        <button
                            type="button"
                            className="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="primary"
                        >
                            {mode === "edit" ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;