import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, TextField, Typography, Box, IconButton, Grid } from '@mui/material';
import { Save, Cancel, Add } from '@mui/icons-material';

const mockProjects = [
    { id: 1, projectName: 'Gym Data', projectDesc: 'Data related to gym activities', projectUrl: 'www.gymdata.com', price: '18000', submissionDate: '2024-08-28', selectedDevelopers: ['Charlie Brown', 'Alice Johnson'], requirements: ['Gym Data', 'Login'], developerShares: { 'Charlie Brown': '40', 'Alice Johnson': '60' }, endPoints: [{ key: 'API1', value: '/api/v1/data' }, { key: 'API2', value: '/api/v1/login' }] },
    // Add more mock projects here
];

const ProjectPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [newDeveloper, setNewDeveloper] = useState('');
    const [newDeveloperShare, setNewDeveloperShare] = useState('');
    const [newEndpoint, setNewEndpoint] = useState({ key: '', value: '' });

    useEffect(() => {
        // Fetch project data based on projectId
        const fetchProject = () => {
            // Replace with actual API call
            const projectData = mockProjects.find(p => p.id === parseInt(projectId));
            setProject(projectData);
        };
        fetchProject();
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prevProject => ({ ...prevProject, [name]: value }));
    };

    const handleUpdate = () => {
        // Update project logic here
        console.log('Updated Project:', project);
        // navigate('/products'); // Redirect to the project list or another page
    };

    const handleAddDeveloper = () => {
        if (newDeveloper && !project.selectedDevelopers.includes(newDeveloper) && newDeveloperShare) {
            setProject(prevProject => ({
                ...prevProject,
                selectedDevelopers: [...prevProject.selectedDevelopers, newDeveloper],
                developerShares: { ...prevProject.developerShares, [newDeveloper]: newDeveloperShare },
            }));
            setNewDeveloper('');
            setNewDeveloperShare('');
        }
    };

    const handleRemoveDeveloper = (developer) => {
        const updatedDevelopers = project.selectedDevelopers.filter(d => d !== developer);
        const updatedShares = { ...project.developerShares };
        delete updatedShares[developer];
        setProject(prevProject => ({
            ...prevProject,
            selectedDevelopers: updatedDevelopers,
            developerShares: updatedShares,
        }));
    };

    const handleAddEndpoint = () => {
        if (newEndpoint.key && newEndpoint.value) {
            setProject(prevProject => ({
                ...prevProject,
                endPoints: [...prevProject.endPoints, newEndpoint],
            }));
            setNewEndpoint({ key: '', value: '' });
        }
    };

    if (!project) return <p>Loading...</p>;

    return (
        <motion.div
            // style={{ backgroundColor: "#516381" }}
            className='backdrop-blur-md shadow-lg rounded-xl p-6 border'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Typography variant='h4' component='h1' color='white' mb={4}>
                Project Details
            </Typography>
            <Box component='form' onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <Grid container spacing={2}>
                    {/* Standard Fields */}
                    {['projectName', 'projectDesc', 'projectUrl', 'price', 'submissionDate', 'requirements'].map((field) => (
                        <Grid item xs={12} md={6} key={field}>
                            <Box mb={2}>
                                <Box display='flex' alignItems='center'>
                                    <TextField
                                        fullWidth
                                        label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        name={field}
                                        value={project[field]}
                                        onChange={handleChange}
                                        margin='normal'
                                        multiline={field === 'projectDesc'}
                                        rows={field === 'projectDesc' ? 4 : undefined}
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{
                                            sx: {
                                                color: 'white',
                                                '& .Mui-disabled': {
                                                    color: 'white', // Ensure disabled text color is white
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    ))}

                    {/* Developer Shares */}
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography variant='h6' color='white' mb={1}>Developer Shares</Typography>
                            {project.selectedDevelopers.map(developer => (
                                <Box key={developer} display='flex' alignItems='center' mb={1}>
                                    <TextField
                                        label={developer}
                                        value={project.developerShares[developer]}
                                        onChange={(e) => setProject(prevProject => ({
                                            ...prevProject,
                                            developerShares: {
                                                ...prevProject.developerShares,
                                                [developer]: e.target.value,
                                            },
                                        }))}
                                        margin='normal'
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <IconButton
                                        color='error'
                                        onClick={() => handleRemoveDeveloper(developer)}
                                    >
                                        <Cancel />
                                    </IconButton>
                                </Box>
                            ))}
                            <Box display='flex' alignItems='center' mb={2}>
                                <TextField
                                    label='New Developer'
                                    value={newDeveloper}
                                    onChange={(e) => setNewDeveloper(e.target.value)}
                                    margin='normal'
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                    InputProps={{ sx: { color: 'white' } }}
                                />
                                <TextField
                                    label='Share'
                                    value={newDeveloperShare}
                                    onChange={(e) => setNewDeveloperShare(e.target.value)}
                                    margin='normal'
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                    InputProps={{ sx: { color: 'white' } }}
                                />
                                <IconButton
                                    color='primary'
                                    onClick={handleAddDeveloper}
                                >
                                    <Add />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>

                    {/* End Points */}
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography variant='h6' color='white' mb={1}>End Points</Typography>
                            {project.endPoints.map((endpoint, index) => (
                                <Grid container spacing={2} key={index} mb={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label={`Endpoint ${index + 1} Key`}
                                            value={endpoint.key}
                                            onChange={(e) => {
                                                const newEndpoints = [...project.endPoints];
                                                newEndpoints[index].key = e.target.value;
                                                setProject(prevProject => ({ ...prevProject, endPoints: newEndpoints }));
                                            }}
                                            margin='normal'
                                            InputLabelProps={{ sx: { color: 'white' } }}
                                            InputProps={{ sx: { color: 'white' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label={`Endpoint ${index + 1} Value`}
                                            value={endpoint.value}
                                            onChange={(e) => {
                                                const newEndpoints = [...project.endPoints];
                                                newEndpoints[index].value = e.target.value;
                                                setProject(prevProject => ({ ...prevProject, endPoints: newEndpoints }));
                                            }}
                                            margin='normal'
                                            InputLabelProps={{ sx: { color: 'white' } }}
                                            InputProps={{ sx: { color: 'white' } }}
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                            <Box display='flex' alignItems='center' mb={2}>
                                <TextField
                                    label='New Endpoint Key'
                                    value={newEndpoint.key}
                                    onChange={(e) => setNewEndpoint(prev => ({ ...prev, key: e.target.value }))}
                                    margin='normal'
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                    InputProps={{ sx: { color: 'white' } }}
                                />
                                <TextField
                                    label='New Endpoint Value'
                                    value={newEndpoint.value}
                                    onChange={(e) => setNewEndpoint(prev => ({ ...prev, value: e.target.value }))}
                                    margin='normal'
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                    InputProps={{ sx: { color: 'white' } }}
                                />
                                <IconButton
                                    color='primary'
                                    onClick={handleAddEndpoint}
                                >
                                    <Add />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box mt={2}>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        startIcon={<Save />}
                    >
                        Submit Changes
                    </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<Cancel />}
                        onClick={() => navigate('/projects')}
                        sx={{ ml: 2 }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </motion.div>
    );
};

export default ProjectPage;
