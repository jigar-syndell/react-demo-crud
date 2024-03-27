import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateItem from "./CreateItem";
import { getsingleItem, updateItems } from "../../apis/masters/items";

function EditItem() {
  const { id } = useParams();
  const [data, setData] = useState(null); // State to hold the fetched data

  useEffect(() => {
    // Function to fetch data
    const fetchLatestData = async () => {
      try {
        const response = await getsingleItem(id);
        if (response.success) {
          console.log(response.data);
          const newData = {
            itemCode: response.data.item_code,
            itemTitle: response.data.item_title,
            itemGroup: response.data.item_group_id,
            itemUoM: response.data.uom_pl,
            isActive: response.data.in_active,
            mrp: response.data.mrp,
            image: response.data.item_image_path,
            closing_stock: response.data.closing_stock,
            company_id: response.data.company_id,
            imagePreview: response.data.item_image_path,
          };
          console.log(newData);
          setData(newData); // Set the fetched data to state
        } else {
          console.error("Failed to fetch items:", response.error);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchLatestData(); // Call the function to fetch data
  }, [id]); // Ensure useEffect runs when id changes

  const handleSubmit = async (itemFormData) => {
    try {
      // Make API request to update item data
      // Handle success
      const formData = new FormData();
      console.log(itemFormData);
      formData.append("item_code", itemFormData.itemCode);
      formData.append("item_title", itemFormData.itemTitle);
      formData.append("item_group_id", itemFormData.itemGroup.id);
      formData.append("item_image", itemFormData.image);
      formData.append("uom_pl", itemFormData.itemUoM.id);
      formData.append("mrp", itemFormData.mrp);
      formData.append("closing_stock", itemFormData.closing_stock);
      formData.append("in_active", itemFormData.isActive);
      formData.append("company_id", itemFormData.company_id);
      console.log(formData);
      const response = updateItems({ data: formData, id: id });
      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div>
      {data && <CreateItem initialValues={data} onSubmit={handleSubmit} />}{" "}
      {/* Render CreateItem only when data is available */}
    </div>
  );
}

export default EditItem;
