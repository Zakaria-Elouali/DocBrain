// CardComponent.jsx
import React from 'react';
import { Card, CardBody, Button, Row, Col, Container } from 'reactstrap';
// import FeatherIcon from 'feather-icons-react';
import {navDataCategories} from '@/Layouts/NavDataCategories';
import { useTranslation, withTranslation } from 'react-i18next';
// import { useEffect } from 'react';
import withRouter from 'components/Common/withRouter';
// import { adjustSidebar } from '../Layouts/Sidebar';

const HomePage = (props) => {
  const { i18n } = useTranslation();
  const filteredApplicationCategories = navDataCategories
        .filter(item => item.isVisible) 
        .sort((a, b) => a.sort - b.sort);

  return (
    <React.Fragment>
      <div className="page-content" style={{marginTop: '50px'}}>
        <Container fluid>
          <Row>
            {filteredApplicationCategories.map((card, index) => (
              <React.Fragment key={index}>
                {(index + 1) % 2 === 1 && ( // Start a new row
                  <Col md="2"></Col>
                )}
                <Col md="4">
                  {index < filteredApplicationCategories.length && ( // Ensure not to exceed the array length
                    <Card className="mb-4" style={{ backgroundColor: card.backgroundColor }}>
                      <CardBody>
                        <Row>
                          <Col xs="3" className="d-flex justify-content-center align-items-center">
                            {card.icon}
                          </Col>
                          <Col xs="9">
                            <h5 style={{ color: card.titleColor }}>{i18n.language === 'ar' ? card.arabicTitle : card.englishTitle}</h5>
                            <p style={{ color: card.titleColor }}>{i18n.language === 'ar' ? card.arabicDescription : card.englishDescription}</p>
                            <Button href={card.menuItems && card.menuItems.length > 0 ? card.menuItems[0].link : card.navigationLink} color="primary">{props.t("Navigate")} ...</Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  )}
                </Col>
                {(index + 1) % 2 === 0 && ( // End the row
                  <Col md="2"></Col>
                )}
              </React.Fragment>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default withRouter(withTranslation()(HomePage));
