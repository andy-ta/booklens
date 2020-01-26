import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    Divider
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import languages from '../utils/languages';

export default function Pages() {
    const history = useHistory();

    const [pages, setPages] = useState([]);
    const [lang, setLang] = useState(localStorage.getItem('lang') || undefined);

    useEffect(() => {
        Axios.get('/api/pages')
            .then(res => res.data)
            .then(pages =>
                pages.map(page => ({
                    ...page,
                    image: `/api/pages/${page.id}/image`
                }))
            )
            .then(pages => setPages(pages));
    }, []);

    if (lang === undefined) {
        return (
            <>
                <img
                    src="hero.png"
                    alt="hero"
                    style={{
                        maxHeight: '50vh',
                        margin: 'auto',
                        maxWidth: '100%'
                    }}
                />

                <Typography variant="h6">I already know</Typography>
                <Autocomplete
                    id="combo-box-demo"
                    options={languages}
                    getOptionLabel={option => option.language}
                    style={{ width: 300, margin: 'auto', marginTop: '1em' }}
                    onChange={(_, value) => {
                        localStorage.setItem('lang', value.code);
                        setLang(value.code);
                        history.push('/scan');
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Language"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

                <Divider
                    variant="middle"
                    style={{ margin: '2em auto', width: '400px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                        localStorage.setItem('lang', JSON.parse(null));
                        setLang(null);
                        history.push('/scan');
                    }}
                >
                    I'm learning my 1st language!
                </Button>
            </>
        );
    }
    return (
        <Grid container spacing={3}>
            {pages.map(page => (
                <Grid item xs={3} key={page.id}>
                    <Link to={`/page/${page.id}`}>
                        <Paper>
                            <img
                                src={page.image}
                                alt="book"
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
}
