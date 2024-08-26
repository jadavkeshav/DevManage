import { useState } from 'react';
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
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



export default function SignUp() {

    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        userName: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSendOtp = async () => {
        setLoading(true);
        toast.loading("Sending OTP...");
        try {

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/send-otp`, {
                email: userData.email
            });
            if (response.status === 200) {
                setOtpSent(true);
                toast.dismiss();
                toast.success('OTP sent to your email');
            }
        } catch (error) {
            // console.error('Error sending OTP:', error);
            toast.dismiss();
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        toast.loading("Verifying OTP...");
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp`, {
                email: userData.email,
                otp
            });
            if (response.status === 200) {
                toast.dismiss();
                toast.success('OTP verified successfully');
                await handleRegister(); // Proceed to register the user
            } else {
                toast.dismiss();
                toast.error('Invalid or expired OTP');
            }
        } catch (error) {
            toast.dismiss();
            // console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        toast.loading("Registering...");
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData);
            if (response.status === 201) {
                toast.dismiss();
                toast.success('Registration successful');
                navigate('/signin');

            } else {
                toast.dismiss();
                toast.error('Failed to register user');
            }
        } catch (error) {
            toast.dismiss();
            // console.error('Error registering user:', error);
            toast.error('Failed to register user');
        } finally {
            setLoading(false);
        }
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
                        Sign up
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    autoComplete="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Username"
                                    name="userName"
                                    autoComplete="username"
                                    value={userData.userName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    autoComplete="phone"
                                    value={userData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={userData.password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {otpSent && (
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="otp"
                                        label="Enter OTP"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {!otpSent ? (
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSendOtp}
                            >
                                Send OTP
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleVerifyOtp}
                            >
                                Verify OTP
                            </Button>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
