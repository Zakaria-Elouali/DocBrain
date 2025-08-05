import React, { useEffect, useState } from "react";
import {
  Input,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  CardLink,
  CardFooter,
} from "reactstrap";
import { useSelector } from "react-redux";
import {
  deleteCommentsApiRequest,
  getCommentsApiRequest,
  saveCommentApiRequest,
} from "../../store/actions";
import { useDispatch } from "react-redux";
import { ENTITY_NAME } from "../../common/enums";
import { useLocation } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";
import withRouter from "./withRouter";
import { useNavigate } from "react-router-dom";
import { isSuperAdmin, isRootAdmin } from "../../helpers/auth_helper";

const ModalComment = (props) => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const entityName = queryParams.get("entityName");
  // const recordId = queryParams.get("recordId");

  const { loading, comments, commentsByRecordId } = useSelector(
    (state) => state?.userInteraction
  );

  const { modal, toggle, recordId, entityName, label } = props;
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("authUser"));
  const { users } = useSelector((state) => state?.Users);

  let data = [];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    } ${hours}:${formattedMinutes}`;
  }

  function getData() {
    if (!comments) {
      return;
    }
    data = comments
      ?.filter((cmt) => cmt.recordId == recordId)
      .map((elm) => ({
        id: elm.id,
        name: users
          .filter((u) => u.mail == elm.createdBy)
          .map((elm) => elm.firstname + " " + elm.lastname)[0],
        comment: elm.comment,
        date: formatDate(elm.lastModifiedAt),
      }));
  }

  getData();

  function saveComment() {
    const data = {
      recordEntityName: entityName,
      recordId: recordId,
      authorityId: user.authorities[0].id,
      comment: comment,
    };
    dispatch(saveCommentApiRequest(data));
    refresh();
    setComment("");
  }

  function refresh() {
    setTimeout(() => {
      dispatch(getCommentsApiRequest({ recordEntityName: entityName }));
    }, 1000);
  }

  useEffect(() => {
    refresh();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      getData();
    }
  }, [loading]);

  function deleteComment(id) {
    dispatch(deleteCommentsApiRequest(id));
    refresh();
  }

  return (
    <div>
      <Modal
        centered
        isOpen={modal}
        toggle={toggle}
        className="modal-dialog-scrollable"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={toggle}>{props.t(label)}</ModalHeader>
        <Row>
          <Col lg={12}>
            <Input
              id="invitationArabic"
              name="invitationArabic"
              type="textarea"
              className="form-control border border-success"
              placeholder={props.t("Add a Comment...")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {comment != "" && (
              <button
                className={`btn btn-sm btn-success float-end m-2`}
                onClick={saveComment}
              >
                {props.t("Send")}
              </button>
            )}
          </Col>
        </Row>
        <ModalBody>
          <div>
            {data.map((elm, index) => (
              <Card key={`_card_${index}`} className="shadow mb-2">
                <CardBody>
                  <CardTitle>
                    <div class="d-flex flex-row mb-3">
                      <div className="h5">{elm.name}</div>
                      <small className="ps-1 text-body-secondary">
                        {" "}
                        {elm.date}
                      </small>
                    </div>
                  </CardTitle>
                  <CardText>{elm.comment}</CardText>
                  {(isRootAdmin() || isSuperAdmin()) && (
                    <CardLink>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteComment(elm.id)}
                      >
                        {props.t("Delete")}
                      </button>
                    </CardLink>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalComment;
