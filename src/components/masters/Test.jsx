import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css";
import "datatables.net-buttons/js/buttons.colVis";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-responsive-bs4";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import CustomPopup from "../../utils/customPopup";

const Test = () => {
    const tableRef = useRef(null);
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
  
    useEffect(() => {
      const table = $(tableRef.current).DataTable({
        data: mockData,
        columns: [
          { title: "Id", data: "Id" },
          { title: "Name", data: "Name" },
          { title: "Image", data: "Image" },
          { title: "Group", data: "group" },
          { title: "UoM", data: "UoM" },
          { title: "MRP", data: "MRP" },
          { title: "InActive", data: "inActive" },
          { title: "CreatedBy", data: "createdBy" },
          { title: "CreatedOn", data: "createdOn" },
        ],
        dom: 'lBfrtip',
        buttons: [
          'copy', 'csv', 'print',
        ],
        responsive: true,
      });
  
      return () => {
        table.destroy();
      };
    }, []);
  
    const handleDelete = (id) => {
      console.log("Delete item with id:", id);
    };
  
    const handleEdit = (id) => {
      console.log("Edit item with id:", id);
    };
  
    return (
      <div>
        <table ref={tableRef} className="table table-bordered" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Image</th>
              <th>Group</th>
              <th>UoM</th>
              <th>MRP</th>
              <th>InActive</th>
              <th>CreatedBy</th>
              <th>CreatedOn</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <CustomPopup />
      </div>
    );
  };
  
  export default Test;
