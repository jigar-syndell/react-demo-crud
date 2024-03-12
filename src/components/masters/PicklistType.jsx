import React, { useState } from "react";
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
import { IconButton, InputAdornment } from '@mui/material';
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
const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: "ItemsMaster" });

const generateMockData = () => {
  const mockData = [];
  for (let i = 1; i <= 100; i++) {
    mockData.push({
      Id: i,
      Name: `Item ${i}`,
      Image: `https://picsum.photos/seed/picsum/200/300`,
      group: `Group ${(i % 5) + 1}`,
      UoM: i % 2 === 0 ? "pcs" : "kg",
      MRP: Math.floor(Math.random() * 500) + 50,
      inActive: i % 3 === 0 ? "True" : "False",
      createdBy: `User ${(i % 3) + 1}`,
      createdOn: "2022-01-01", // Assuming all items are created on the same date
    });
  }
  return mockData;
};

const mockData = generateMockData();
// function Dashboard() {
function PicklistType() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
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
      console.log(id);
    };
    const handleEdit = (id) => {
      console.log(id);
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
      // Logic to export table data to CSV
      const csv = generateCsv(csvConfig)(mockData);
      download(csvConfig)(csv);
    };
  
    const handlePrint = () => {
      // Logic to print table data
      window.print();
    };
  
    const handleCopyVisibleData = () => {
      const visibleData = mockData
        .map((item) => {
          return Object.keys(item)
            .filter((key) => visibleColumns[key])
            .map((key) => item[key])
            .join(", ");
        })
        .join("\n");
      navigator.clipboard.writeText(visibleData);
    };
  
    const sortedData = mockData.sort((a, b) => {
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
          <TableContainer component={Paper} sx={{ border: "1px solid #dee2e6" }}>
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
                        <TableCell key={column} sx={{ color: "#6c757d", fontSize: ".8rem" }}>
                        {column === "Image" ? (
                          <img
                            src={row[column]}
                            alt={row.Name}
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          <>{row[column]}</>
                        )}
                         {column === "Edit" && (
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row.Id)}
                                sx={{ ml: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                        {column === "Delete" && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(row.Id)}
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
      </Container>
    );
}

export default PicklistType