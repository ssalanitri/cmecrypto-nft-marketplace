/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/footerStyle.js";

export default function Footer(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="creator-dashboard" className={classes.block}>
                Create Dashboard
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="unsold-items" className={classes.block}>
                Marketplace
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="my-collectios" className={classes.block}>
                My Collections
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="create-item" className={classes.block}>
                Create Item
              </a>
            </ListItem>
          </List>
        </div>
        {/* <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://www.creative-tim.com?ref=njsmd-footer"
              target="_blank"
              className={classes.a}
            >
              Creative Tim
            </a>
            , made with love for a better web
          </span>
        </p> */}
      </div>
    </footer>
  );
}
