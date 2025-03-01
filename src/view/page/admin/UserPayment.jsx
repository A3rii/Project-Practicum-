import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Tooltip,
  Pagination,
  PaginationItem,
  Button,
  Chip,
} from "@mui/material";
import {
  Replay as ReplayIcon,
  IosShare as IosShareIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { formatDate } from "../../../utils/timeCalculation";
import { paymentAPI } from "../../../api/admin";
import DetailPayment from "../../../components/AdminComponent/Payment/DetailPayment";
import { exportToExcel } from "./../../../utils/excel";
const PaymentTableRow = ({ data, onOpenDetail }) => (
  <TableRow>
    <TableCell>
      {data?.user?.name || data?.outside_user?.name || "N/A"}
    </TableCell>
    <TableCell>
      {data?.user?.phone_number || data?.outside_user?.phone_number || "N/A"}
    </TableCell>
    <TableCell>
      {data.amount} {data?.currency === "khr" ? "៛" : "$"}
    </TableCell>
    <TableCell>{data?.currency || "N/A"}</TableCell>
    <TableCell>{formatDate(data?.booking?.date) || "N/A"}</TableCell>
    <TableCell>
      <Button size="small" onClick={() => onOpenDetail(data)}>
        Detail
      </Button>
    </TableCell>
    <TableCell>
      <Chip
        label={data.status}
        size="small"
        sx={{
          backgroundColor: "#e0f7fa",
          color: "#00796b",
          fontWeight: "500",
        }}
      />
    </TableCell>
  </TableRow>
);

export default function UserPayment() {
  const [filters, setFilters] = useState({
    date: null,
    userName: "",
    pageTotal: 1,
  });
  const [modalState, setModalState] = useState({
    open: false,
    selectedPayment: null,
  });

  const { data: paymentsUser = [], isError } = useQuery({
    queryKey: ["payments", filters.pageTotal],
    queryFn: () => paymentAPI.getPayments(filters.pageTotal),
    keepPreviousData: true,
  });

  const filteredPayments = useMemo(() => {
    // Ensure paymentsUser exists and has a payments array
    if (!paymentsUser || !paymentsUser.payments?.length) {
      return [];
    }

    // Apply the filters
    return paymentsUser.payments.filter((data) => {
      const nameMatch = data?.user?.name
        ?.toLowerCase()
        ?.includes(filters?.userName.toLowerCase() || ""); // Safely handle null/undefined
      const dateMatch = filters.date
        ? formatDate(data?.booking?.date) === formatDate(filters.date)
        : true;
      return dateMatch && nameMatch;
    });
  }, [paymentsUser, filters]);

  const handleOpenDetail = (payment) => {
    setModalState({ open: true, selectedPayment: payment });
  };

  const downloadDataReport = (listPayment) => {
    if (listPayment.length === 0) {
      return;
    }
    exportToExcel(listPayment, "payments");
  };

  if (isError) return <p>Error fetching data</p>;

  return (
    <>
      <DetailPayment
        open={modalState.open}
        closeModal={() => setModalState({ open: false, selectedPayment: null })}
        payment={modalState.selectedPayment}
      />
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          padding: "15px",
          marginLeft: "2rem",
          border: 0,
          borderTop: 0,
          borderRadius: 0,
        }}
        elevation={0}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}>
            <ReplayIcon
              onClick={() => setFilters({ date: null, userName: "" })}
              sx={{ cursor: "pointer" }}
            />
            <TextField
              value={filters.userName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, userName: e.target.value }))
              }
              size="small"
              label="Search"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={filters.date}
                onChange={(newValue) =>
                  setFilters((prev) => ({ ...prev, date: newValue }))
                }
                sx={{ width: 150 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </div>
          <Tooltip title="Export report">
            <Button
              variant="contained"
              onClick={() => downloadDataReport(filteredPayments)}
              startIcon={<IosShareIcon />}>
              Export
            </Button>
          </Tooltip>
        </div>

        <Divider />

        <TableContainer style={{ height: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "User",
                  "Phone",
                  "Amount",
                  "Currency",
                  "Date",
                  "Detail",
                  "Status",
                ].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((data, index) => (
                  <PaymentTableRow
                    key={index}
                    data={data}
                    onOpenDetail={handleOpenDetail}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={paymentsUser.totalPages}
          page={filters.pageTotal}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, pageTotal: value }))
          }
          sx={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "2rem",
          }}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Paper>
    </>
  );
}
