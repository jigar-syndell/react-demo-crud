import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Autocomplete,
  Box,
  Checkbox,
} from "@mui/material";
import { createItems, getItems, getsingleItem } from "../../apis/masters/items";
import Swal from "sweetalert2";

function CreateItem({ initialValues, onSubmit }) {
  const [itemFormData, setItemFormData] = useState({
    itemCode: "",
    itemTitle: "",
    itemGroup: "",
    itemUoM: "",
    isActive: 0,
    mrp: "",
    imagePreview: null,
    image: null,
    company_id: 1,
    closing_stock: 5,
  });
  const [itemsData, setItemsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [itemGroupOptions, setItemGroupOptions] = useState([]);
  const [itemUoMOptions, setItemUoMOptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (initialValues) {
      setItemFormData(initialValues);
    }
  }, [initialValues]);
  // useEffect(() => {
  //   if (initialValues) {
  //     setItemFormData({
  //       ...initialValues,
  //       itemGroup: itemGroupOptions.find(option => option.value === initialValues.itemGroup),
  //       itemUoM: itemUoMOptions.find(option => option.value === initialValues.itemUoM)
  //     });
  //   }
  // }, [initialValues, itemGroupOptions, itemUoMOptions]);

  const fetchLatestData = async () => {
    try {
      const response = await getItems();
      if (response.success) {
        setItemsData(response.data);
        // Extract options for itemGroup and itemUoM
        const itemGroupOptions = response.data.reduce(
          (uniqueOptions, item) => {
            if (!uniqueOptions.idSet.has(item.item_groups.id)) {
              uniqueOptions.idSet.add(item.item_groups.id);
              uniqueOptions.options.push({
                id: item.item_groups.id,
                label: item.item_groups.item_group_name,
              });
            }
            return uniqueOptions;
          },
          { options: [], idSet: new Set() }
        ).options;
        const itemUoMOptions = response.data.reduce(
          (uniqueOptions, item) => {
            if (!uniqueOptions.idSet.has(item.pick_list_values.id)) {
              uniqueOptions.idSet.add(item.pick_list_values.id);
              uniqueOptions.options.push({
                id: item.pick_list_values.id,
                label: item.pick_list_values.pick_list_value,
              });
            }
            return uniqueOptions;
          },
          { options: [], idSet: new Set() }
        ).options;
        setItemGroupOptions(itemGroupOptions);
        setItemUoMOptions(itemUoMOptions);
      } else {
        console.error("Failed to fetch items:", response.error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemFormData({
      ...itemFormData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setItemFormData({
      ...itemFormData,
      [name]: checked ? 0 : 1,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setItemFormData({
      ...itemFormData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
    setErrors({
      ...errors,
      image: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!itemFormData.itemCode) newErrors.itemCode = "Item Code is required";
    if (!itemFormData.itemTitle) newErrors.itemTitle = "Item Title is required";
    if (!itemFormData.itemGroup) newErrors.itemGroup = "Item Group is required";
    if (!itemFormData.itemUoM) newErrors.itemUoM = "Item UoM is required";
    if (!itemFormData.mrp) newErrors.mrp = "MRP is required";
    if (!itemFormData.image) newErrors.image = "Image is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log(itemFormData);

        let data;
        if (initialValues) {
          onSubmit(itemFormData);
          return;
        } else {
          const formData = new FormData();
          formData.append("item_code", itemFormData.itemCode);
          formData.append("item_title", itemFormData.itemTitle);
          formData.append("item_group_id", itemFormData.itemGroup.id);
          formData.append("item_image", itemFormData.image);
          formData.append("uom_pl", itemFormData.itemUoM.id);
          formData.append("mrp", itemFormData.mrp);
          formData.append("closing_stock", itemFormData.closing_stock);
          formData.append("in_active", itemFormData.isActive);
          formData.append("company_id", itemFormData.company_id);
          data = await createItems(formData);
        }

        if (!data.success) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${data.error.data.data.item_code[0]}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${data.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/item");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container className="bg-white p-6">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              {itemFormData.imagePreview ? (
                <img
                  src={itemFormData.imagePreview}
                  alt="Item Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <label htmlFor="image-upload" className="mr-2 cursor-pointer">
                  No image selected
                </label>
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
                value={itemFormData.itemCode}
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
                value={itemFormData.itemTitle}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                size="small"
                error={!!errors.itemTitle}
                helperText={errors.itemTitle ? errors.itemTitle : undefined}
              />
              <Autocomplete
                name="itemGroup"
                options={itemGroupOptions}
                fullWidth
                value={itemFormData.itemGroup}
                onChange={(event, newValue) => {
                  setItemFormData({ ...itemFormData, itemGroup: newValue });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Item Group *" />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                name="itemUoM"
                options={itemUoMOptions}
                fullWidth
                value={itemFormData.itemUoM}
                onChange={(event, newValue) => {
                  setItemFormData({
                    ...itemFormData,
                    itemUoM: newValue,
                  });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Item UoM *" />
                )}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={itemFormData.isActive === 0}
                    onChange={handleCheckboxChange}
                  />
                }
                label="InActive?"
                sx={{ mb: 2 }}
              />
              <TextField
                name="mrp"
                label="MRP *"
                type="number"
                fullWidth
                value={itemFormData.mrp}
                size="small"
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={!!errors.mrp}
                helperText={errors.mrp ? errors.mrp : undefined}
              />
              <Box sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                <label htmlFor="image-upload">Select Image</label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <Typography color="error">{errors.image}</Typography>
                )}
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#5671f0",
                  borderColor: "#5671f0",
                  display: "flex",
                  marginLeft: "auto",
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
