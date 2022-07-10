import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

function Notification({ num }) {
  const notifications = [
    {
      project: "Ambient H.",
      type: "project",
      title: "New Messages",
      body:
        "Parking_RG_Bialik-5 => Doors => Fire Doors => Interior Fire Door-100",
      sub: "Hydraulic single swap door arm ASSA ABLOY",
    },
    {
      project: "Ambient H.",
      type: "data",
      title: "Updated Data",
      body: "Parking_RG_Bialik-5",
      sub: "Yesterday, 10:00 PM",
    },
    {
      project: "Ambient H.",
      type: "message",
      title: "New Messages",
      body: "2",
      sub: "",
    },
    {
      project: "Atlit",
      type: "invite",
      title: "Project Invitation",
      body: "You are invited by Jumbo Jackson",
      sub: "June 13, 07:00 PM",
    },
  ];
  const [show, setShow] = React.useState(false);

  return (
    <>
      <button className="btn btn-link" onClick={() => setShow(true)}>
        <img alt="ring" src="/images/icon/ring.svg" />
        <Badge variant="light">{num}</Badge>
      </button>

      <Modal
        animation={false}
        aria-labelledby="notifications-modal"
        dialogClassName="mt-0 mr-0"
        onHide={() => setShow(false)}
        show={show}
      >
        <Modal.Header closeButton={true} closeLabel="">
          <Modal.Title id="notifications-modal" className="text-danger">
            Notifications
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.map((el, idx) => (
            <Card key={idx} className="mb-2">
              <Card.Header>{el.project}</Card.Header>
              <Card.Body>
                <Card.Subtitle className="mb-2">
                  <h3>{el.title}</h3>
                </Card.Subtitle>
                <Card.Text className="mb-4">{el.body}</Card.Text>
                <Card.Text className="text-muted">{el.sub}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Notification;
