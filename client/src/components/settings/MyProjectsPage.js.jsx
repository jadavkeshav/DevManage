import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CardActions } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../../App';
import SettingSection from '../../components/settings/SettingSection'; // Ensure this path is correct
import { Briefcase } from 'lucide-react'; // Use this icon or another suitable one

const MyProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const { userAuth: { token } } = useContext(UserContext);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-projects`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setProjects(response.data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError('Failed to fetch projects.');
            }
        };

        fetchProjects();
    }, [token]);

    return (
        <SettingSection icon={Briefcase} title="My Projects">
            <Box p={4}>
                {error && <Typography color="error" mb={2}>{error}</Typography>}
                <Grid container spacing={4}>
                    {projects.map(project => (
                        <Grid item xs={12} md={6} key={project._id}>
                            <Card sx={{ 
                                borderRadius: '12px', 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                                transition: 'transform 0.3s ease-in-out', 
                                '&:hover': { transform: 'scale(1.03)' } 
                            }}>
                                <CardContent sx={{ padding: '16px' }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {project.projectName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {project.projectDesc}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" mb={2}>
                                        Price: ₹{project.price}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ padding: '16px', justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        href={project.projectUrl} 
                                        target="_blank" 
                                        sx={{ 
                                            borderRadius: '8px',
                                            padding: '6px 16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Visit Project
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </SettingSection>
    );
};

export default MyProjectsPage;
