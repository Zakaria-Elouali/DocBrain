import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ProfileSection from "components/SideBar/Settings/ProfileSection";
import {SettingsSidebar} from "components/SideBar/Settings/SettingsSidebar";
import {useAuth} from "@/helpers/auth_helper";
import SecuritySection from "components/SideBar/Settings/SecuritySection";
import {fetchProfileRequest, updateProfileRequest} from "@/store/users/action";


const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const { isAdmin, isSuperAdmin } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProfileRequest());
    }, [dispatch]);

    const { userProfile } = useSelector((state) => state.UserReducer);

    console.log("userProfile: "+ JSON.stringify(userProfile));

    return (
        <>
            <div className="settings-container">
                <SettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <div id="settings-wrapper" data-id="settings">
                    <div className="settings-main">
                        {activeSection === 'profile' && (
                            <ProfileSection
                                user={userProfile}
                                onUpdate={(data) => dispatch(updateProfileRequest(data))}
                            />
                        )}

                        {activeSection === 'security' && (
                            <SecuritySection
                                isAdmin={isAdmin}
                                isSuperAdmin={isSuperAdmin}
                                onPasswordChange={(data) => dispatch({ type: 'UPDATE_PASSWORD_REQUEST', payload: data })}
                                onToggle2FA={(enabled) => dispatch({ type: 'TOGGLE_2FA_REQUEST', payload: { enabled } })}
                            />
                        )}

                    {/*    {activeSection === 'notifications' && (*/}
                    {/*        <NotificationSection*/}
                    {/*            onUpdate={(settings) => dispatch({ type: 'UPDATE_NOTIFICATION_SETTINGS', payload: settings })}*/}
                    {/*        />*/}
                    {/*    )}*/}

                    {/*    {activeSection === 'preferences' && (*/}
                    {/*        <PreferencesSection*/}
                    {/*            onUpdate={(prefs) => dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: prefs })}*/}
                    {/*        />*/}
                    {/*    )}*/}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Settings;