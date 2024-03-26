import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function UpdatePassword() {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match");
            setTimeout(() => {
                setError("");
            }, 3000);
            return;
        }

        // Handle form submission here
        console.log("Current Password:", passwords.currentPassword);
        console.log("New Password:", passwords.newPassword);
        console.log("Confirm Password:", passwords.confirmPassword);
    };

    return (
        <Container>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#fff",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 0 35px 0 rgba(154,161,171,.15)",
                        transition: "all .1s ease-out",
                    }}
                >
                    <form onSubmit={handleSubmit} className="w-2/4 max-md:w-full">
                        <TextField
                            name="currentPassword"
                            label="Current Password"
                            variant="outlined"
                            fullWidth
                            size="small"
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            required
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleTogglePasswordVisibility('currentPassword')}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.currentPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginBottom: "1rem" }}
                        />
                        <TextField
                            name="newPassword"
                            label="New Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            type={showPassword.newPassword ? 'text' : 'password'}
                            required
                            value={passwords.newPassword}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleTogglePasswordVisibility('newPassword')}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.newPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginBottom: "1rem" }}
                        />
                        <TextField
                            name="confirmPassword"
                            label="Confirm New Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            required
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            error={error !== ""}
                            helperText={error}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                                            edge="end"
                                            size="small"
                                            
                                        >
                                            {showPassword.confirmPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginBottom: "1rem" }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#5671f0",
                                borderColor: "#5671f0",
                                boxShadow: "0 0 0 rgba(86,113,240,.5)",
                                "&:hover": {
                                    backgroundColor: "#3353ed",
                                    borderColor: "#274aec",
                                },
                            }}
                        >
                            SAVE
                        </Button>
                    </form>
                </Box>
            </Box>
        </Container>
    );
}

export default UpdatePassword;
