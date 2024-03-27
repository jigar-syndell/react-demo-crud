import React, { useEffect, useMemo, useState, useRef } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { IconButton, InputAdornment } from "@mui/material";
import CustomPopup from "../../utils/customPopup";
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
  Stack,
  InputLabel,
} from "@mui/material";
import {
  createItemsGroup,
  deleteItemsGroup,
  getItemsGroups,
  updateItemsGroup,
} from "../../apis/masters/itemsGroup";
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "ItemsGroupMaster",
});

const ItemGroup = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemGroupData, setItemGroupData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [itemGroup, setItemGroup] = useState({
    name: "",
    isactive: 0,
    company_id: 1,
  });
  const [itemGroupType, setItemGroupType] = useState({ label: "", value: "" });
  const [error, setError] = useState({ name: "", type: "" });
  const [isEditopen, setisEditopen] = useState({ edit: false, id: "" });

  const [anchorEl, setAnchorEl] = useState(null);
  const [displayPopup, setDisplayPopup] = useState({
    show: false,
    type: "",
    mgs: "",
  });
  const [visibleColumns, setVisibleColumns] = useState({
    Id: true,
    "Item Group Name": true,
    "Group Type": true,
    "InActive?": true,
    "Created By": true,
    "Created On": true,
    Delete: true,
    Edit: true,
  });

  // fetch latestdata
  const fetchLatestData = () => {
    getItemsGroups()
      .then((response) => {
        if (response.success) {
          console.log(response.data);
          setItemGroupData(response.data);
        } else {
          console.error("Failed to fetch item group:", response.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching item group:", error);
      });
  };

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
    const formattedDataArray = itemGroupData
      .map((item) => {
        return `${item.id}, ${item.item_group_name},${
          item.pick_list_values.pick_list_value
        }, ${item.in_active === 0 ? "No" : "Yes"}, ${
          item.created_by_user.name
        }, ${item.created_at}`;
      })
      .join("\n");

    navigator.clipboard.writeText(formattedDataArray);
    setDisplayPopup({
      show: true,
      type: "success",
      mgs: "Data Copied to Clipboard",
    });
    setTimeout(() => {
      setDisplayPopup({ show: false, type: "", mgs: "" });
    }, 3000);
  };

  const handlePrint = () => {
    // Logic to print table data
    window.print();
  };

  const handleExportCSV = () => {
    const transformedData = itemGroupData.map((item) => ({
      Id: item.id,
      "Item Group Name": item.item_group_name,
      "Group Type": item.pick_list_values.pick_list_value,
      "InActive?": item.in_active === 0 ? "false" : "true",
      "Created By": item.created_by_user.name,
      "Created On": item.created_at,
    }));

    const csv = generateCsv(csvConfig)(transformedData);
    download(csvConfig)(csv);
    setDisplayPopup({ show: true, type: "success", mgs: "CSV file Exported" });
    setTimeout(() => {
      setDisplayPopup({ show: false, type: "", mgs: "" });
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItemsGroup(id)
          .then((response) => {
            if (response.success) {
              Swal.fire({
                title: "Deleted!",
                text: response.message || "Your item group has been created.",
                icon: "success",
              });
              // fetch updated data
              fetchLatestData();
            } else {
              console.log(response.error.data.message);
              Swal.fire({
                title: "Error!",
                text:
                  response.error.data.message ||
                  "Failed to delete the item group.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the item group.",
              icon: "error",
            });
            console.error("Error deleting item group:", error);
          });
      }
    });
  };

  const handleEdit = (id) => {
    setisEditopen({ edit: true, id: id });
    let filteredData = itemGroupData.filter((item) => item.id === id);
    filteredData = filteredData[0];
    console.log(filteredData);
    setItemGroup({
      name: filteredData.item_group_name,
      isactive: filteredData.in_active,
      company_id: 1,
    });
    setItemGroupType({
      label: `${filteredData.pick_list_values.pick_list_value}`,
      value: `${filteredData.pick_list_values.id}`,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });

    // Call the sorting function with the column name
    sortData(column, direction);
  };

  const sortData = (column, direction) => {
    let sortedData = [...itemGroupData];
    if (column === "Id") {
      sortedData.sort((a, b) =>
        direction === "asc" ? a.id - b.id : b.id - a.id
      );
    } else if (column === "Item Group Name") {
      sortedData.sort((a, b) =>
        direction === "asc"
          ? a.item_group_name.localeCompare(b.item_group_name)
          : b.item_group_name.localeCompare(a.item_group_name)
      );
    } else if (column === "Group Type") {
      sortedData.sort((a, b) =>
        direction === "asc"
          ? a.pick_list_values.pick_list_value.localeCompare(
              b.pick_list_values.pick_list_value
            )
          : b.pick_list_values.pick_list_value.localeCompare(
              a.pick_list_values.pick_list_value
            )
      );
    } else if (column === "InActive?") {
      sortedData.sort((a, b) =>
        direction === "asc"
          ? a.in_active - b.in_active
          : b.in_active - a.in_active
      );
    } else if (column === "Created By") {
      sortedData.sort((a, b) =>
        direction === "asc"
          ? a.created_by_user.name.localeCompare(b.created_by_user.name)
          : b.created_by_user.name.localeCompare(a.created_by_user.name)
      );
    } else if (column === "Created On") {
      sortedData.sort((a, b) =>
        direction === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );
    }

    setItemGroupData(sortedData);
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

  const sortedData = useMemo(() => {
    if (sortConfig.direction === "") {
      return itemGroupData;
    }

    return [...itemGroupData].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });
  }, [itemGroupData, sortConfig]);

  const filteredData = sortedData.filter((item) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const visibleColumnsArray = Object.keys(visibleColumns).filter(
    (column) => visibleColumns[column]
  );
  const itemGroupTypes = [
    { label: "Monitor", value: "1" },
    { label: "Printers", value: "2" },
    { label: "Screen Guards", value: "3" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const removeError = () => {
      setTimeout(() => {
        setError({ name: "", type: "" });
      }, 3000);
    };
    if (!itemGroup.name.trim()) {
      setError((prevErrors) => ({
        ...prevErrors,
        name: "Please enter a name",
      }));
      removeError();
      return;
    }
    console.log(itemGroupType);
    if (itemGroupType == null) {
      setError((prevErrors) => ({
        ...prevErrors,
        type: "Please select a type",
      }));
      removeError();
      return;
    }
    // make an api call to save data to database
    try {
      console.log(itemGroup);
      const formData = new FormData();
      formData.append("pick_list_value_id", itemGroupType.value);
      formData.append("item_group_name", itemGroup.name);
      formData.append("in_active", itemGroup.isactive);
      formData.append("company_id", itemGroup.company_id);
      let data;
      console.log(isEditopen.edit);
      if (isEditopen.edit) {
        data = await updateItemsGroup({ data: formData, id: isEditopen.id });
      } else {
        data = await createItemsGroup(formData);
      }
      console.log(data);
      if (!data.success) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${data.error.data.data.item_group_name[0]}`,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setItemGroupType({ label: "", value: "" });
      setItemGroup({ name: "", isactive: 0, company_id: 1 });
      fetchLatestData();
    } catch (error) {
      // handle error here
    }
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
              label="Item Group Name"
              variant="outlined"
              fullWidth
              value={itemGroup.name}
              onChange={(e) => {
                setItemGroup({ ...itemGroup, name: e.target.value });
              }}
              size="small"
              error={!!error.name}
              helperText={error.name}
              sx={{ margin: "0 12px", color: "#6c757d" }}
            />
            <Autocomplete
              options={itemGroupTypes}
              getOptionLabel={(option) => option.label}
              fullWidth
              value={itemGroupType}
              onChange={(event, value) => {
                setError((prevErrors) => ({ ...prevErrors, name: "" }));
                setItemGroupType(value);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Group Type"
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
              control={<Checkbox checked={!!itemGroup.isactive} />}
              label="IsActive"
              onChange={(e) =>
                setItemGroup({
                  ...itemGroup,
                  isactive: e.target.checked ? 1 : 0,
                })
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
            "@media (max-width: 800px)": {
              flexDirection: "column",
              alignItems: "center",
              rowGap: "10px",
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
                      <TableRow key={row.id}>
                        {visibleColumnsArray.map((column) => (
                          <TableCell
                            key={column}
                            sx={{ color: "#6c757d", fontSize: ".8rem" }}
                          >
                            {/* {row[column]} */}
                            {column === "Id" && row.id}
                            {column === "Item Group Name" &&
                              row.item_group_name}
                            {column === "Group Type" &&
                              row.pick_list_values.pick_list_value}
                            {column === "InActive?" &&
                              (row.in_active === 0 ? "No" : "Yes")}
                            {column === "Created By" &&
                              row.created_by_user.name}
                            {column === "Created On" && row.created_at}
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
      {displayPopup.show && (
        <CustomPopup type={displayPopup.type} message={displayPopup.mgs} />
      )}
    </Container>
  );
};

export default ItemGroup;
