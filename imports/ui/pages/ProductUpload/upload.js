import { Button, Form } from 'antd';
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ModuleHeading from '../ModuleHeading'
import * as XLSX from "xlsx";

function ProductUpload() {
  const [form] = Form.useForm();

  const [massData, setMassData] = useState('')
  const upLoadExcelDataForProductDetails = () => {
    Meteor.call("productcat.test",massData, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        alert("upload Successfully")
      }
      else {
        console.log(error)
      }
    });
  }
  const uploadExcelForProduct = async (e) => {
    if (e.target.files.length === 0) return;

    if (e.target.files) {
      console.log(e.target.files)

      let fileParts = e.target.files[0].name.split('.')
      let fileSize = e.target.files[0].size;
      let fileName = fileParts[0];
      let fileType = fileParts[1];
      // productcat.test

      let f = e.target.files[0];
      let name = f.name;
      const reader = new FileReader();
      reader.onload = (evt) => {

        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        console.log("Data>>>" + data);// shows that excel data is read
        let lines = data.split("\n");
        let result = [];
        let headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }

        console.log(JSON.stringify(result))
        let JSONFulldataFromExcel = JSON.parse(JSON.stringify(result))
        console.log(JSONFulldataFromExcel.length)
        let roleNames
        let roles
        let massUploadData = []

        JSONFulldataFromExcel && JSONFulldataFromExcel.length > 0 && JSONFulldataFromExcel.map((data, index) => {
          if (data['Product Category Name']) {

            let collectedData = {
              'productCategoryName': data['Product Category Name'] ? data['Product Category Name'] : '',
              'productName': data['Product Name'] ? data['Product Name'] : '',
              'productSize': data['Size'] ? data['Size'] : '',
              'productPrice': data['Price'] ? data['Price'] : '200',
            }
            massUploadData.push(collectedData)
            console.log(massUploadData)

            setMassData(massUploadData)
            // setFile(e.target.files[0])
          } else {
          }

        })
      };
      reader.readAsBinaryString(f);
    }
  }
  return (
    <div>
        <ModuleHeading module='Upload Product Module'/>
        <Form
        form={form}>
            <input id="file-upload" accept=".xlsx,.xls,.csv" type="file" name="file-upload" onChange={(e) => uploadExcelForProduct(e, '')} />
            <Button type="primary" onClick={upLoadExcelDataForProductDetails}>Submit</Button>
        </Form>
        <Outlet/>
    </div>
  )
}

export default ProductUpload
