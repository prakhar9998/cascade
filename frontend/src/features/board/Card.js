import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Draggable } from "react-beautiful-dnd";

import Grid from "@material-ui/core/Grid";
import CalendarTodaySharpIcon from "@material-ui/icons/CalendarTodaySharp";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

import styled from "styled-components";

import moment from "moment";
import { CardDetail } from "./CardDetail";
import { getMemberById } from "./boardSlice";
import { getInitials } from "../../utils/memberName";

const Container = styled.div`
  background-color: #ffffff;
  width: 250px;
  border-radius: 5px;
  min-height: 100px;
  padding: 5px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
`;
const Heading = styled.h3`
  font-size: 20px;
  margin: 10px 0 0 10px;
`;

// same styles using in card detail modal
export const Label = styled.div`
  display: inline-block;
  border-radius: 4px;
  background-color: ${(props) => (props.color ? props.color : "#eeeeee")};
  color: #2d3438;
  padding: 2px 5px;
  margin: 3px;
  font-size: 14px;
  align-self: center;
`;

const DateTime = styled.div`
  text-align: center;
  font-size: 14px;
  align-self: center;
`;

const DateTimeContainer = styled(Grid)`
  && {
    display: flex;
    align-content: center;
    justify-content: center;
  }
`;

const Time = styled.span`
  margin-left: 5px;
`;

const CardContainer = styled.div`
  margin: 16px auto;

  width: 100%;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },

  group: {
    float: "right",
    paddingRight: "10px",
    paddingBottom: "10px",
    "& > *": {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
      fontSize: "12px",
    },
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const MembersAvatar = (props) => {
  const member = useSelector((state) => getMemberById(state, props.id));

  return <Avatar>{getInitials(member)}</Avatar>;
};

export const Card = (props) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);

  // for add board form modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <CardContainer onClick={handleModalOpen}>
        <Draggable draggableId={props.cardData._id} index={props.index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Container key={props.cardData._id}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Heading>{props.cardData.title}</Heading>
                  </Grid>
                  <Grid item xs={12}>
                    {props.cardData.labels.map((label, index) => (
                      <Label key={index} color={label.color}>
                        {label.name}
                      </Label>
                    ))}
                  </Grid>
                  <DateTimeContainer item xs={6}>
                    <DateTime>
                      <CalendarTodaySharpIcon fontSize={"inherit"} />
                      <Time>
                        {moment
                          .utc(props.cardData.createdAt)
                          .format("DD MMM, YYYY")}
                      </Time>
                    </DateTime>
                  </DateTimeContainer>
                  <Grid item xs={6}>
                    <AvatarGroup max={4} className={classes.group} spacing={8}>
                      {props.cardData.assigned.map((userId) => (
                        <MembersAvatar key={userId} id={userId} />
                      ))}
                    </AvatarGroup>
                  </Grid>
                </Grid>
              </Container>
            </div>
          )}
        </Draggable>
      </CardContainer>
      <>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <CardDetail data={props.cardData} />
        </Modal>
      </>
    </div>
  );
};
