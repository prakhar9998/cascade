import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import styled from "styled-components";

const drawerWidth = 240;
const navTextColor = "#d1dede";
const selectedNavColor = "#ED9B40";
const navHoverColor = "#221E22";
const navBackground = "#292C2F";
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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [boardsOpen, setBoardsOpen] = React.useState(true);

  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  };

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
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={handleBoardsOpen}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Boards" />
          {boardsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={boardsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NestedListItem button>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Board 1" />
            </NestedListItem>
          </List>
        </Collapse>
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
          >
            <MenuIcon />
          </StyledIconButton>
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
        {props.children}
      </ContentContainer>
    </Root>
  );
}

export default Sidebar;
