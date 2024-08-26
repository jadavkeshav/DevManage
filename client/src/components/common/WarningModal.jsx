import { Modal, Box, Typography, Button } from '@mui/material';

const WarningModal = ({ open, onClose, onConfirm , message}) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="warning-modal" aria-describedby="warning-modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography id="warning-modal-title" variant="h6" component="h2">
                    Are you sure?
                </Typography>
                <Typography id="warning-modal-description" sx={{ mt: 2 }}>
                   {message}
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default WarningModal;
