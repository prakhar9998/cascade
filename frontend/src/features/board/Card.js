import React from "react";

import { Draggable } from "react-beautiful-dnd";

import Grid from "@material-ui/core/Grid";
import CalendarTodaySharpIcon from "@material-ui/icons/CalendarTodaySharp";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

import styled from "styled-components";

import moment from "moment";

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
const Label = styled.div`
  display: inline-block;
  border-radius: 4px;
  background-color: #edf8f2;
  color: #18a657;
  padding: 2px 5px;
  margin: 3px;
  font-size: 14px;
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
  min-height: 100px;
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

export const Card = (props) => {
  const classes = useStyles();

  return (
    <CardContainer>
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
                    <Label key={index}>{label}</Label>
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
                    {props.cardData.assigned.map((user) => (
                      <Avatar>{user[0] + user.split(" ")[1][0]}</Avatar>
                    ))}
                  </AvatarGroup>
                </Grid>
              </Grid>
            </Container>
          </div>
        )}
      </Draggable>
    </CardContainer>
  );
};
