import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import {fileToBase64} from "components/Common/fileToBase64";
import {useTranslation} from "react-i18next";

const ProfileSection = ({ user, onUpdate }) => {
    const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);

    const {t} = useTranslation();
    const formik = useFormik({
        initialValues: {
            profilePicture: user?.profilePicture || null,
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            jobTitle: user?.jobTitle || '',
            dateOfBirth: user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().matches(/^[0-9+-]+$/, 'Invalid phone number'),
            jobTitle: Yup.string(),
            dateOfBirth: Yup.date().max(new Date(), 'Date cannot be in the future'),
        }),
        onSubmit: async (values) => {

            try {
                const dataToSend = { ...values };

                // If profilePicture is a File object, convert it to base64
                if (values.profilePicture instanceof File) {
                    const base64Image = await fileToBase64(values.profilePicture);
                    dataToSend.profilePicture = base64Image;
                }

            onUpdate(dataToSend);

            } catch (error) {
                console.error('Error updating profile:', error);
            }
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue('profilePicture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="settings-section profile-section">
            <h2 className="settings-section__title">{t("Personal Information")}</h2>
            <Card className="settings-card">
                <CardContent className="settings-card__content">
                    <div className="profile-image">
                        <div className="profile-image__container">
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Profile"
                                    className="profile-image__img"
                                />
                            )}
                        </div>
                        <div className="profile-image__actions">
                            <Button
                                variant="outline"
                                className="profile-image__button"
                                onClick={() => document.getElementById('profilePicture').click()}
                            >
                                {t("Change Picture")}
                            </Button>
                            <input
                                id="profilePicture"
                                name="profilePicture"
                                type="file"
                                className="profile-image__input"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="profile-form">
                        <div className="profile-form__fields">
                            <div className="profile-form__row">
                                <div className="profile-form__field">
                                    <Label htmlFor="fullName" className="profile-form__label">{t("Full Name")}</Label>
                                    <Input
                                        id="fullName"
                                        {...formik.getFieldProps('fullName')}
                                        className={`profile-form__input ${
                                            formik.errors.fullName && formik.touched.fullName ? 'error' : ''
                                        }`}
                                    />
                                    {formik.touched.fullName && formik.errors.fullName && (
                                        <div className="profile-form__error">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.fullName}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-form__field">
                                    <Label htmlFor="email" className="profile-form__label">{t("Email")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...formik.getFieldProps('email')}
                                        className={`profile-form__input ${
                                            formik.errors.email && formik.touched.email ? 'error' : ''
                                        }`}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="profile-form__error">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="profile-form__row">
                                <div className="profile-form__field">
                                    <Label htmlFor="phone" className="profile-form__label">{t("Phone")}</Label>
                                    <Input
                                        id="phone"
                                        {...formik.getFieldProps('phone')}
                                        className={`profile-form__input ${
                                            formik.errors.phone && formik.touched.phone ? 'error' : ''
                                        }`}
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <div className="profile-form__error">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.phone}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-form__field">
                                    <Label htmlFor="jobTitle" className="profile-form__label">{t("Job Title")}</Label>
                                    <Input
                                        id="jobTitle"
                                        {...formik.getFieldProps('jobTitle')}
                                        className="profile-form__input"
                                    />
                                </div>
                            </div>

                            <div className="profile-form__row">
                                <div className="profile-form__field">
                                    <Label htmlFor="dateOfBirth" className="profile-form__label">{t("Date of Birth")}</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        {...formik.getFieldProps('dateOfBirth')}
                                        className={`profile-form__input ${
                                            formik.errors.dateOfBirth && formik.touched.dateOfBirth ? 'error' : ''
                                        }`}
                                    />
                                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                        <div className="profile-form__error">
                                            <AlertCircle className="w-4 h-4" />
                                            {formik.errors.dateOfBirth}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!formik.isValid || formik.isSubmitting}
                                className="profile-form__submit"
                            >
                                {t("Save Changes")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileSection;