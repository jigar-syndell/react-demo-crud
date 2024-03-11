import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function ResetPassword() {
    const [passwords, setPasswords] = useState({
        username: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            username: e.target.value,
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
        console.log("Username:", passwords.username);
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
                    <form onSubmit={handleSubmit} style={{ width: "50%" }}>
                        <Autocomplete
                            value={passwords.username}
                            onChange={(event, newValue) => {
                                setPasswords({ ...passwords, username: newValue });
                            }}
                            options={["User 1", "User 2", "User 3"]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select User"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    required
                                />
                            )}
                            sx={{ "& input": { color: "#6c757d" } }} // Set font color to #6c757d
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
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('newPassword')}
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
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            error={error !== ""}
                            helperText={error}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
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

export default ResetPassword;
