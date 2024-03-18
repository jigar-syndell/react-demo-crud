import React from 'react';
import { useParams } from 'react-router-dom';
import CreateItem from './CreateItem';

function EditItem() {
  const { id } = useParams();

  // Fetch the item data based on the ID
  const fetchItemData = () => {
    try {
        console.log(id)
        // make API call to fetch databy id 
        const data = {
            "itemCode": "Test code",
            "itemTitle": "Test Title",
            "itemGroup": "Group1",
            "itemUoM": "Test",
            "isActive": true,
            "mrp": "521",
            "imagePreview": "blob:http://localhost:5173/39c6c8ba-3d74-458a-b20e-6f8b77dd8836",
            "image": {}
        }
        return data
 
    } catch (error) {
      console.error('Error fetching item data:', error);
      return null;
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Make API request to update item data
    //  make api call to update data based on id
      // Handle success
      console.log('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div>
      <CreateItem initialValues={fetchItemData()} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditItem;
