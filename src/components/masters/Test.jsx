import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteItems, getItems } from "../../apis/masters/items";

const Items = () => {
  const [itemsData, setItemsData] = useState([]);
  const navigate = useNavigate();

  // Fetch latest data
  const fetchLatestData = () => {
    getItems()
      .then((response) => {
        if (response.success) {
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
                text: response.message || "Your item has been deleted.",
                icon: "success",
              });
              // Fetch updated data
              fetchLatestData();
            } else {
              Swal.fire({
                title: "Error!",
                text: response.error.data.message || "Failed to delete the item.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the item.",
              icon: "error",
            });
            console.error("Error deleting item:", error);
          });
      }
    });
  };

  const columns = [
    { name: "id", label: "ID" },
    { name: "item_title", label: "Name" },
    { 
      name: "item_image_path", 
      label: "Image",
      options: {
        customBodyRender: (value) => <img src={value} alt="Item Image" style={{ width: '50px', height: '50px' }} />,
      },
    },
    { name: "item_groups.item_group_name", label: "Group" },
    { name: "pick_list_values.pick_list_value", label: "UoM" },
    { name: "mrp", label: "MRP" },
    { name: "in_active", label: "InActive" },
    { name: "created_by_user.name", label: "CreatedBy" },
    { name: "created_at", label: "CreatedOn" },
    {
      name: "Edit",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <IconButton size="small" onClick={() => handleEdit(value)}>
            <EditIcon />
          </IconButton>
        ),
      },
    },
    {
      name: "Delete",
      options: {
        customBodyRender: (value) => (
          <IconButton size="small" onClick={() => handleDelete(value)}>
            <DeleteIcon />
          </IconButton>
        ),
      },
    },
  ];
  

  const options = {
    search: true,
    print: true,
    download: true,
    pagination: true,
    viewColumns: true,
    customToolbar: () => (
      <Button variant="contained" onClick={() => navigate("/item/create")}>
        Add New
      </Button>
    ),
    onRowsDelete: (rowsDeleted) => {
      // Handle row deletion if needed
    },
  };

  return (
    <MUIDataTable
      title={"Items"}
      data={itemsData}
      columns={columns}
      options={options}
    />
  );
};

export default Items;
