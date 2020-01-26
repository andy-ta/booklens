import { Container, Fab } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/Camera';
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    NavLink,
    Route,
    Switch
} from 'react-router-dom';
import CameraView from './components/CameraView';
import Header from './components/Header';
import Page from './components/Page';
import Pages from './components/Pages';

function App() {
    const [page, setPage] = useState(null);
    const [image, setImage] = useState(null);

    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/">
                    <Container
                        maxWidth="md"
                        style={{ marginTop: 24, textAlign: 'center' }}
                    >
                        <Pages />
                    </Container>
                </Route>

                <Route path="/page/:pageId">
                    <Page
                        page={page}
                        imageUri={image}
                        setPage={setPage}
                        setImage={setImage}
                    />
                </Route>
                <Route path="/scan">
                    <CameraView setPage={setPage} setImage={setImage} />
                </Route>
            </Switch>
            <NavLink
                component={Fab}
                to="/scan"
                variant="extended"
                color="primary"
                activeStyle={{ display: 'none' }}
                style={{ position: 'absolute', bottom: '48px', right: '48px' }}
                // isActive={(match, location) => {
                //     if (!match) return false;
                //     return location.pathname == '/';
                // }}
            >
                <CameraIcon style={{ marginRight: '8px' }} />
                Scan
            </NavLink>
        </Router>
    );
}

export default App;
