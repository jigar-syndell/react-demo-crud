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

function CreateItem({ initialValues, onSubmit }) {
  const [formData, setFormData] = useState(initialValues || {
    itemCode: '',
    itemTitle: '',
    itemGroup: '',
    itemUoM: '',
    isActive: false,
    mrp: '',
    imagePreview: null,
    image: null
  });
  const [errors, setErrors] = useState({});
  console.log(formData)

  useEffect(() => {
    setFormData(initialValues || {
      itemCode: '',
      itemTitle: '',
      itemGroup: '',
      itemUoM: '',
      isActive: false,
      mrp: '',
      imagePreview: null,
      image: null
    });
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error message when user starts typing
    setErrors({
      ...errors,
      [name]: ''
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
    setFormData({
      ...formData,
      image: file,
      imagePreview: URL.createObjectURL(file)
    });
    // Clear error message when user selects an image
    setErrors({
      ...errors,
      image: ''
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate form fields
    const newErrors = {};
    if (!formData.itemCode) newErrors.itemCode = 'Item Code is required';
    if (!formData.itemTitle) newErrors.itemTitle = 'Item Title is required';
    if (!formData.itemGroup) newErrors.itemGroup = 'Item Group is required';
    if (!formData.itemUoM) newErrors.itemUoM = 'Item UoM is required';
    if (!formData.mrp) newErrors.mrp = 'MRP is required';
    if (!formData.image) newErrors.image = 'Image is required';
  
    setErrors(newErrors);
    setTimeout(() => {
      setErrors({});
    }, 3000);
  
    if (Object.keys(newErrors).length === 0) {
      if(initialValues){
        onSubmit(formData);
      }
      console.log(formData);
    }
  };
  

  return (
    <Container className='bg-white p-6'>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Item Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              ) : (
                <Typography variant="body1">No image selected</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
            <TextField
                name="itemCode"
                label="Item Code *"
                type="text"
                fullWidth
                value={formData.itemCode}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                size="small"
                error={!!errors.itemCode}
                helperText={errors.itemCode ? errors.itemCode : undefined}
              />
              <TextField
                name="itemTitle"
                label="Item Title *"
                type="text"
                fullWidth
                value={formData.itemTitle}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                size="small"
                error={!!errors.itemTitle}
                helperText={errors.itemTitle ? errors.itemTitle : undefined}
              />
              <Autocomplete
                name="itemGroup"
                options={['Group1', 'Group2']}
                fullWidth
                value={formData.itemGroup}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, itemGroup: newValue });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
                renderInput={(params) => <TextField {...params} size="small" label="Item Group *" />}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                name="itemUoM"
                options={['pcs', 'kg']}
                fullWidth
                value={formData.itemUoM}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, itemUoM: newValue });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} size="small" label="Item UoM *" />}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />}
                label="InActive?"
                sx={{ mb: 2 }}
              />
              <TextField
                name="mrp"
                label="MRP *"
                type="number"
                fullWidth
                value={formData.mrp}
                size="small"
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={!!errors.mrp}
                helperText={errors.mrp ? errors.mrp : undefined}
              />
              <Box sx={{ mb: 2, display:'flex', flexDirection:'column' }}>
                <label htmlFor="image-upload">Select Image</label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} />
                {errors.image && <Typography color="error">{errors.image}</Typography>}
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#5671f0",
                  borderColor: "#5671f0",
                  display:'flex', 
                  marginLeft:'auto',
                  boxShadow: "0 0 0 rgba(86,113,240,.5)",
                  "&:hover": {
                      backgroundColor: "#3353ed",
                      borderColor: "#274aec",
                  },
                }}
              >
                SAVE
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default CreateItem;
