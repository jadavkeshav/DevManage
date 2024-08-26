import { useContext, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import toast from "react-hot-toast"
import { UserContext } from '../../App';

const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const primaryColor = '#6B5B95';  // Coral color
const backgroundColor = '#18212F'; // Dark blue-gray color
const cardBackgroundColor = '#1E2A38'; // Slightly lighter background color for cards
const textPrimaryColor = '#FFFFFF'; // White color for primary text
const textSecondaryColor = '#B0B0B0'; // Light gray color for secondary text

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; // Array of colors for pie slices

const ProjectPage = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [developerNames, setDeveloperNames] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [salesModalOpen, setSalesModalOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [keyValues, setKeyValues] = useState([{ key: '', value: '' }]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sales, setSales] = useState('');

    const { userAuth: { token } } = useContext(UserContext);


    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/${projectId}`);
                const data = response.data.project;
                setProjectData(data);
                setSales(response.data.project.sales)
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

    if (!projectData) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </div>
        );
    }


    const pieData = Object.entries(projectData.developerShares || {}).map(([developerId, share], index) => ({
        name: developerNames[developerId] || 'Unknown',
        value: parseInt(share, 10),
        color: colors[index % colors.length] // Assign a color from the colors array
    }));

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleSalesModalOpen = () => setSalesModalOpen(true);
    const handleSalesModalClose = () => setSalesModalOpen(false);

    const handleAddKeyValue = () => setKeyValues([...keyValues, { key: '', value: '' }]);

    const handleKeyValueChange = (index, field, value) => {
        const newKeyValues = [...keyValues];
        newKeyValues[index][field] = value;
        setKeyValues(newKeyValues);
    };

    const handleSubmit = async () => {
        try {
            const payload = {};
            keyValues.forEach(kv => {
                if (kv.key && kv.value) {
                    payload[kv.key] = kv.value;
                }
            });

            const response = await axios.post(url, payload);

            if (response.status === 200) {
                setSuccess('Data submitted successfully!');
                toast.success("Data submitted successfully!")
                setError('');
                setModalOpen(false);
            } else {
                setSuccess('');
                toast.error("Failed to submit data.")
                setError('Failed to submit data.');
            }
        } catch (err) {
            setSuccess('');
            toast.error("Failed to submit data.", err)
            setError('An error occurred while submitting the data.');
        }
    };

    const handleUpdateSales = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/projects/${projectId}/sales`, { sales }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setSuccess('Sales updated successfully!');
                toast.success("Sales updated successfully!");
                setError('');
                setSalesModalOpen(false);
            } else {
                setSuccess('');
                toast.error("Failed to update sales.");
                setError('Failed to update sales.');
            }
        } catch (err) {
            setSuccess('');
            toast.error("Failed to update sales.");
            setError('An error occurred while updating sales.');
        }
    };

    const handleRedirect = () => {
        if (projectData && projectData.projectUrl) {
            // Ensure projectUrl starts with 'http' or 'https'
            const url = new URL(projectData.projectUrl.startsWith('http') ? projectData.projectUrl : `http://${projectData.projectUrl}`);

            // Open the URL in a new tab
            window.open(url.href, '_blank', 'noopener,noreferrer');
        } else {
            toast.error("No project URL found")
        }
    };



    return (
        <Box p={4} className="min-h-screen" style={{ backgroundColor }}>
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
                <Typography variant="h4" className="text-4xl font-bold" style={{ color: primaryColor }}>
                    {projectData.projectName}
                </Typography>
                <Typography variant="h6" className="text-gray-700" style={{ color: textSecondaryColor }}>
                    {projectData.projectDesc}
                </Typography>
            </motion.div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <Card className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: cardBackgroundColor }}>
                            <CardContent>
                                <Typography variant="h6" className="text-lg font-semibold" style={{ color: textPrimaryColor, marginBottom: 16 }}>
                                    Project Details
                                </Typography>
                                <Typography variant="body1" style={{ color: textPrimaryColor, marginBottom: 8 }}>
                                    URL: <a h onClick={handleRedirect} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{projectData.projectUrl}</a>
                                </Typography>
                                <Typography variant="body1" style={{ color: textPrimaryColor, marginBottom: 8 }}>
                                    Price: ₹{projectData.price}
                                </Typography>
                                <Typography variant="body1" style={{ color: textPrimaryColor }}>
                                    <strong>Submission Date:</strong> {projectData.submissionDate ? format(parseDate(projectData.submissionDate), 'dd MMM yyyy') : 'Invalid date'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" style={{ color: primaryColor, borderColor: primaryColor }} onClick={handleRedirect} rel="noopener noreferrer" variant="outlined">
                                    Visit Project
                                </Button>
                            </CardActions>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <Card className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: cardBackgroundColor }}>
                            <CardContent>
                                <Typography variant="h6" className="text-lg font-semibold" style={{ color: textPrimaryColor, marginBottom: 16 }}>
                                    Sales
                                </Typography>
                                <Typography variant="body1" style={{ color: textPrimaryColor, marginBottom: 8 }}>
                                    Total Sales: {sales}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleSalesModalOpen}>
                                    Update Sales
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full">
                        <Card className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: cardBackgroundColor }}>
                            <CardContent>
                                <Typography variant="h6" className="text-lg font-semibold mb-4" style={{ color: textPrimaryColor }}>
                                    Selected Developers
                                </Typography>
                                <div className="space-y-4">
                                    {(projectData.selectedDevelopers || []).map(developer => (
                                        <Box key={developer._id} className="p-4 shadow-md rounded-lg transition-transform transform hover:scale-105 overflow-hidden" style={{ backgroundColor: cardBackgroundColor, border: `1px solid ${primaryColor}` }}>
                                            <Typography variant="body1" style={{ color: textPrimaryColor, fontWeight: '600' }} className="text-base md:text-lg truncate">
                                                {developer.name}
                                            </Typography>
                                            <Typography variant="body2" style={{ color: textSecondaryColor }} className="mt-1 truncate">
                                                Email: {developer.email}
                                            </Typography>
                                            <Typography variant="body2" style={{ color: textSecondaryColor }} className="mt-1 truncate">
                                                Phone: {developer.phone}
                                            </Typography>
                                            <Chip label={developer._id === projectData.createdBy ? "Admin" : "Developer"} color={developer._id === projectData.createdBy ? "secondary" : "primary"} className="mt-2" style={{ fontWeight: 'bold' }} />
                                        </Box>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full">
                        <Card className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: cardBackgroundColor }}>
                            <CardContent>
                                <Typography variant="h6" className="text-lg font-semibold mb-4" style={{ color: textPrimaryColor }}>
                                    Developer Shares
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="80%"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>


                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <Card
                            className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                            style={{ backgroundColor: cardBackgroundColor }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    className="text-2xl font-bold mb-4"
                                    style={{ color: primaryColor }}
                                >
                                    Requirements
                                </Typography>
                                <ul className="list-disc pl-6 space-y-2">
                                    {(projectData.requirements || []).map((requirement, index) => (
                                        <li
                                            key={index}
                                            className="bg-gray-800 p-2 rounded-md border border-gray-700 hover:bg-gray-700 transition-colors duration-300"
                                            style={{ color: textPrimaryColor }}
                                        >
                                            {requirement}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>


                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <Card
                            className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                            style={{ backgroundColor: cardBackgroundColor }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    className="text-2xl font-bold mb-1"
                                    style={{ color: primaryColor }}
                                >
                                    Endpoints
                                </Typography>
                                {(projectData.endPoints || []).map(endpoint => (
                                    <Box
                                        key={endpoint._id}
                                        mb={1}
                                        className="p-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                                        style={{ color: textPrimaryColor }}
                                    >
                                        <Typography variant="body1" className="text-sm">
                                            <strong>{endpoint.key} : </strong>
                                            <span className="text-blue-400 hover:underline">{endpoint.value}</span>
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>



                {/* Create User for Product Card */}
                <Grid item xs={12} md={6}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <Card className="shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: cardBackgroundColor }}>
                            <CardContent>
                                <Typography variant="h6" className="text-lg font-semibold mb-4" style={{ color: textPrimaryColor }}>
                                    Create User for Product
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleModalOpen}>
                                    Add New User
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Modal for Adding User */}
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="url"
                        label="URL"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    {keyValues.map((keyValue, index) => (
                        <Box key={index} mb={2} display="flex" justifyContent="space-between" alignItems="center">
                            <TextField
                                margin="dense"
                                id={`key-${index}`}
                                label="Key"
                                type="text"
                                variant="outlined"
                                value={keyValue.key}
                                onChange={(e) => handleKeyValueChange(index, 'key', e.target.value)}
                                style={{ marginRight: 8 }}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id={`value-${index}`}
                                label="Value"
                                type="text"
                                variant="outlined"
                                value={keyValue.value}
                                onChange={(e) => handleKeyValueChange(index, 'value', e.target.value)}
                                fullWidth
                            />
                        </Box>
                    ))}
                    <Button onClick={handleAddKeyValue} color="primary" variant="outlined">
                        Add Key-Value Pair
                    </Button>
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    {success && <Typography color="success" variant="body2">{success}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={salesModalOpen} onClose={handleSalesModalClose}>
                <DialogTitle>Update Sales</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Total Sales"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={sales}
                        onChange={(e) => setSales(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                    {success && <Typography color="success">{success}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSalesModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSales} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectPage;
