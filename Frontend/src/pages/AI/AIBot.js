import React, { useState, useRef } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Row,
    Spinner,
} from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


const GovAI = (props) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    document.body.dir = i18n.dir();
    const location = useLocation();
    const showGovAI = location.pathname != "/login";
    const [visible, setVisible] = useState(true);
    const [resizeCount, setResizeCount] = useState(0); // Tracks resize actions
    const iframeRef = useRef(null); // Ref for iframe resizing
    const windowRef = useRef(null);
    const chatbotUrl = process.env.REACT_APP_CHATBOT_URL;

    const handleReload = (evt) => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src; // Reload iframe
        }

        evt.preventDefault();
        evt.stopPropagation();
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <div
                                ref={windowRef}
                                className={`chat-window2 ${isRTL ? "rtl" : "ltr"} ${visible ? "visible" : "hidden"}`}
                            >
                                <iframe
                                    ref={iframeRef}
                                    src={chatbotUrl}
                                    title="Chatbot"
                                    style={{
                                        width: "100%",
                                        minHeight: "500px",
                                        height: "calc(100vh + 200px)",
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(withTranslation()(GovAI));
