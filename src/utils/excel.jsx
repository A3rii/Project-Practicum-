import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate, totalHour } from "./../utils/timeCalculation";

export const exportToExcel = (dataset, type) => {
  // Check whether the dataset is an array
  if (!Array.isArray(dataset)) {
    throw new Error("Dataset must be an array");
  }

  // Map dataset based on the type
  const reportManage = dataset.map((item) => {
    if (type === "bookings") {
      return {
        user: item.user?.name || item.outside_user?.name || "N/A",
        phone_number:
          item.user?.phone_number || item.outside_user?.phone_number || "N/A",
        facility: item.facility || "N/A",
        court: item.court || "N/A",
        date: item.date || "N/A",
        time: formatDate(item.date),
        hour: totalHour(item.startTime, item.endTime),
        status: item.status || "N/A",
      };
    } else if (type === "payments") {
      return {
        user: item.user.name || "N/A",
        phone: item.user.phone_number || "N/A",
        amount: item.amount || "N/A",
        currency: item.currency || "N/A",
        date: item.booking ? formatDate(item?.booking?.date) : "N/A",
        status: item.status || "N/A",
      };
    } else {
      throw new Error("Unknown dataset type");
    }
  });

  // Create a worksheet from the processed dataset
  const worksheet = XLSX.utils.json_to_sheet(reportManage);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Generate Excel file and save it
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `report-${type}.xlsx`);
};
