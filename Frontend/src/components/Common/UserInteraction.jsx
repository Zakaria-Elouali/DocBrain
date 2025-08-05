import React, { useEffect, useState } from "react";
import ThumbUpLineIcon from "remixicon-react/ThumbUpLineIcon";
import ThumbUpFillIcon from "remixicon-react/ThumbUpFillIcon";
import Chat3LineIcon from "remixicon-react/Chat3LineIcon";
import Chat3FillIcon from "remixicon-react/Chat3FillIcon";
import { withTranslation } from "react-i18next";
import withRouter from "./withRouter";
import { getUserLikesByEntityNameApiRequest } from "../../store/actions";
import {
  INTERACTION_COUNT_LIKES_BY_ENTITY_RECORD,
  INTERACTION_LIKE,
  INTERACTION_DISLIKE,
} from "../../helpers/url_helper";
import { APIClient } from "../../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalComment from "./ModalComment";

/**
 * UserInteraction Component
 *
 * Props:
 *  - entityName: The name of the module listed in the interaction_parameters table in the database. If needed, add the module (table name) in ("../../common/enums", ENTITY_NAME) and in interaction_parameters table.
 *  - recordId: The ID of the record in the given module (table).
 *  - showText: (Optional) Default value is false. Determines whether to show the text of like and comment buttons.
 *
 * Example usage:
 *
 * <UserInteraction entityName={ENTITY_NAME.JOURNEY} recordId={row.id}, showText={true}/>
 *
 * Before using the UserInteraction Component, call the following methods to populate comments and likes of the module:
 *
 *    dispatch(getCommentsApiRequest({ recordEntityName: ENTITY_NAME.JOURNEY }));
 *    dispatch(getUserLikesByEntityNameApiRequest({ user: user.username, recordEntityName: ENTITY_NAME.JOURNEY }));
 */

const UserInteraction = (props) => {
  const {
    entityName,
    recordId,
    label = "",
    showText = false,
    showComment = true,
  } = props;
  const [likeFlag, setLikeFlag] = useState(false);
  const [commentFlag, setCommentFlag] = useState(false);
  const [likesCount, setLikesCount] = useState("0");
  let api = new APIClient();
  const [likeData, setLikeData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, comments, userLikesByEntityName, interactionParameters } =
    useSelector((state) => state?.userInteraction);
  const params = interactionParameters.filter(
    (i) => i.entityName == entityName
  )[0];
  const [showLikeFlag, setShowLikeFlag] = useState(
    params ? params.enableLike : false
  );
  const [showcommentFlag, setShowCommentFlag] = useState(
    params ? params.enableComment : false
  );

  const user = JSON.parse(sessionStorage.getItem("authUser"));
  const data = {
    recordEntityName: entityName,
    recordId: recordId,
    authorityId: user.authorities[0].id,
    createdBy: user.username,
  };

  async function localLikeRequest() {
    let res;
    let newLikeData = new FormData();
    newLikeData.append("recordEntityName", data.recordEntityName);
    newLikeData.append("recordId", data.recordId);
    newLikeData.append("authorityId", data.authorityId);
    newLikeData.append("createdBy", data.createdBy);
    try {
      res = await api.create(INTERACTION_LIKE, newLikeData);
      if (res.id) {
        setLikeData(res);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch(
        getUserLikesByEntityNameApiRequest({
          user: user.username,
          recordEntityName: entityName,
        })
      );
      console.log(error);
      return false;
    }
  }

  function localDislikeRequest() {
    if (!likeData.id) {
      return;
    }
    const id = likeData.id;
    try {
      const res = api.delete(`${INTERACTION_DISLIKE}/${id}`);
      if (res) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch(
        getUserLikesByEntityNameApiRequest({
          user: user.username,
          recordEntityName: entityName,
        })
      );
      console.log(error);
      return false;
    }
  }

  const toggleLike = () => {
    if (likeFlag) {
      if (localDislikeRequest()) {
        setLikeFlag(false);
      }
    } else {
      if (localLikeRequest()) {
        setLikeFlag(true);
      }
    }

    setTimeout(() => {
      refreshLikes();
    }, 2000);
  };

  const openComment = () => {
    setModal(!modal);
  };

  useEffect(() => {
    var lk = [];
    lk = userLikesByEntityName.filter((l) => l.recordId == recordId);
    if (lk.length > 0) {
      setLikeData(lk[0]);
      setLikeFlag(true);
    } else {
      setLikeFlag(false);
    }
  }, [userLikesByEntityName]);

  useEffect(() => {
    const cmt = comments.filter((elm) => elm.recordId == recordId);
    cmt.length > 0 ? setCommentFlag(true) : setCommentFlag(false);
  }, [comments]);

  async function likesCountRequest(data) {
    let lc;
    try {
      lc = await api.get(
        `${INTERACTION_COUNT_LIKES_BY_ENTITY_RECORD}?recordId=${data.recordId}&recordEntityName=${data.recordEntityName}`
      );
    } catch (error) {
      lc = 0;
      console.log({ error });
    }

    const _count = typeof lc === "number" ? lc : lc.data;

    setLikesCount(formatNumber(_count));
  }

  function refreshLikes() {
    if (recordId && entityName) {
      const data = { recordId: recordId, recordEntityName: entityName };
      // dispatch(countLikesByEnttyRecordApiRequest(data));
      likesCountRequest(data);
    }
  }
  useEffect(() => {
    if (loading) {
      return;
    }
    refreshLikes();
  }, [dispatch]);

  function formatNumber(num) {
    if (isNaN(num)) return num; // check if input is a number

    // define thresholds and suffixes
    const thresholds = [1e3, 1e6, 1e9, 1e12];
    const suffixes = ["K", "M", "B", "T"];

    // loop through thresholds
    let value = Math.abs(num);
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i]) {
        return (value / thresholds[i]).toFixed(1) + suffixes[i];
      }
    }

    // return the original number if less than 1000
    return num;
  }

  /**
   * Modale section -----------------------------------------------------------------
   */

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  /**
   * End Modale Section -------------------------------------------------------------
   */

  return (
    <React.Fragment>
      <div className="container mx-0">
        <div className="row">
          <div className="col-auto">
            <div
              className="w-auto d-flex flex-row bd-highlight "
              style={{ height: "25px" }}
            >
              <div className="mt-0">
                {showLikeFlag && (
                  <button className="btn py-0 " onClick={() => toggleLike()}>
                    {likeFlag ? (
                      <ThumbUpFillIcon className="text-primary me-1" />
                    ) : (
                      <ThumbUpLineIcon className="text-primary me-1" />
                    )}
                    {likesCount}
                    {showText && props.t(" Like")}
                  </button>
                )}
              </div>
              <div>
                {showComment && showcommentFlag && (
                  <button className="btn p-0" onClick={() => openComment()}>
                    {commentFlag ? (
                      <Chat3FillIcon className="text-primary" />
                    ) : (
                      <Chat3LineIcon className="text-primary" />
                    )}
                    {showText && props.t(" Comment")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalComment
          modal={modal}
          toggle={toggle}
          recordId={recordId}
          entityName={entityName}
          label={label}
          {...props}
        />
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(UserInteraction));
