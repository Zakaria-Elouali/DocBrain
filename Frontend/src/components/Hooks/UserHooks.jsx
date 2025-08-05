import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const [loading, setLoading] = useState(!userProfileSession);
  const [userProfile, setUserProfile] = useState(userProfileSession);

  useEffect(() => {
    setUserProfile(userProfileSession);
    setLoading(!userProfileSession);
  }, []);

  const token = userProfile?.token;

  return { userProfile, loading, token };
};

export { useProfile };
