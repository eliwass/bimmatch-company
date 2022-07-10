import React from "react";
import { useState, useRef } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useMutation, gql } from "@apollo/client";

const Team = ({
  displayName,
  email,
  user,
  role,
  photoUrl = "/images/icon/user.png",
  contextUser,
  contextUserRole,
  handleRemove,
}) => {
  return (
    <li>
      <div className="own-image">
        <img
          src={photoUrl || "/images/icon/user.png"}
          className="img-fluid"
          alt="profile"
          style={photoUrl ? {} : { transform: "scale(2)" }}
        />
      </div>
      <div className="team-name">
        {user === contextUser ? "me" : displayName || email}
      </div>
      {user !== contextUser && contextUserRole === "owner" && (
        <OverlayTrigger
          trigger={"click"}
          placement="bottom-end"
          overlay={
            <Popover className="filter-product-form team-popover">
              <Popover.Content>
                <div className="popover-content">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemove && handleRemove(user)}
                  >
                    Remove member
                  </p>
                </div>
              </Popover.Content>
            </Popover>
          }
        >
          <img
            src="/images/icon/threedots.svg"
            className="img-fluid menu-img"
            alt="team-menu"
          />
        </OverlayTrigger>
      )}
    </li>
  );
};

const REMOVE_MEMBER = gql`
  mutation removeTeamMember($houseId: ID!, $user: String!) {
    removeTeamMember(houseId: $houseId, user: $user)
  }
`;

const InviteTeam = ({
  shareId,
  team: initialTeam = [],
  contextUser,
  houseId,
}) => {
  const ref = useRef();
  let [team, setTeam] = useState(
    [...initialTeam].sort((t) => {
      if (t.role === "owner") {
        return 1;
      }
      return 0;
    })
  );
  const [copyBtn, setCopyBtn] = useState("COPY");
  const [removeMember] = useMutation(REMOVE_MEMBER);

  const handleCopy = () => {
    const ele = ref && ref.current;
    ele.focus();
    ele.select();
    document.execCommand("copy");
    setCopyBtn("Copied!");
    setTimeout(() => {
      setCopyBtn("COPY");
    }, 3000);
  };
  const removeHandler = async (user) => {
    try {
      const response = await removeMember({
        variables: {
          houseId,
          user,
        },
      });
      if (response && response.data && response.data.removeTeamMember) {
        const newTeam = initialTeam.filter((val) => val.user !== user);
        setTeam(newTeam);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const host = window.location.protocol + "//" + window.location.host;
  team.sort((t) => {
    if (t.role === "owner") {
      return 1;
    }
    return 0;
  });

  let contextUserRole = team.find((t) => t.user === contextUser);
  contextUserRole = contextUserRole && contextUserRole.role;

  return (
    <div className="invite-team-wrapper">
      <p>Invite new team members</p>
      <p>
        Copy the project’s private link and share it to invite a new team
        memeber.
      </p>
      <div className="copy-wrapper">
        <input
          ref={ref}
          type="text"
          className="form-control"
          value={`${host}/invite/${shareId}`}
          readOnly
        />
        <button className="btn btn-outline-primary" onClick={handleCopy}>
          {copyBtn}
        </button>
      </div>
      <div className="team-list-wrapper">
        <h6>Team members</h6>
        <ul className="team-list">
          {team &&
            team.map((user) => (
              <Team
                {...user}
                key={user.user}
                contextUser={contextUser}
                contextUserRole={contextUserRole}
                handleRemove={removeHandler}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default InviteTeam;
