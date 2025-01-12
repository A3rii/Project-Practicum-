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
  Button,
  Chip,
} from "@mui/material";
import {
  Replay as ReplayIcon,
  IosShare as IosShareIcon,
} from "@mui/icons-material";
import { formatDate } from "../../../utils/timeCalculation";
import { paymentAPI } from "../../../api/admin";
import DetailPayment from "../../../components/AdminComponent/Payment/DetailPayment";

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
  const [filters, setFilters] = useState({ date: null, userName: "" });
  const [modalState, setModalState] = useState({
    open: false,
    selectedPayment: null,
  });

  const { data: payments = [], isError } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentAPI.getPayments,
  });

  const filteredPayments = useMemo(() => {
    if (!payments?.length) return [];

    return payments.filter((data) => {
      const nameMatch = data?.user?.name
        ?.toLowerCase()
        .includes(filters?.userName.toLowerCase());
      const dateMatch = filters.date
        ? formatDate(data?.booking?.date) === formatDate(filters.date)
        : true;
      return dateMatch && nameMatch;
    });
  }, [payments, filters]);

  const handleOpenDetail = (payment) => {
    setModalState({ open: true, selectedPayment: payment });
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
            <Button variant="contained" startIcon={<IosShareIcon />}>
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
      </Paper>
    </>
  );
}
