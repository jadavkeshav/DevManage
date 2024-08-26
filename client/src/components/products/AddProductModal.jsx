import { useContext, useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Select, MenuItem, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Trash2 } from 'lucide-react';
import { Add } from '@mui/icons-material';
import { UserContext } from '../../App';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProductModal = ({ open, onClose }) => {
    let { userAuth } = useContext(UserContext);

    const [developersList, setDevelopesList] = useState([]);
    const [availableDevelopers, setAvailableDevelopers] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [price, setPrice] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [developerShares, setDeveloperShares] = useState({});
    const [endPoints, setEndPoints] = useState([{ key: '', value: '' }]);


    const getAllDevelopers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-all-developers`, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`
                }
            });
            setDevelopesList(response.data.users);
            setAvailableDevelopers(response.data.users);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        getAllDevelopers();
    }, [userAuth]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const projectData = {
            projectName,
            projectDesc,
            projectUrl,
            price,
            submissionDate,
            selectedDevelopers,
            requirements,
            developerShares,
            endPoints
        };

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/projects/create`, projectData, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Project created successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleAddRequirement = () => {
        setRequirements([...requirements, '']);
    };

    const handleRequirementChange = (index, value) => {
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = value;
        setRequirements(updatedRequirements);
    };

    const handleRemoveRequirement = (index) => {
        const updatedRequirements = requirements.filter((_, i) => i !== index);
        setRequirements(updatedRequirements);
    };

    const handleAddDeveloper = (developer) => {
        if (!selectedDevelopers.some(dev => dev._id === developer._id)) {
            setSelectedDevelopers([...selectedDevelopers, developer]);
            setAvailableDevelopers(availableDevelopers.filter(dev => dev._id !== developer._id));
            setDeveloperShares({ ...developerShares, [developer._id]: 0 });
        }
    };

    const handleRemoveDeveloper = (developerId) => {
        const developer = selectedDevelopers.find(dev => dev._id === developerId);
        if (developer) {
            setSelectedDevelopers(selectedDevelopers.filter(dev => dev._id !== developerId));
            setAvailableDevelopers([...availableDevelopers, developer]);
            setDeveloperShares(prevShares => {
                const { [developerId]: _, ...remainingShares } = prevShares;
                return remainingShares;
            });
        }
    };

    const handleShareChange = (developerId, value) => {
        setDeveloperShares({ ...developerShares, [developerId]: value });
    };

    const handleAddEndPoint = () => {
        setEndPoints([...endPoints, { key: '', value: '' }]);
    };

    const handleEndPointChange = (index, field, value) => {
        const updatedEndPoints = [...endPoints];
        updatedEndPoints[index][field] = value;
        setEndPoints(updatedEndPoints);
    };

    const handleRemoveEndPoint = (index) => {
        const updatedEndPoints = endPoints.filter((_, i) => i !== index);
        setEndPoints(updatedEndPoints);
    };

    return (
        <Modal open={open} onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    maxWidth: 800,
                    width: '90%',
                    margin: 'auto',
                    bgcolor: '#1C2634',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    height: '90%',
                    color: 'white',
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant='h6' component='h2' mb={2} color='white'>
                    Add New Project
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label='Project Name'
                                variant='outlined'
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                margin='normal'
                                required
                                InputLabelProps={{ sx: { color: 'white' } }}
                                InputProps={{ sx: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label='Project URL (Optional)'
                                variant='outlined'
                                value={projectUrl}
                                onChange={(e) => setProjectUrl(e.target.value)}
                                margin='normal'
                                InputLabelProps={{ sx: { color: 'white' } }}
                                InputProps={{ sx: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label='Project Price'
                                variant='outlined'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                margin='normal'
                                required
                                InputLabelProps={{ sx: { color: 'white' } }}
                                InputProps={{ sx: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label='Submission Date'
                                type='date'
                                InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                                value={submissionDate}
                                onChange={(e) => setSubmissionDate(e.target.value)}
                                margin='normal'
                                required
                                InputProps={{ sx: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Project Description'
                                variant='outlined'
                                multiline
                                rows={4}
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                margin='normal'
                                required
                                InputLabelProps={{ sx: { color: 'white' } }}
                                InputProps={{ sx: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1'>Project Developers</Typography>
                            {selectedDevelopers.length > 0 ? (
                                selectedDevelopers.map(developer => (
                                    <Box
                                        key={developer._id}
                                        sx={{
                                            bgcolor: 'grey.800',
                                            color: 'text.primary',
                                            borderRadius: 1,
                                            py: 1,
                                            px: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
                                        {developer.name}
                                        <TextField
                                            label='Share (%)'
                                            variant='outlined'
                                            type='number'
                                            value={developerShares[developer._id] || ''}
                                            onChange={(e) => handleShareChange(developer._id, e.target.value)}
                                            margin='normal'
                                            sx={{ width: '80px', mx: 2 }}
                                            InputLabelProps={{ sx: { color: 'white' } }}
                                            InputProps={{ sx: { color: 'white' } }}
                                        />
                                        <Typography variant='body2'>
                                            Earns: ₹{((price * (developerShares[developer._id] || 0)) / 100).toFixed(2)}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleRemoveDeveloper(developer._id)}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant='body2'>No developers selected</Typography>
                            )}
                            <Box display='flex' alignItems='center' mb={2}>
                                <Select
                                    fullWidth
                                    value=''
                                    onChange={(e) => {
                                        const developer = developersList.find(dev => dev._id === e.target.value);
                                        if (developer) handleAddDeveloper(developer);
                                    }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select Developer' }}
                                    sx={{ backgroundColor: 'gray.800', color: 'white' }}
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                >
                                    <MenuItem value='' disabled>Select Developer</MenuItem>
                                    {Array.isArray(availableDevelopers) && availableDevelopers.map(dev => (
                                        <MenuItem key={dev._id} value={dev._id}>{dev.name}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1'>Project Requirements</Typography>
                            {requirements.map((req, index) => (
                                <Box key={index} display='flex' alignItems='center' mb={2}>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        value={req}
                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                                        margin='normal'
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveRequirement(index)}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Trash2 />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button onClick={handleAddRequirement} startIcon={<Add />} variant='outlined' sx={{ color: 'white' }}>
                                Add Requirement
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1'>End Points</Typography>
                            {endPoints.map((endPoint, index) => (
                                <Box key={index} display='flex' alignItems='center' mb={2}>
                                    <TextField
                                        label='Key'
                                        variant='outlined'
                                        value={endPoint.key}
                                        onChange={(e) => handleEndPointChange(index, 'key', e.target.value)}
                                        margin='normal'
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <TextField
                                        label='Value'
                                        variant='outlined'
                                        value={endPoint.value}
                                        onChange={(e) => handleEndPointChange(index, 'value', e.target.value)}
                                        margin='normal'
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveEndPoint(index)}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Trash2 />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button onClick={handleAddEndPoint} startIcon={<Add />} variant='outlined' sx={{ color: 'white' }}>
                                Add End Point
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant='contained' color='primary'>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddProductModal;
