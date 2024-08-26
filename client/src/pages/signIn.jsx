import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { storeIsSession } from '../session/session';
import toast from "react-hot-toast"

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https:devmanage.vercel.app">
                DevManage
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.


export default function SignIn() {

    const [loading, setLoading] = React.useState(false);
    let { userAuth, userAuth: { token }, setUserAuth } = React.useContext(UserContext);

    const navigate = useNavigate();

    React.useEffect(() => {
        if (userAuth && userAuth.token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setLoading(true);
        toast.loading("Logging in...");
        // console.log({
        //     email: data.get('email'),
        //     password: data.get('password'),
        // });

        await axios.post(import.meta.env.VITE_BASE_URL + '/users/login', {
            email: data.get('email'),
            password: data.get('password'),
        })
            .then(({ data }) => {
                storeIsSession("user", JSON.stringify(data))
                setUserAuth(data)
                if (data.token) {
                    toast.dismiss();
                    toast.success("Login Successful")
                    navigate('/')
                }
            })
            .catch(({ response }) => {
                toast.dismiss();
                toast.error(response.data.message)
            })
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </>
    );
}