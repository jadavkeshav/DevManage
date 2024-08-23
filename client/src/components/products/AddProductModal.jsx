import { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Select, MenuItem, IconButton, Grid, Divider, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Trash2 } from 'lucide-react';
import { Add } from '@mui/icons-material';

const developersList = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince'
];

const AddProductModal = ({ open, onClose }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [availableDevelopers, setAvailableDevelopers] = useState(developersList);
    const [price, setPrice] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [developerShares, setDeveloperShares] = useState({});
    const [endPoints, setEndPoints] = useState([{ key: '', value: '' }]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Project Data:', { projectName, projectDesc, projectUrl, submissionDate, selectedDevelopers, price, requirements, developerShares, endPoints });
        onClose(); // Close the modal after submission
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
        if (!selectedDevelopers.includes(developer)) {
            setSelectedDevelopers([...selectedDevelopers, developer]);
            setAvailableDevelopers(availableDevelopers.filter(dev => dev !== developer));
            setDeveloperShares({ ...developerShares, [developer]: 0 });
        }
    };

    const handleRemoveDeveloper = (developer) => {
        setSelectedDevelopers(selectedDevelopers.filter(dev => dev !== developer));
        setAvailableDevelopers([...availableDevelopers, developer]);
        const { [developer]: _, ...remainingShares } = developerShares;
        setDeveloperShares(remainingShares);
    };

    const handleShareChange = (developer, value) => {
        setDeveloperShares({ ...developerShares, [developer]: value });
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
                            {selectedDevelopers.map(developer => (
                                <Box
                                    key={developer}
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
                                    {developer}
                                    <TextField
                                        label='Share (%)'
                                        variant='outlined'
                                        type='number'
                                        value={developerShares[developer]}
                                        onChange={(e) => handleShareChange(developer, e.target.value)}
                                        margin='normal'
                                        sx={{ width: '80px', mx: 2 }}
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <Typography variant='body2'>
                                        Earns: ₹{((price * developerShares[developer]) / 100).toFixed(2)}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleRemoveDeveloper(developer)}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                </Box>
                            ))}
                            <Box display='flex' alignItems='center' mb={2}>
                                <Select
                                    fullWidth
                                    value=''
                                    onChange={(e) => handleAddDeveloper(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select Developer' }}
                                    sx={{ backgroundColor: 'gray.800', color: 'white' }}
                                    InputLabelProps={{ sx: { color: 'white' } }}
                                >
                                    <MenuItem value='' disabled>Select Developer</MenuItem>
                                    {availableDevelopers.map(dev => (
                                        <MenuItem key={dev} value={dev}>{dev}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1'>Project Requirements</Typography>
                            {requirements.map((req, index) => (
                                <Box key={index} display='flex' alignItems='center' gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        label='Requirement'
                                        variant='outlined'
                                        value={req}
                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
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
                            <Button
                                onClick={handleAddRequirement}
                                variant='outlined'
                                color='primary'
                                sx={{ mb: 2, mt: 2 }}
                            >
                                Add Requirement
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body1'>Project Endpoints</Typography>
                            {endPoints.map((endPoint, index) => (
                                <Box key={index} display='flex' alignItems='center' gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        label='Endpoint Name'
                                        variant='outlined'
                                        value={endPoint.key}
                                        onChange={(e) => handleEndPointChange(index, 'key', e.target.value)}
                                        InputLabelProps={{ sx: { color: 'white' } }}
                                        InputProps={{ sx: { color: 'white' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label='Endpoint URL'
                                        variant='outlined'
                                        value={endPoint.value}
                                        onChange={(e) => handleEndPointChange(index, 'value', e.target.value)}
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
                            <Tooltip title='Add Endpoint'>
                                <IconButton
                                    onClick={handleAddEndPoint}
                                    sx={{
                                        color: 'primary.main',
                                        borderRadius: '50%',
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'background.default',
                                        },
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                    >
                        Add Project
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddProductModal;
