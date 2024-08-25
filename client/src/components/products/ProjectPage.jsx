import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

const ProjectPage = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [developerNames, setDeveloperNames] = useState({});

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/${projectId}`);
                const data = response.data.project;
                setProjectData(data);

                // Create a mapping of developer IDs to names
                const names = data.selectedDevelopers.reduce((acc, developer) => {
                    acc[developer._id] = developer.name;
                    return acc;
                }, {});
                setDeveloperNames(names);

            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchProjectData();
    }, [projectId]);

    console.log(projectData)

    if (!projectData) return <Typography>Loading...</Typography>;

    return (
        <Box p={4} className="z-100">
            <Typography variant="h4" gutterBottom>{projectData.projectName}</Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>{projectData.projectDesc}</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Project Details</Typography>
                            <Typography variant="body1">URL: <a href={projectData.projectUrl} target="_blank" rel="noopener noreferrer">{projectData.projectUrl}</a></Typography>
                            <Typography variant="body1">Price: ₹{projectData.price}</Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Submission Date:</strong> {projectData.submissionDate ? format(parseDate(projectData.submissionDate), 'dd MMM yyyy') : 'Invalid date'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" href={projectData.projectUrl} target="_blank" rel="noopener noreferrer">Visit Project</Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Selected Developers</Typography>
                            {(projectData.selectedDevelopers || []).map(developer => (
                                <Box key={developer._id} mb={2}>
                                    <Typography variant="body1">{developer.name}</Typography>
                                    <Typography variant="body2">Email: {developer.email}</Typography>
                                    <Typography variant="body2">Phone: {developer.phone}</Typography>
                                    {developer._id === projectData.createdBy && (
                                        <Chip label="Admin" color="secondary" />
                                    )}
                                    {developer._id != projectData.createdBy && (
                                        <Chip label="Developer" color="primary" />
                                    )}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Requirements</Typography>
                            <ul>
                                {(projectData.requirements || []).map((requirement, index) => (
                                    <li key={index}>
                                        <Typography variant="body1">{requirement}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Endpoints</Typography>
                            {(projectData.endPoints || []).map(endpoint => (
                                <Box key={endpoint._id} mb={2}>
                                    <Typography variant="body1">{endpoint.key}: {endpoint.value}</Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Developer Shares</Typography>
                            <ul>
                                {Object.entries(projectData.developerShares || {}).map(([developerId, share]) => (
                                    <li key={developerId}>
                                        <Typography variant="body1">Developer Name: {developerNames[developerId] || 'Unknown'} - Share: {share}%</Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProjectPage;
