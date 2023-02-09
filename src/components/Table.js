import React, { useState } from "react";
import "./Table.css";
const Table = ({ data }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(1);
  const [filters, setFilters] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingCell, setEditingCell] = useState(null);

  if (!data || data.length === 0) {
    return <div>No data to display. please add excel file.</div>;
  }
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection * -1);
    } else {
      setSortBy(key);
      setSortDirection(1);
    }
  };
  const handleFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  const handleDropdown = (key) => {
    setDropdownOpen(key === dropdownOpen ? null : key);
  };
  const handleEdit = (rowIndex, cellIndex) => {
    setEditingCell({ rowIndex, cellIndex });
  };
  const handleSave = (rowIndex, cellIndex, value) => {
    data[rowIndex][Object.keys(data[rowIndex])[cellIndex]] = value;
    setEditingCell(null);
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key].length) return true;
      return row[key]
        .toString()
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    });
  });
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;
    if (a[sortBy] < b[sortBy]) {
      return -1 * sortDirection;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1 * sortDirection;
    }
    return 0;
  });

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key, index) => (
            <th key={index}>
              {key}
              <div
                id="dropdown"
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  width: "3px",
                  height: "3px",
                }}
                onClick={() => handleDropdown(key)}
              >
                ▼
              </div>
              {dropdownOpen === key && (
                <div>
                  <input
                    placeholder="type to filter"
                    type="text"
                    onChange={(e) => handleFilter(key, e.target.value)}
                  />
                  <button
                    id="button"
                    placeholder="sort"
                    style={{
                      width: "100%",
                      border: "none",
                      height: "25px",
                    }}
                    onClick={() => handleSort(key)}
                  >
                    Sort
                    {sortBy === key
                      ? sortDirection === 1
                        ? " Dec"
                        : " Asc"
                      : ""}
                  </button>
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.keys(row).map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onClick={() => handleEdit(rowIndex, cellIndex)}
              >
                {editingCell &&
                editingCell.rowIndex === rowIndex &&
                editingCell.cellIndex === cellIndex ? (
                  <input
                    type="text"
                    defaultValue={row[cell]}
                    onBlur={(e) =>
                      handleSave(rowIndex, cellIndex, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave(rowIndex, cellIndex, e.target.value);
                      }
                    }}
                  />
                ) : (
                  row[cell]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
