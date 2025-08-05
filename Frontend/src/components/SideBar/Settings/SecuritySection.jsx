import {Card, CardContent} from "ui/card";
import {Label} from "ui/label";
import {Input} from "ui/input";
import {useState} from "react";
import {Button} from "ui/button";
import {useTranslation} from "react-i18next";

const SecuritySection = ({ onPasswordChange, onToggle2FA }) => {
    const { t } = useTranslation();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword === passwordData.confirmPassword) {
            onPasswordChange(passwordData);
        }
    };

    return (
        <div className="settings-section security-section">
            <h2 className="settings-section__title">{t("Security Settings")}</h2>

            <Card className="settings-card">
                <CardContent className="settings-card__content">
                    <h3 className="security-section__subtitle">{t("Change Password")}</h3>
                    <form onSubmit={handlePasswordSubmit} className="security-form">
                        <div className="security-form__fields">
                            <div className="security-form__field">
                                <Label htmlFor="currentPassword" className="security-form__label">
                                    {t("Current Password")}
                                </Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    className="security-form__input"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        currentPassword: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="security-form__field">
                                <Label htmlFor="newPassword" className="security-form__label">
                                    {t("New Password")}
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    className="security-form__input"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        newPassword: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="security-form__field">
                                <Label htmlFor="confirmPassword" className="security-form__label">
                                    {t("Confirm New Password")}
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className="security-form__input"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        confirmPassword: e.target.value
                                    }))}
                                />
                            </div>
                            <Button type="submit" className="security-form__submit">
                                {t("Update Password")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="settings-card mt-6">
                <CardContent className="settings-card__content">
                    <h3 className="security-section__subtitle">{t("Two-Factor Authentication")}</h3>
                    <div className="security-2fa">
                        <div className="security-2fa__toggle">
                            <Label className="security-2fa__label">
                                {t("Enable Two-Factor Authentication")}
                            </Label>
                            <div className="security-2fa__switch">
                                <input
                                    type="checkbox"
                                    checked={is2FAEnabled}
                                    onChange={(e) => {
                                        setIs2FAEnabled(e.target.checked);
                                        onToggle2FA(e.target.checked);
                                    }}
                                    className="security-2fa__input"
                                />
                                <span className="security-2fa__slider"></span>
                            </div>
                        </div>
                        <p className="security-2fa__description">
                            {t("Enhance your account security by enabling two-factor authentication.")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default SecuritySection;