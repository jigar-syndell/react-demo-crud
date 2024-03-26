import React, { useEffect, useMemo, useState, useRef  } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import { mkConfig, generateCsv, download } from "export-to-csv";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomPopup from "../../utils/customPopup";
import Swal from 'sweetalert2'
import { IconButton, InputAdornment } from '@mui/material';
import { deletePickListValue, getPickListValues } from "../../apis/masters/pickListValue";

import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Menu,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "PickListValue",
});

const Picklistvalue = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pickListValueData, setPickListValueData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [pickListValue, setPickListValue] = useState({ name: "", isactive: false });
  const [pickListValueType, setPickListValueType] = useState(null);
  const [error, setError] = useState({ name: "", type: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayPopup, setDisplayPopup] = useState({show : false,type : '', mgs : ''});
  const [visibleColumns, setVisibleColumns] = useState({
    Id: true,
    "Pick List Value": true,
    "Pick List Value Type": true,
    "InActive?": true,
    "Created By": true,
    "Created On": true,
    Delete: true,
    Edit: true,
  });

  // fetch latestdata
  const fetchLatestData = ()=>{
    getPickListValues()
    .then((response) => {
      console.log(response)
      if (response.success) {
        setPickListValueData(response.data);
      } else {
        console.error("Failed to fetch pick list types:", response.error);
      }
    })
    .catch((error) => {
      console.error("Error fetching pick list types:", error);
    });
  }
  
  useEffect(() => {
    fetchLatestData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopyVisibleData = () => {
    const visibleData = pickListValueData
      .map((item) => {
        return Object.keys(item)
          .filter((key) => visibleColumns[key])
          .map((key) => item[key])
          .join(", ");
      })
      .join("\n");
    navigator.clipboard.writeText(visibleData);
    setDisplayPopup({show : true, type:"success", mgs:"Data Copied to Clipboard"})
    setTimeout(() => {
      setDisplayPopup({show : false, type:"", mgs:""})
    }, 3000);
  };

  const handlePrint = () => {
    // Logic to print table data
    window.print();
  };

  const handleExportCSV = () => {
    // Logic to export table data to CSV
    const csv = generateCsv(csvConfig)(pickListValueData);
    download(csvConfig)(csv);
    setDisplayPopup({show : true, type:"success", mgs:"CSV file Exported"})
    setTimeout(() => {
      setDisplayPopup({show : false, type:"", mgs:""})
    }, 3000);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deletePickListValue(id)
          .then((response) => {
            if (response.success) {
              Swal.fire({
                title: "Deleted!",
                text: response.message || "Your Pick List value has been created.",
                icon: "success"
              });
              // fetch updated data
              fetchLatestData();

            } else {
              console.log(response.error.data.message)
              Swal.fire({
                title: "Error!",
                text: response.error.data.message || "Failed to delete the Pick List value.",
                icon: "error"
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the Pick List value.",
              icon: "error"
            });
            console.error("Error deleting Pick List value:", error);
          });
      }
    });
  };
  const handleEdit = (id) => {
    console.log(id);
    let filteredData = pickListValueData.filter(item => item.id === id);
    filteredData = filteredData[0]
    console.log(filteredData)

    setPickListValue({name : filteredData.pick_list_value, isactive : filteredData.in_active === '1' ? true : false   });
    setPickListValueType( { label:`${filteredData.pick_list_types.pick_list_type}`, value: `${filteredData.pick_list_types.id}` })
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  

  const handleToggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const sortedData = pickListValueData.sort((a, b) => {
    if(sortConfig.direction === ""){
      return
    }
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const filteredData = sortedData.filter((item) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const visibleColumnsArray = Object.keys(visibleColumns).filter(
    (column) => visibleColumns[column]
  );
  const pickListValueTypes = [
    { label: "Type 0", value: "Type 0" },
    { label: "Type 1", value: "Type 1" },
    { label: "Type 2", value: "Type 2" },
    { label: "Type 3", value: "Type 3" },
    { label: "Type 4", value: "Type 4" },
    { label: "Type 5", value: "Type 5" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const removeError = () => {
      setTimeout(() => {
        setError({ name: "", type: "" });
      }, 3000);
    };
    if (!pickListValue.name.trim()) {
      setError((prevErrors) => ({
        ...prevErrors,
        name: "Please enter a name",
      }));
      removeError();
      return;
    }
    console.log(pickListValueType);
    if (pickListValueType == null) {
      setError((prevErrors) => ({
        ...prevErrors,
        type: "Please select a type",
      }));
      removeError();
      return;
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          sx={{
            padding: "24px",
            backgroundColor: "#fff",
            borderRadius: "0.25rem",
          }}
        >
          <Box sx={{ width: "80%", display: "flex", flexDirection: "row" }}>
            <TextField
              label="Pick List Value *"
              variant="outlined"
              fullWidth
              value={pickListValue.name}
              onChange={(e) => {
                setPickListValue({ ...pickListValue, name: e.target.value });
              }}
              size="small"
              error={!!error.name}
              helperText={error.name}
              sx={{ margin: "0 12px", color:"#6c757d" }}
            />
            <Autocomplete
              options={pickListValueTypes}
              getOptionLabel={(option) => option.label}
              fullWidth
              value={pickListValueType}
              onChange={(event, value) => {
                setError((prevErrors) => ({ ...prevErrors, name: "" }));
                setPickListValueType(value);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pick List Value Type"
                  variant="outlined"
                  size="small"
                  error={!!error.type} 
                  helperText={error.type} 
                />
              )}
              size="small"
              sx={{ margin: "0 12px" }}
            />
          </Box>
          <Box
            sx={{
              width: "20%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={!!pickListValue.isactive} />}
              label="IsActive"
              onChange={(e) =>
                setPickListValue({ ...pickListValue, isactive: e.target.checked })
              }
              sx={{
                fontSize: ".5rem",
                margin: "0",
              }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "70%",
                marginLeft: "auto", // Align the button to the right
                backgroundColor: "#5671f0",
                borderColor: "#5671f0",
                textTransform: "none",
                boxShadow: "0 0 0 rgba(86,113,240,.5)",
                "&:hover": {
                  backgroundColor: "#3353ed",
                  borderColor: "#274aec",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </form>
      <Box className="bg-white p-6 mb-6 rounded">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{
            '@media (max-width: 800px)': {
              flexDirection: 'column',
              alignItems: 'center',
              rowGap:'10px'
            },
          }}
        >
          <Box display="flex" alignItems="center" sx={{ columnGap: "5px" }}>
            <Typography variant="body1">Show</Typography>
            <FormControl sx={{ width: "100%" }}>
              <Select
                labelId="rows-per-page-label"
                id="rows-per-page"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Rows per page"
                sx={{
                  height: "calc(1.5em + 0.56rem + 2px)",
                  paddingTop: "0.28rem",
                  paddingBottom: "0.28rem",
                  paddingLeft: "0.8rem",
                  fontSize: ".756rem",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "#6c757d",
                  border: "1px solid #ced4da",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  borderRadius: "0.25rem",
                  "&:focus": {
                    borderColor: "#6c757d", // Change border color on focus
                  },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: 0,
                    },
                  "& div": {
                    paddingLeft: "0px",
                  },
                }}
                MenuProps={{
                  sx: {
                    "& li": {
                      fontSize: ".756rem",
                      fontWeight: 400,
                      lineHeight: 1.5,
                    },
                  },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body1">entries</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              sx={{
                bgcolor: "#6c757d",
                borderRadius: "0",
                padding: "0.45rem 0.9rem",
                textTransform: "none",
                color: "#fff",
                borderRadius: "0.15rem 0 0 0.15rem",
                "&:hover": { bgcolor: "#5a6268" },
              }}
              size="small"
              onClick={handleCopyVisibleData}
            >
              Copy
            </Button>
            <Button
              sx={{
                bgcolor: "#6c757d",
                borderRadius: "0",
                padding: "0.45rem 0.9rem",
                textTransform: "none",
                color: "#fff",
                "&:hover": { bgcolor: "#5a6268" },
              }}
              size="small"
              onClick={handleExportCSV}
            >
              CSV
            </Button>
            <Button
              sx={{
                bgcolor: "#6c757d",
                borderRadius: "0",
                padding: "0.45rem 0.9rem",
                textTransform: "none",
                color: "#fff",
                "&:hover": { bgcolor: "#5a6268" },
              }}
              size="small"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              sx={{
                bgcolor: "#6c757d",
                borderRadius: "0",
                padding: "0.45rem 0.9rem",
                textTransform: "none",
                color: "#fff",
                borderRadius: " 0 0.15rem 0.15rem 0",
                "&:hover": { bgcolor: "#5a6268" },
              }}
              size="small"
              onClick={handleMenuOpen}
            >
              Column visibility
            </Button>
            <Menu
              id="column-visibility-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {Object.keys(visibleColumns).map((column) => (
                <MenuItem key={column}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns[column]}
                        onChange={() => handleToggleColumn(column)}
                      />
                    }
                    label={column}
                  />
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <TextField
            label="Search"
            type="search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              color: "#6c757d",
              borderRadius: "0.2rem",
              "& fieldset": { border: "1px solid #ced4da" },
            }}
          />
        </Box>
        <Box>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #dee2e6" }}
          >
            <Table>
              <TableHead
                sx={{ backgroundColor: "white", border: "1px solid #dee2e6" }}
              >
                <TableRow>
                  {visibleColumnsArray.map((column) => (
                    <TableCell
                      key={column}
                      onClick={() => handleSort(column)}
                      sx={{
                        border: "1px solid #dee2e6",
                        borderBottom: "2px solid #dee2e6",
                        color: "#6c757d",
                        fontWeight: "600",
                        fontSize: ".8rem",
                        padding: "13.6px 30px 13.6px 13.6px",
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#f9f9f9" }}>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnsArray.length}
                      align="center"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.Id}>
                        {visibleColumnsArray.map((column) => (
                          <TableCell
                            key={column}
                            sx={{ color: "#6c757d", fontSize: ".8rem" }}
                          >
                            {/* {row[column]} */}
                            {column === "Id" && (
                              row.id
                              )}
                            {column === "Pick List Value" && (
                              row.pick_list_value
                              )}
                            {column === "Pick List Value Type" && (
                              row.pick_list_types.pick_list_type
                              )}
                                 {column === "InActive?" && (
                              row.in_active === 0 ? 'No' : 'Yes'
                              )}
                                 {column === "Created By" && (
                              row.created_by_user.name
                              )}
                               {column === "Created On" && (
                              row.created_at
                              )}
                            {column === "Edit" && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(row.id)}
                                  sx={{ ml: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            {column === "Delete" && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(row.id)}
                                    sx={{ ml: 1 }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="textSecondary">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </Typography>
            <TablePagination
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              rowsPerPageOptions={[]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={() => ""}
            />
          </Box>
        </Box>
      </Box>
      {displayPopup.show && <CustomPopup type={displayPopup.type}  message={displayPopup.mgs} />}
    </Container>
  );
};

export default Picklistvalue;
