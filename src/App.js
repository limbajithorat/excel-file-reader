import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import Table from "./components/Table";
const App = () => {
  const [data, setData] = useState([]);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      setData(XLSX.utils.sheet_to_json(worksheet));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <div className="subsection">
        <h1 className="heading">Excel File Reader</h1>
        <input type="file" onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      <Table data={data} />
    </div>
  );
};

export default App;
