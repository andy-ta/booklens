import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <NavLink
                    exact
                    to="/"
                    component={IconButton}
                    edge="start"
                    color="inherit"
                    activeStyle={{ visibility: 'hidden' }}
                >
                    <ArrowBackIcon />
                </NavLink>
                <Typography variant="h6">BookLens</Typography>
            </Toolbar>
        </AppBar>
    );
}
