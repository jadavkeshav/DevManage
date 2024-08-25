import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../../App';
import { formatMoney } from '../../util/priceFormat';
import SettingSection from '../../components/settings/SettingSection'; // Ensure this path is correct
; // Ensure this path is correct
import { DollarSign } from 'lucide-react'; // Use this icon or another suitable one

const MoneyEarned = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [error, setError] = useState('');
    const { userAuth: { token } } = useContext(UserContext);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-total-earnings`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setTotalEarnings(response.data.totalEarning);
            } catch (error) {
                console.error("Error fetching earnings:", error);
                setError('Failed to fetch earnings.');
            }
        };

        fetchEarnings();
    }, [token]);

    return (
        <SettingSection icon={DollarSign} title="Money Earned">
            <Box p={4}>
                {error && <Typography color="error" mb={2}>{error}</Typography>}
                <Card sx={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                    transition: 'transform 0.3s ease-in-out', 
                    '&:hover': { transform: 'scale(1.03)' },
                    padding: '16px'
                }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Total Earnings:
                        </Typography>
                        <Typography variant="h4" color="text.primary" mt={1}>
                            {formatMoney(totalEarnings)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </SettingSection>
    );
};

export default MoneyEarned;
