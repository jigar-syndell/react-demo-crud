import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Autocomplete,
  Box,
  Checkbox
} from '@mui/material';

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    image: null,
    isActive: false
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    setSelectedImage(URL.createObjectURL(file));
    setFormData({
      ...formData,
      image: file
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement form submission logic here
    console.log(formData);
  };

  return (
    <Container className="py-8">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={"1.5rem"}  sx={{background:"#fff", marginBottom:"1.5rem"}}>
          <Grid item xs={12} md={6} sx={{marginBottom:"1.5rem"}}>
          <Box >
              <TextField
                name="name"
                label="Name"
                type="text"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                size='small'
                 sx={{
                    marginBottom : "16px"
                }}
                required
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                 sx={{
                    marginBottom : "16px"
                }}
               
                size='small'
                required
              />
              <Autocomplete
                name="company"
                options={['Company1', 'Company2']}
                fullWidth
                value={formData.company}
                onChange={(event, newValue) => setFormData({ ...formData, company: newValue })}
                renderInput={(params) => <TextField {...params} label="Company *" />}
                 sx={{
                    marginBottom : "16px"
                }}
                size='small'
                required
              />
              <Autocomplete
                name="role"
                options={['Role1', 'Role2']}
                fullWidth
                value={formData.role}
                onChange={(event, newValue) => setFormData({ ...formData, role: newValue })}
                renderInput={(params) => <TextField {...params} label="Role *" />}
                 sx={{
                    marginBottom : "16px"
                }}
                size='small'
                required
              />
              <Box   sx={{ mb: 2, display:'flex', flexDirection:'column' }}>
                <label htmlFor="image-upload" className="mr-2 cursor-pointer">Select Profile Pic</label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} required />
              </Box>
              <FormControlLabel
                control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />}
                label="Is Active?"
                 sx={{
                    marginBottom : "16px"
                }}
              />
              <Box sx={{display:"flex", columnGap:"15px"}}>
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
              <Button
                variant="contained"
                sx={{
                    backgroundColor: "#43bfe5",
                    borderColor: "#43bfe5",
                    boxShadow: "0 0 0 rgba(67,191,229,.5)",
                    "&:hover": {
                        backgroundColor: "#21b4e0",
                        borderColor: "#1eacd7",
                    },
                  }}
                >
                Back
              </Button>
                  </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{padding :"10px"}}>
              {selectedImage ? (
                <img src={selectedImage} image='40' alt="Selected Image"  />
              ) : (
                <label htmlFor="image-upload" className="mr-2 cursor-pointer">No image selected</label>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Profile;
