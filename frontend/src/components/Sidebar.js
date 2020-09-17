import React, { useState, useEffect } from "react";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import FolderTwoToneIcon from "@material-ui/icons/FolderTwoTone";
import SettingsApplicationsTwoToneIcon from "@material-ui/icons/SettingsApplicationsTwoTone";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoardsList,
  selectAllBoards,
} from "../features/boardsList/boardsListSlice";

const drawerWidth = 240;
const navTextColor = "#d1dede";
const selectedNavColor = "#FFB545";
const navHoverColor = "#221E22";
const navBackground = "#2D3438";
const StyledList = styled(List)``;

const Root = styled.div`
  display: flex;
`;

const StyledAppBar = styled(AppBar)`
  && {
    @media (min-width: 600px) {
      width: calc(100% - ${drawerWidth}px);
      margin-left: ${drawerWidth}px;
    }
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    margin-right: 16px;
    @media (min-width: 600px) {
      display: none;
    }
  }
`;

const NestedListItem = styled(ListItem)`
  && {
    padding-left: 32px;
  }
`;

const StyledListItem = styled(ListItem)`
  &.Mui-selected {
    && {
      color: ${selectedNavColor};
    }
  }

  &:hover {
    && {
      background-color: ${navHoverColor};
    }
  }

  && {
    height: 64px;
  }
`;

const NestedStyledListItem = styled(NestedListItem)`
  &.Mui-selected {
    && {
      color: ${selectedNavColor};
    }
  }

  &:hover {
    && {
      background-color: ${navHoverColor};
    }
  }

  && {
    height: 64px;
  }
`;

const NavIcon = styled(ListItemIcon)`
  .MuiSvgIcon-colorPrimary {
    color: ${selectedNavColor};
  }

  .MuiSvgIcon-colorSecondary {
    color: ${navTextColor};
  }
`;

const NavDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth}px;
    background-color: ${navBackground};
    color: ${navTextColor};
  }
`;

const NavBar = styled.nav`
  @media (min-width: 600px) {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const ContentContainer = styled.main`
  flex-row: 1;
  padding: 24px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const ToolbarSpace = styled.div`
  min-height: 56px;

  @media (min-width: 0px) and (orientation: landscape) {
    min-height: 48px;
  }

  @media (min-width: 600px) {
    min-height: 64px;
  }
`;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [boardsOpen, setBoardsOpen] = useState(true);

  const boardsStatus = useSelector((state) => state.boards.status);
  const error = useSelector((state) => state.boards.error);
  const boards = useSelector(selectAllBoards);

  const dispatch = useDispatch();

  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  };

  useEffect(() => {
    if (boardsStatus === "idle") {
      dispatch(fetchBoardsList());
    }

    return () => {
      console.log("sidebar unmounted");
    };
  }, [boardsStatus, dispatch]);

  let renderedContent;
  let boardNavLinks;

  if (boardsStatus === "loading") {
    renderedContent = (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else if (boardsStatus === "succeeded") {
    renderedContent = props.children;
    boardNavLinks = (
      <List component="div" disablePadding>
        {boards.map((board) => (
          <Link
            key={board._id}
            component={RouterLink}
            to={`/board/${board._id}`}
            color="inherit"
            underline="none"
          >
            <NestedStyledListItem button selected={activeRoute(`${board._id}`)}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={board.title} />
            </NestedStyledListItem>
          </Link>
        ))}
      </List>
    );
  } else if (boardsStatus === "failed") {
    renderedContent = <div>{error}</div>;
  }

  const handleBoardsOpen = () => {
    setBoardsOpen(!boardsOpen);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <ToolbarSpace />
      <Divider />
      <StyledList>
        <Link
          component={RouterLink}
          to="/dashboard"
          color="inherit"
          underline="none"
        >
          <StyledListItem button selected={activeRoute("dashboard")}>
            <NavIcon>
              <DashboardTwoToneIcon
                color={activeRoute("dashboard") ? "primary" : "secondary"}
              />
            </NavIcon>
            <ListItemText primary="Dashboard" />
          </StyledListItem>
        </Link>
        <StyledListItem
          button
          onClick={handleBoardsOpen}
          selected={activeRoute("board/")}
        >
          <NavIcon>
            <FolderTwoToneIcon
              color={activeRoute("board/") ? "primary" : "secondary"}
            />
          </NavIcon>
          <ListItemText primary="Projects" />
          {boardsOpen ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem>
        <Collapse in={boardsOpen} timeout="auto" unmountOnExit>
          {boardNavLinks}
        </Collapse>
        <ListItem button>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </StyledList>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar>
          <StyledIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          ></StyledIconButton>
          <Typography variant="h6" noWrap>
            Drawer
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <NavBar aria-label="menu buttons">
        <Hidden smUp implementation="css">
          <NavDrawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </NavDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <NavDrawer variant="permanent" open>
            {drawer}
          </NavDrawer>
        </Hidden>
      </NavBar>
      <ContentContainer>
        <ToolbarSpace />
        {renderedContent}
      </ContentContainer>
    </Root>
  );
}

export default Sidebar;
