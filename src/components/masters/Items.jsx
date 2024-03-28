import React, { useEffect, useState, useRef } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { IconButton, InputAdornment } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
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
} from "@mui/material";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import CustomPopup from "../../utils/customPopup";
import { deleteItems, getItems } from "../../apis/masters/items";
const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "ItemsMaster" });

const Items = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [displayPopup, setDisplayPopup] = useState({
    show: false,
    type: "",
    mgs: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    Id: true,
    Name: true,
    Image: true,
    group: true,
    UoM: true,
    MRP: true,
    inActive: true,
    createdBy: true,
    createdOn: true,
    Delete: true,
    Edit: true,
  });
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);


  // fetch latestdata
  const fetchLatestData = () => {
    getItems()
      .then((response) => {
        if (response.success) {
          console.log(response.data);
          setItemsData(response.data);
        } else {
          console.error("Failed to fetch items:", response.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
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
        deleteItems(id)
          .then((response) => {
            if (response.success) {
              Swal.fire({
                title: "Deleted!",
                text:
                  response.message || "Your Pick List value has been created.",
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
                  "Failed to delete the Pick List value.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the Pick List value.",
              icon: "error",
            });
            console.error("Error deleting Pick List value:", error);
          });
      }
    });
  };
  const handleEdit = (id) => {
    navigate(`/item/edit/${id}`);
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

  const handleExportCSV = () => {
    console.log(itemsData);
    const transformedData = itemsData.map((item) => ({
      Id: item.id,
      Name: item.item_title,
      Image: item.item_image_path,
      Group: item.item_groups.item_group_name,
      UoM: item.pick_list_values.pick_list_value,
      MRP: item.mrp,
      InActive: item.in_active === 0 ? "false" : "true",
      CreatedBy: item.created_by_user.name,
      CreatedOn: item.created_at,
    }));

    const csv = generateCsv(csvConfig)(transformedData);
    download(csvConfig)(csv);
    setDisplayPopup({ show: true, type: "success", mgs: "CSV file Exported" });
    setTimeout(() => {
      setDisplayPopup({ show: false, type: "", mgs: "" });
    }, 3000);
  };

  const handlePrint = () => {
    // Clone the table container
    const printContents = tableContainerRef.current.cloneNode(true);
    // Get the table element from the cloned contents
    const table = printContents.querySelector('table');
  
    // Apply basic styling to the table for printing
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.border = '1px solid #000';
  
    // Loop through all table cells and apply padding and border
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
    });
  
    // Apply background color and font weight to table headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      header.style.backgroundColor = '#f2f2f2';
      header.style.fontWeight = 'bold';
    });
  
    // Open a new window and append the modified contents
    const printWindow = window.open('', '_blank');
    printWindow.document.body.appendChild(printContents);
    // Print the window
    printWindow.print();
    printWindow.close()
};



  const handleCopyVisibleData = () => {
    const formattedDataArray = itemsData
      .map((item) => {
        return `${item.id}, ${item.item_title}, ${item.item_image_path}, ${
          item.item_groups.item_group_name
        }, ${item.mrp}, ${item.in_active === 0 ? "No" : "Yes"}, ${
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

  const sortedData = itemsData.sort((a, b) => {
    if (sortConfig.direction === "") {
      return;
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

  return (
    <Container className="bg-white p-6 mb-6 rounde">
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#5671f0",
            borderColor: "#5671f0",
            textTransform: "none",
            boxShadow: "0 0 0 rgba(86,113,240,.5)",
            "&:hover": {
              backgroundColor: "#3353ed",
              borderColor: "#274aec",
            },
          }}
          onClick={() => {
            navigate("/item/create");
          }}
        >
          Add New
        </Button>
      </Box>
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
                  borderColor: "#6c757d",
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
      <Box ref={tableContainerRef} >
        <TableContainer component={Paper} sx={{ border: "1px solid #dee2e6" }}>
          <Table sx={{ overflowX: "auto" }}>
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
                          {column === "Image" && (
                            <img
                              src={row.item_image_path}
                              alt={row.item_image}
                              style={{ width: 50, height: 50 }}
                            />
                          )}
                          {column === "Id" && row.id}
                          {column === "Name" && row.item_title}
                          {column === "group" &&
                            row.item_groups.item_group_name}
                          {column === "UoM" && row.item_groups.item_group_name}
                          {column === "MRP" && row.mrp}
                          {column === "inActive" &&
                            (row.in_active === 0 ? "No" : "Yes")}
                          {column === "createdBy" && row.created_by_user.name}
                          {column === "createdOn" && row.created_at}
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
      {displayPopup.show && (
        <CustomPopup type={displayPopup.type} message={displayPopup.mgs} />
      )}
    </Container>
  );
};

export default Items;
