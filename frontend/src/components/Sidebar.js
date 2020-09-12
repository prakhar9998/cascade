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
import StarBorder from "@material-ui/icons/StarBorder";

import styled from "styled-components";

const drawerWidth = 240;

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
  margin-right: 16px;
  @media (min-width: 600px) {
    display: none;
  }
`;

const NavBar = styled.nav`
  @media (min-width: 600px) {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const NavDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth}px;
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

const NestedListItem = styled(ListItem)`
  && {
    padding-left: 32px;
  }
`;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [boardsOpen, setBoardsOpen] = React.useState(true);

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
        {["Dashboard", "Settings"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
            Responsive drawer
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
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </ContentContainer>
    </Root>
  );
}

export default Sidebar;
