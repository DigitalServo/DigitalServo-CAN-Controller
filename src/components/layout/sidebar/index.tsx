"use client";

import * as React from "react";

import Link from "next/link"
import { usePathname } from "next/navigation"

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider, { DividerProps } from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { ListSubheader, Typography, Collapse, styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

import { SIDEBAR_WIDTH, SIDEBAR_COLOR } from "@/components/layout/globalSetting";

import {contentsOperation } from "./contents";
import { MACHINE, VENDOR } from "@/setting";


export type PrimaryItem = {
  name: string,
  link: string,
  icon: OverridableComponent<SvgIconTypeMap<{ children?: React.ReactNode }, "svg">>,
  expand: boolean,
  navigate: boolean,
  minors: SecondaryItem[],
};

export type SecondaryItem = {
  name: string,
  link: string,
  navigate: boolean,
  icon: OverridableComponent<SvgIconTypeMap<{ children?: React.ReactNode }, "svg">>,
};

const textColor = "#eef";
const selectedButtonBgColor = "#44f";

function ListedContents({ item ,currentPath}: {item: PrimaryItem, currentPath: string}): React.ReactElement {

  const itemSelected: boolean = item.link == currentPath;
  const buttonBbgcolor = itemSelected? selectedButtonBgColor : "transparent";
  const [expand, setExpand] = React.useState<boolean>(true);
  const handlePrimaryItemClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    if (item.expand) setExpand(!expand);
    if(!item.navigate) event.preventDefault();
  };
  return (
    <div>
      {/* Primary items */}
      <ListItem disablePadding>

        <Link href={item.link} style={{width: "100%"}}>
          <ListItemButton
            onClick={handlePrimaryItemClick}
            sx={{
              borderRadius: 2,
              ml: 1.5,
              mr: 1.5,
              pl: 1.5,
              pr: 0,
              bgcolor: buttonBbgcolor,
              "&:hover": {
                backgroundColor: buttonBbgcolor
              }
            }}
          >
            <ListItemIcon sx={{minWidth: 0, ml: 0, mr: 1.5, color: textColor}}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.name} slotProps={{primary: {fontWeight: "bold", color: textColor}}}/>
            <ListItemIcon sx={{minWidth: 0, color: textColor}}>
              <ExpandMoreIcon sx={{
                opacity: item.expand? 1 : 0,
                color: textColor,
                transform: expand? "rotate(-180deg)" : "rotate(0)",
                transition: "0.2s",
              }}/>
            </ListItemIcon>
          </ListItemButton>
        </Link>

      </ListItem>

      {/* Secondary items */}
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense sx={{ml: 4.5, borderLeft: `solid 1px ${textColor}`}}>
            {item.minors.map(subitem => {
              const subitemSelected: boolean = subitem.link == currentPath;
              const subButtonBbgcolor = subitemSelected? selectedButtonBgColor : "transparent";
              const handleSecondaryItemClick = (event: React.MouseEvent<HTMLInputElement>): void => {
                if(!subitem.navigate) event.preventDefault();
              };
              return (
                <div key={subitem.name}>
                  <ListItem disablePadding>
                    <Link href={subitem.link} style={{width: "100%"}}>
                      <ListItemButton
                        onClick={handleSecondaryItemClick}
                          sx={{
                            borderRadius: 2,
                            ml: 1,
                            mr: 1.5,
                            pl: 1,
                            bgcolor: subButtonBbgcolor,
                            "&:hover": {
                              backgroundColor: subButtonBbgcolor
                            }
                          }}
                        >
                        <ListItemIcon sx={{minWidth: 0, mr: 1, color: textColor}}>
                        <subitem.icon />
                        </ListItemIcon>
                        <ListItemText primary={subitem.name} primaryTypographyProps={{fontWeight: "bold", color: textColor}}/>
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </div>
              )
            })}
        </List>
      </Collapse>
    </div>
  )
};


function ContentSubheader({ title }: {title: string}): React.ReactElement {
  return (
    <ListSubheader
      sx={{
        bgcolor: "transparent",
        color: textColor,
        lineHeight: 2.5,
        fontWeight: "bold",
        userSelect: "none",
      }}
    >
      {title}
    </ListSubheader>
  )
};

function ContentsList (props: {
  contents: PrimaryItem[],
  classification: string,
  currentPath: string,
}): React.ReactElement {
  return (
    <div>
      <List
        sx={{mt: 0.5}}
        dense
        component = "nav"
        subheader = { <ContentSubheader title={props.classification} /> }
      >
        {props.contents.map(item => (
          <ListedContents key={item.name} item={item} currentPath={props.currentPath} />
        ))}
      </List>
    </div>
  )
};

const ContentsDivider: React.FC<DividerProps> = styled(Divider)({
  marginRight: 8,
  marginLeft: 8,
  backgroundColor: "#bbc"
});

export default function Sidebar () {

  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", userSelect: "none" }}>
      <CssBaseline />

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", backgroundColor: SIDEBAR_COLOR, width: SIDEBAR_WIDTH + 1 },
          }}
          open
        >
          <Link href="/">
            <div style={{width: SIDEBAR_WIDTH, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Typography color={textColor} variant="h6" fontWeight="bold" sx={{mt: 3, mb: 2.5, userSelect: "none"}}>
                {VENDOR}<br/>{MACHINE}
              </Typography>
            </div>
          </Link>
          <ContentsDivider />

          <ContentsList contents={contentsOperation} classification="Operation" currentPath={pathname} />
          <ContentsDivider />


        </Drawer>
    </Box>
  );
}
